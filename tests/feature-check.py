"""Extended real-browser regression checks. Run the local static server first.
Requires test-only Python Playwright and Chromium; no website dependencies.
"""
import argparse
import csv
import io
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/')
report = {'checks': [], 'console_errors': [], 'page_errors': [], 'failed_assets': []}

def passed(label):
    report['checks'].append(label)

def watch(context):
    def attach(page):
        page.on('pageerror', lambda e: report['page_errors'].append(str(e)))
        page.on('console', lambda msg: report['console_errors'].append(msg.text) if msg.type == 'error' else None)
        page.on('response', lambda r: report['failed_assets'].append(f'{r.status} {r.url}') if r.url.startswith(base) and r.status >= 400 else None)
    context.on('page', attach)

def text_value(page, scale):
    return float(page.locator('#result-' + scale).inner_text().replace(',', ''))

def submit(page, value, source='C', target='F'):
    set_live(page, False)
    page.locator('#temperature').fill(str(value))
    page.select_option('#unit', source)
    page.select_option('#target-unit', target)
    page.get_by_role('button', name='Convert temperature', exact=True).click()

def set_live(page, enabled):
    if page.locator('#live-mode').is_checked() != enabled:
        page.locator('label[for="live-mode"]').click()
    assert page.locator('#live-mode').is_checked() == enabled

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=args.chromium, args=['--no-sandbox'])
    # All CSS-only learning controls, including native radio keyboard behavior.
    context = browser.new_context(java_script_enabled=False, reduced_motion='reduce')
    watch(context)
    page = context.new_page()
    for width in [320, 375, 390, 768, 1024, 1440, 1920]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.goto(base + '/WebDev-L1-LandingPage/')
        for key, track in [('web', 'web'), ('design', 'design'), ('code', 'code'), ('all', None)]:
            page.locator(f'label[for="track-{key}"]').click()
            assert page.locator('.course-card:visible').count() == (3 if track is None else 1)
            if track:
                expect(page.locator(f'.course-card[data-track="{track}"]')).to_be_visible()
            assert page.locator(f'#track-{key}').is_checked()
        for card in page.locator('.course-outline').all():
            card.locator('summary').click()
            expect(card).to_have_attribute('open', '')
            assert len(card.locator('li').all()) == 3
            card.locator('summary').press('Enter')
            assert card.get_attribute('open') is None
        for pace in ['15', '30', '60', '15']:
            page.locator(f'label[for="pace-{pace}"]').click()
            assert page.locator('.study-plan-card:visible').count() == 1
            expect(page.locator(f'.plan-{pace}')).to_be_visible()
        for faq in page.locator('.faq-list details').all():
            faq.locator('summary').click()
            expect(faq.locator('p')).to_be_visible()
            faq.locator('summary').press('Enter')
            assert faq.get_attribute('open') is None
        page.locator('#track-all').focus()
        page.keyboard.press('ArrowRight')
        assert page.locator('#track-web').is_checked()
        page.locator('#pace-15').focus()
        page.keyboard.press('ArrowRight')
        assert page.locator('#pace-30').is_checked()
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        passed(f'All filters, 3 outlines, 3 planner options, 5 FAQs, keyboard radios: {width}px')
    context.close()

    context = browser.new_context(permissions=['clipboard-read', 'clipboard-write'], accept_downloads=True, reduced_motion='reduce')
    watch(context)
    page = context.new_page()
    page.goto(base + '/WebDev-L1-TemperatureConverter/')
    assert page.locator('#copy-all').is_disabled()
    assert page.locator('.copy-scale:disabled').count() == 3
    assert page.locator('#clear-history').is_disabled()
    assert page.locator('#export-history').is_disabled()
    passed('Empty-state copy/export/history controls disabled')

    # Check live/manual flows and actual climate categories, without silently recording previews.
    set_live(page, True)
    for value, category in [('-10', 'Freezing'), ('5', 'Cold'), ('25', 'Mild'), ('35', 'Warm'), ('100', 'Hot')]:
        page.locator('#temperature').fill(value)
        expect(page.locator('#climate-label')).to_have_text(category)
        assert page.locator('#history-list li').count() == 0
    page.locator('#temperature').fill('invalid')
    assert page.locator('#error').inner_text()
    assert page.locator('#climate-indicator').is_hidden()
    assert page.locator('#copy-all').is_disabled()
    assert page.locator('#temperature').evaluate('(e)=>e===document.activeElement')
    page.locator('#temperature').fill('')
    assert page.locator('#error').inner_text() == ''
    page.locator('#temperature').fill('25')
    page.select_option('#unit', 'F')
    assert math.isclose(text_value(page, 'C'), -3.888889, abs_tol=1e-6)
    assert page.locator('#history-list li').count() == 0
    page.get_by_role('button', name='Convert temperature', exact=True).click()
    assert page.locator('#history-list li').count() == 1
    set_live(page, False)
    assert page.locator('#result-C').inner_text() == '—'
    passed('Live preview, all 5 climate categories, invalid/empty recovery, scale change, no preview history')

    # Every precision and focus option; changing display precision never changes the stored calculation.
    submit(page, '1.23456789')
    for precision, expected in [('2', '1.23'), ('4', '1.2346'), ('6', '1.234568')]:
        page.select_option('#precision', precision)
        expect(page.locator('#result-C')).to_have_text(expected)
        assert page.evaluate('lastConversion.value') == 1.23456789
        assert str(1.23456789) in page.locator('#history-list li').first.inner_text() or expected in page.locator('#history-list li').first.inner_text()
    for target in ['C', 'F', 'K']:
        page.select_option('#target-unit', target)
        expect(page.locator('.focused-result output')).to_have_attribute('id', 'result-' + target)
    page.get_by_role('button', name='Reset', exact=True).click()
    expect(page.locator('#target-unit')).to_have_value('F')
    expect(page.locator('.focused-result output')).to_have_attribute('id', 'result-F')
    expect(page.locator('#precision')).to_have_value('6')
    assert not page.locator('#live-mode').is_checked()
    assert page.locator('#history-list li').count() == 2
    assert '1.234568' in page.locator('#history-list li').first.inner_text()
    passed('All precision/focus options, unrounded data, Reset highlight and history precision regression')

    # Nine source/target pairs, including no-op and blank swap; no feature removed.
    for source in ['C', 'F', 'K']:
        for target in ['C', 'F', 'K']:
            value = {'C': '25', 'F': '77', 'K': '298.15'}[source]
            submit(page, value, source, target)
            before = {s: text_value(page, s) for s in 'CFK'}
            page.locator('#swap-units').click()
            if source == target:
                assert 'different' in page.locator('#result-note').inner_text()
            else:
                expect(page.locator('#unit')).to_have_value(target)
                expect(page.locator('#target-unit')).to_have_value(source)
                for scale in 'CFK': assert math.isclose(text_value(page, scale), before[scale], abs_tol=1e-6)
            assert not page.locator('#error').inner_text()
    page.get_by_role('button', name='Reset', exact=True).click()
    page.locator('#swap-units').click()
    expect(page.locator('#unit')).to_have_value('F')
    expect(page.locator('#target-unit')).to_have_value('C')
    expect(page.locator('#temperature')).to_have_value('')
    expect(page.locator('#result-F')).to_have_text('—')
    page.locator('#temperature').fill('invalid')
    page.locator('#swap-units').click()
    assert page.locator('#error').inner_text()
    expect(page.locator('#unit')).to_have_value('F')
    passed('All 9 swap pairs, blank swap, invalid-input swap')

    submit(page, '25')
    for scale, expected in [('C', '25 °C'), ('F', '77 °F'), ('K', '298.15 K')]:
        page.locator(f'.copy-scale[data-scale="{scale}"]').click()
        expect(page.locator('#copy-status')).to_contain_text('copied')
        assert page.evaluate('navigator.clipboard.readText()') == expected
    page.locator('#copy-all').click()
    assert page.evaluate('navigator.clipboard.readText()') == 'C: 25 °C\nF: 77 °F\nK: 298.15 K'
    # Exercise both unsupported/rejected clipboard branches and keyboard-focus recovery.
    page.evaluate('Object.defineProperty(navigator,"clipboard",{value:undefined,configurable:true})')
    page.locator('#copy-all').click()
    expect(page.locator('#copy-status')).to_contain_text('copied')
    assert page.locator('#copy-all').evaluate('(e)=>e===document.activeElement')
    page.evaluate('document.execCommand=()=>false; Object.defineProperty(navigator,"clipboard",{value:{writeText:()=>Promise.reject(new Error("denied"))},configurable:true})')
    page.locator('#copy-all').click()
    expect(page.locator('#copy-status')).to_contain_text('Copy unavailable')
    assert page.locator('#copy-all').evaluate('(e)=>e===document.activeElement')
    passed('Actual clipboard text: all 3 scales, copy-all, fallback, denied clipboard, retained focus')

    # CSV data is parsed, not merely downloaded; confirm exact headers, raw values and timestamps.
    page.locator('#clear-history').click()
    for value in ['1.23456789', '25', '100']:
        submit(page, value)
    page.select_option('#precision', '2')
    with page.expect_download() as pending:
        page.locator('#export-history').click()
    download = pending.value
    assert download.suggested_filename == 'tempconvert-history.csv'
    rows = list(csv.DictReader(io.StringIO(Path(download.path()).read_text())))
    assert list(rows[0]) == ['Input', 'Source', 'Celsius', 'Fahrenheit', 'Kelvin', 'Timestamp']
    assert len(rows) == 3
    assert [float(row['Input']) for row in rows] == [100, 25, 1.23456789]
    assert float(rows[-1]['Celsius']) == 1.23456789
    assert rows[-1]['Timestamp'].endswith('Z')
    passed('Downloaded CSV: filename, six headers, row order/count, full precision, timestamp')

    # History cap, duplicates, persistence, every restore button, and clear persistence.
    page.locator('#clear-history').click()
    for value in range(14): submit(page, value)
    assert page.locator('#history-list li').count() == 12
    submit(page, 13)
    assert page.locator('#history-list li').count() == 12
    page.reload()
    assert page.locator('#history-list li').count() == 12
    # Replay oldest first: each saved entry remains available within the bounded history.
    saved = page.evaluate('historyEntries.map(e=>e.value)')
    for value in reversed(saved):
        page.get_by_role('button', name=f'Use {value} °C again', exact=True).click()
        expect(page.locator('#temperature')).to_have_value(str(value))
        assert text_value(page, 'C') == value
    page.locator('#clear-history').click()
    page.reload()
    assert page.locator('#history-list li').count() == 0
    expect(page.locator('#history-count')).to_have_text('(0)')
    expect(page.locator('#history-empty')).to_be_visible()
    assert page.locator('#export-history').is_disabled()
    passed('History: cap 12, immediate deduplication, reload, every restore, clear persistence')

    for width in [320, 375, 390, 768, 1024, 1440, 1920]:
        page.set_viewport_size({'width':width, 'height':900})
        submit(page, '1e100')
        for light in [True, False]:
            page.locator('#theme-toggle').click()
            assert page.locator('#theme-toggle').get_attribute('aria-pressed') == str(light).lower()
            page.reload()
            assert page.locator('body').evaluate('(e)=>e.classList.contains("light-theme")') == light
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
            for button in page.locator('header a,header button').all():
                box = button.bounding_box()
                assert box['x']>=0 and box['x']+box['width']<=width+.1
        passed(f'Both themes: toggle ARIA, persistence, header controls and overflow {width}px')
    context.close()

    # Corrupt/malicious storage cannot inject markup, crash conversion, or bypass validation.
    context = browser.new_context(reduced_motion='reduce')
    watch(context)
    page = context.new_page()
    for stored in ['not-json', '{}', '[null,{"value":-1,"source":"K"},{"value":"<script>","source":"C"}]', '[{"value":25,"source":"C","at":"bad-date"}]']:
        page.goto(base + '/WebDev-L1-TemperatureConverter/')
        page.evaluate('(s)=>localStorage.setItem("tempconvert_history_v2",s)', stored)
        page.reload()
        assert page.locator('#history-list li').count() == (1 if 'bad-date' in stored else 0)
        submit(page, 25)
        assert text_value(page, 'F') == 77
    context.close()
    context = browser.new_context()
    watch(context)
    context.add_init_script('Storage.prototype.getItem=()=>{throw new Error("blocked")}; Storage.prototype.setItem=()=>{throw new Error("blocked")};')
    page = context.new_page()
    page.goto(base + '/WebDev-L1-TemperatureConverter/')
    submit(page, 25)
    assert text_value(page,'F')==77
    assert page.locator('#history-list li').count()==1
    page.locator('#theme-toggle').click()
    assert page.locator('body').evaluate('(e)=>e.classList.contains("light-theme")')
    passed('Malformed/invalid stored history, invalid date repair, storage-blocked session fallback')
    assert not report['console_errors'], report['console_errors']
    assert not report['page_errors'], report['page_errors']
    assert not report['failed_assets'], report['failed_assets']
    browser.close()
print(json.dumps(report, indent=2))
