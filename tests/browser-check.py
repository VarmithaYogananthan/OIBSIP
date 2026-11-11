from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse, json, math, urllib.request
parser=argparse.ArgumentParser(description='Optional full browser verification; run a static server first.')
parser.add_argument('--base-url',default='http://127.0.0.1:8000/')
parser.add_argument('--chromium',default='/usr/bin/chromium')
args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1]
BASE=args.base_url.rstrip('/')+'/'
FOLDERS=['WebDev-L1-LandingPage','WebDev-L1-Portfolio','WebDev-L1-TemperatureConverter']
WIDTHS=[320,375,390,768,1024,1440,1920]
report={'layout_checks':0,'anchor_clicks':0,'local_link_clicks':0,'screenshots':0,'external_urls':{},'valid_cases':0,'invalid_cases':0,'example_checks':0,'feature_checks':0,'errors':[]}
external=set()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=args.chromium,args=['--no-sandbox'])
 for folder in FOLDERS:
  context=browser.new_context(java_script_enabled=folder.endswith('TemperatureConverter'),reduced_motion='reduce')
  page=context.new_page()
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  def response(res):
   if res.url.startswith(BASE) and res.status>=400: report['errors'].append(f'{res.status} {res.url}')
  page.on('response',response)
  for width in WIDTHS:
   page.set_viewport_size({'width':width,'height':1000 if width>=1024 else 844})
   url=BASE+folder+'/'
   page.goto(url)
   page.wait_for_load_state('networkidle')
   assert page.locator('h1').count()==1
   assert page.locator('link[rel="stylesheet"]').evaluate('(el)=>Boolean(el.sheet)'),folder
   assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),f'{folder}: overflow at {width}'
   assert page.evaluate('Array.from(document.images).every(img=>img.complete && img.naturalWidth>0)'),folder
   boxes=[a.bounding_box() for a in page.locator('header a').all()]
   for i,a in enumerate(boxes):
    assert a and a['x']>=-.1 and a['x']+a['width']<=width+.1,(folder,width,a)
    for b in boxes[i+1:]:
     assert not (min(a['x']+a['width'],b['x']+b['width'])-max(a['x'],b['x'])>1 and min(a['y']+a['height'],b['y']+b['height'])-max(a['y'],b['y'])>1),f'Header overlap {folder} {width}'
   # Check all anchors through real clicks; skip links get separate keyboard checks.
   for link in page.locator('a:not(.skip):not(.skip-link)').all():
    href=link.get_attribute('href')
    assert href and href!='#'
    if href.startswith('#'):
     assert page.locator(href).count()==1,(folder,href)
     if not link.is_visible() and link.locator('xpath=ancestor::details[1]').count():
      item=link.locator('xpath=ancestor::details[1]')
      if item.get_attribute('open') is None: item.locator('summary').click()
     link.click()
     assert page.evaluate('location.hash')==href
     report['anchor_clicks']+=1
    elif href.startswith('https:'): external.add(href)
    elif href.startswith('mailto:'): assert href.startswith('mailto:yvarmitha@gmail.com')
    else:
     target=link.evaluate('(el)=>el.href')
     result=page.request.get(target);assert result.ok,(target,result.status)
     link.click();assert page.url==target
     page.goto(url);report['local_link_clicks']+=1
   page.goto(url)
   page.keyboard.press('Tab')
   assert page.locator(':focus').inner_text().startswith('Skip to')
   assert page.locator(':focus').evaluate('(el)=>getComputedStyle(el).outlineStyle')!='none'
   page.keyboard.press('Enter')
   for _ in range(8):
    page.keyboard.press('Tab');assert page.locator(':focus').count()==1
   # Test every converter example at every width, including the absolute-zero example.
   if folder.endswith('TemperatureConverter'):
    for button in page.locator('.sample-row button').all():
     button.click()
     assert page.locator('#error').inner_text()==''
     assert page.locator('#temperature').input_value()==button.get_attribute('data-value')
     assert page.locator('#unit').input_value()==button.get_attribute('data-unit')
     assert page.locator('#result-C').inner_text()!='—'
     report['example_checks']+=1
    page.locator('#temperature').fill('1e100');page.locator('#temperature').press('Enter')
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),f'Large result overflow {width}'
    page.get_by_role('button',name='Reset',exact=True).click()
    assert page.locator('#temperature').input_value()==''
    assert page.locator('#unit').input_value()=='C'
    assert all(page.locator('#result-'+s).inner_text()=='—' for s in 'CFK')
    assert page.locator('#error').inner_text()==''
    page.locator('summary').click();assert page.locator('details').get_attribute('open') is not None
    page.locator('summary').click();assert page.locator('details').get_attribute('open') is None
   # HTML/CSS only: filtering, expandable outlines, planning controls and FAQs.
   if folder.endswith('LandingPage') and width in (390,1440):
    page.locator('label[for="track-web"]').click()
    assert page.locator('.course-card:visible').count()==1
    assert page.locator('.course-card[data-track="web"]:visible').count()==1
    page.locator('label[for="track-design"]').click()
    assert page.locator('.course-card[data-track="design"]:visible').count()==1
    page.locator('label[for="track-code"]').click()
    assert page.locator('.course-card[data-track="code"]:visible').count()==1
    page.locator('label[for="track-all"]').click()
    assert page.locator('.course-card:visible').count()==3
    page.locator('.course-outline').first.locator('summary').click()
    assert page.locator('.course-outline').first.get_attribute('open') is not None
    page.locator('label[for="pace-30"]').click()
    assert page.locator('.plan-30').is_visible()
    assert not page.locator('.plan-15').is_visible()
    page.locator('label[for="pace-60"]').click()
    assert page.locator('.plan-60').is_visible()
    page.locator('.faq-list details').first.locator('summary').click()
    assert page.locator('.faq-list details').first.get_attribute('open') is not None
    report['feature_checks']+=9
   # Check content boxes fit; decorative overflow is clipped within artwork.
   for el in page.locator('main section, article, .button, input, select, .result-card').all():
    b=el.bounding_box()
    assert b['x']>=-.1 and b['x']+b['width']<=width+.1,(folder,width,el.get_attribute('class'),b)
   assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto'
   if width in [390,1440]:
    page.goto(url)
    if folder.endswith('TemperatureConverter'):page.get_by_role('button',name='Mild day 25 °C').click()
    page.evaluate("document.activeElement.blur(); window.scrollTo({top:0,behavior:'instant'})")
    assert abs(page.locator('header').bounding_box()['y'])<1
    page.screenshot(path=str(ROOT/folder/'screenshots'/('mobile.png' if width==390 else 'desktop.png')),full_page=True)
    report['screenshots']+=1
   report['layout_checks']+=1
  context.close()
 # Focused converter behavior checks, including the supplied reference cases.
 context=browser.new_context(reduced_motion='reduce',accept_downloads=True,permissions=['clipboard-read','clipboard-write'])
 page=context.new_page()
 page.set_viewport_size({'width':390,'height':844})
 page.goto(BASE+FOLDERS[2]+'/')
 def submit(value,unit):
  page.locator('#temperature').fill(value);page.select_option('#unit',unit);page.get_by_role('button',name='Convert temperature').click()
 def values():return {s:float(page.locator('#result-'+s).inner_text().replace(',','')) for s in 'CFK'}
 cases=[('0','C',{'C':0,'F':32,'K':273.15}),('100','C',{'C':100,'F':212,'K':373.15}),('25','C',{'C':25,'F':77,'K':298.15}),('32','F',{'C':0,'F':32,'K':273.15}),('0','K',{'C':-273.15,'F':-459.67,'K':0}),('-273.15','C',{'K':0,'F':-459.67}),('-459.67','F',{'K':0,'C':-273.15}),('-40','C',{'F':-40,'K':233.15}),('98.6','F',{'C':37,'K':310.15}),(' .5 ','C',{'F':32.9,'K':273.65}),('1e3','C',{'F':1832,'K':1273.15}),('273.15','K',{'C':0,'F':32})]
 for value,unit,expected in cases:
  submit(value,unit);assert page.locator('#error').inner_text()==''
  actual=values()
  for k,v in expected.items():assert math.isclose(actual[k],v,rel_tol=1e-6,abs_tol=1e-6),(value,unit,k,actual[k],v)
  report['valid_cases']+=1
 for value,unit in [('', 'C'),('abc','C'),('12abc','C'),('0x10','C'),('Infinity','C'),('NaN','C'),('1e999','C'),('1,5','C'),('-273.15001','C'),('-459.67001','F'),('-0.000001','K'),('1.79e308','K')]:
  submit(value,unit);assert page.locator('#error').inner_text()
  assert page.locator('#temperature').get_attribute('aria-invalid')=='true'
  assert page.locator('#temperature').evaluate('(el)=>el===document.activeElement')
  assert all(page.locator('#result-'+s).inner_text()=='—' for s in 'CFK')
  report['invalid_cases']+=1
 page.locator('#temperature').fill('25');page.select_option('#unit','C');page.locator('#temperature').press('Enter');assert values()['F']==77
 page.select_option('#unit','F');assert page.locator('#result-F').inner_text()=='—';assert page.locator('#input-symbol').inner_text()=='°F'
 page.locator('#temperature').fill('not a number');page.locator('#temperature').press('Enter');assert page.locator('#error').inner_text()
 page.get_by_role('button',name='Reset',exact=True).click();assert page.locator('#error').inner_text()=='';assert page.locator('#temperature').get_attribute('aria-invalid') is None
 page.locator('#temperature').fill('25');page.locator('#temperature').press('Enter');page.locator('#temperature').fill('26');assert page.locator('#result-C').inner_text()=='—'
 # V2 converter: live preview, result focus/swap, precision, local history, export and theme.
 page.get_by_role('button',name='Reset',exact=True).click()
 page.locator('#live-mode').check()
 page.locator('#temperature').fill('25')
 assert values()['F']==77
 page.locator('#temperature').fill('not-a-number')
 assert page.locator('#error').inner_text()
 assert page.locator('#result-C').inner_text()=='—'
 page.locator('#live-mode').uncheck()
 report['feature_checks']+=3
 page.locator('#temperature').fill('25')
 page.select_option('#unit','C')
 page.get_by_role('button',name='Convert temperature').click()
 assert page.locator('#copy-all').is_enabled()
 assert page.locator('.copy-scale:enabled').count()==3
 assert page.locator('#history-list li').count()>=1
 page.locator('#copy-all').click()
 assert 'copied' in page.locator('#copy-status').inner_text().lower()
 assert 'C:' in page.evaluate('navigator.clipboard.readText()')
 with page.expect_download() as download_info:
  page.locator('#export-history').click()
 assert download_info.value.suggested_filename=='tempconvert-history.csv'
 report['feature_checks']+=5
 page.select_option('#precision','2')
 assert page.locator('#result-K').inner_text()=='298.15'
 page.select_option('#target-unit','F')
 page.locator('#swap-units').click()
 assert page.locator('#temperature').input_value()=='77'
 assert page.locator('#unit').input_value()=='F'
 assert page.locator('#target-unit').input_value()=='C'
 assert values()['C']==25
 report['feature_checks']+=5
 page.locator('#theme-toggle').click()
 assert page.locator('body').evaluate('(el)=>el.classList.contains("light-theme")')
 page.reload()
 assert page.locator('body').evaluate('(el)=>el.classList.contains("light-theme")')
 assert page.locator('#history-list li').count()>=1
 page.locator('#theme-toggle').click()
 report['feature_checks']+=3
 page.locator('#history-list li').first.get_by_role('button',name='Use',exact=False).click()
 assert page.locator('#result-C').inner_text()!='—'
 page.locator('#clear-history').click()
 assert page.locator('#history-list li').count()==0
 assert page.locator('#export-history').is_disabled()
 report['feature_checks']+=3
 # Normal motion: every site retains sticky navigation and scrollable targets.
 context=browser.new_context()
 page=context.new_page()
 page.set_viewport_size({'width':390,'height':844})
 for folder in FOLDERS[:2]:
  page.goto(BASE+folder+'/');assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='smooth';page.locator('header a[href="#projects"], header a[href="#courses"]').first.click();page.wait_for_timeout(800)
  assert abs(page.locator('header').bounding_box()['y'])<1
  target='#projects' if folder==FOLDERS[1] else '#courses'
  assert page.locator(target).bounding_box()['y']>=page.locator('header').bounding_box()['height']-1
 assert not report['errors'],report['errors']
 browser.close()
for url in sorted(external):
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25) as response:report['external_urls'][url]=response.status
 except Exception as exc:report['external_urls'][url]=str(exc)
print(json.dumps(report,indent=2))
