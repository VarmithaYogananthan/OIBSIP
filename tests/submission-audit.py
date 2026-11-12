#!/usr/bin/env python3
"""Final Pages/subpath and optional-demo regressions. Uses only isolated demo data.
Run a static server first; point --base-url at the repository's /OIBSIP prefix.
"""
import argparse
import csv
import hashlib
import io
import json
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', default='http://127.0.0.1:8000/OIBSIP')
parser.add_argument('--chromium', default='/usr/bin/chromium')
parser.add_argument('--capture-dir', type=Path, help='Optional extra review screenshots, outside the source tree')
args = parser.parse_args()
base = args.base_url.rstrip('/') + '/'
root = Path(__file__).resolve().parents[1]
widths = [320, 375, 390, 768, 1024, 1440, 1920]
pages = [
    '', 'WebDev-L1-LandingPage/', 'WebDev-L1-Portfolio/', 'WebDev-L1-TemperatureConverter/',
    *['WebDev-L1-LandingPage/courses/' + name + '.html' for name in ['web-development', 'ui-ux-design', 'python-programming']],
    *['WebDev-L1-LandingPage/apps/' + role + '/' + name for role in ['user', 'admin'] for name in ['welcome.html', 'index.html']],
]
report = {'pages': 0, 'viewport_checks': 0, 'local_targets': 0, 'course_entry_clicks': 0,
          'groups': [], 'console_errors': [], 'page_errors': [], 'failed_assets': [], 'native_viewer_messages': []}


def checked(label):
    report['groups'].append(label)
    print('PASS: '+label, file=sys.stderr, flush=True)


def watch(context):
    def attach(page):
        def console_message(msg):
            if msg.type != 'error':
                return
            resource = msg.location.get('url', '')
            # Chromium's PDF viewer, not repository HTML, requests the origin favicon.
            # Keep this diagnostic visible; never exclude failed assets inside /OIBSIP/.
            origin_icon = urljoin(base, '/favicon.ico')
            if page.url.split('?')[0].endswith('.pdf') and resource == origin_icon and not resource.startswith(base):
                report['native_viewer_messages'].append({'url': resource, 'message': msg.text})
            else:
                report['console_errors'].append({'url': resource, 'message': msg.text})
        page.on('console', console_message)
        page.on('pageerror', lambda err: report['page_errors'].append(str(err)))
        page.on('response', lambda response: report['failed_assets'].append(f'{response.status} {response.url}')
                if response.url.startswith(base) and response.status >= 400 else None)
        page.on('requestfailed', lambda request: report['failed_assets'].append(f'{request.failure} {request.url}')
                if request.url.startswith(base) else None)
    context.on('page', attach)


def fit(page):
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), page.url


def nav(page, view):
    page.locator(f'.side-nav button[data-view="{view}"]').click()
    expect(page.locator('#view-' + view)).to_be_visible()


def choose_dialog(page, accepted, action):
    page.once('dialog', lambda dialog: dialog.accept() if accepted else dialog.dismiss())
    action()


with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=args.chromium, args=['--no-sandbox'])
    context = browser.new_context(reduced_motion='reduce', timezone_id='Asia/Colombo', accept_downloads=True)
    watch(context)
    page = context.new_page()
    verified = set()
    for route in pages:
        url = urljoin(base, route)
        response = page.goto(url)
        assert response.ok, (url, response.status)
        page.wait_for_load_state('networkidle')
        assert page.locator('link[rel="icon"]').count() == 1, url
        assert page.evaluate('Array.from(document.images).every(i=>i.complete && i.naturalWidth>0)'), url
        for css in page.locator('link[rel="stylesheet"]').all():
            assert css.evaluate('(link)=>Boolean(link.sheet)'), url
        if route in ['', 'WebDev-L1-LandingPage/', 'WebDev-L1-Portfolio/'] or '/courses/' in route or route.endswith('welcome.html'):
            assert page.locator('script').count() == 0, url
        if route == 'WebDev-L1-Portfolio/':
            assert page.locator('.project-card').count() == 2
            assert page.locator('.other-project').count() == 9
            assert 'Varmitha Yogananthan' in page.locator('main').inner_text()
        # Crawl actual local references and keep every asset/navigation target inside the repo prefix.
        refs = page.locator('a[href],link[href],script[src],img[src]').evaluate_all(
            '(nodes)=>nodes.map(e=>e.getAttribute("href")||e.getAttribute("src"))')
        for ref in refs:
            if ref.startswith(('data:', 'https:', 'mailto:', '#')):
                continue
            target = urljoin(page.url, ref).split('#')[0]
            assert target.startswith(base), (url, ref, target)
            if target not in verified:
                target_response = page.request.get(target)
                assert target_response.ok, (target, target_response.status)
                verified.add(target)
        for width in widths:
            page.set_viewport_size({'width': width, 'height': 900})
            fit(page)
            if route == 'WebDev-L1-Portfolio/':
                for card in page.locator('.project-card,.other-project').all():
                    expect(card).to_be_visible()
            report['viewport_checks'] += 1
        report['pages'] += 1
        if args.capture_dir:
            args.capture_dir.mkdir(parents=True, exist_ok=True)
            page.set_viewport_size({'width': 1440, 'height': 1000})
            page.evaluate('window.scrollTo(0,0)')
            page.screenshot(path=str(args.capture_dir / ((route.strip('/').replace('/', '-') or 'hub') + '.png')), full_page=True)
    report['local_targets'] = len(verified)
    checked('All 11 HTML routes and local references resolve under the repository subpath; 77 viewport checks')
    page.set_viewport_size({'width': 1440, 'height': 1000})
    for folder in ['WebDev-L1-LandingPage/', 'WebDev-L1-Portfolio/', 'WebDev-L1-TemperatureConverter/']:
        page.goto(base)
        page.locator(f'a[href="{folder}"]').click()
        assert page.url == urljoin(base, folder)
    checked('Root hub performs actual navigation to all three canonical task URLs')

    for track, filename in [('web', 'web-development'), ('design', 'ui-ux-design'), ('code', 'python-programming')]:
        for selector in ['.course-cover-link', 'h3 a', '.course-link']:
            page.goto(urljoin(base, 'WebDev-L1-LandingPage/'))
            page.locator(f'.course-card[data-track="{track}"] {selector}').click()
            assert page.url == urljoin(base, 'WebDev-L1-LandingPage/courses/' + filename + '.html')
            page.get_by_role('link', name='Explore syllabus').click()
            assert page.url.endswith('#syllabus')
            report['course_entry_clicks'] += 1
    checked('All 9 course image/heading/Explore actions open their matching static course page and syllabus')

    # Click every static role/course navigation link (the broad suite covers all three core pages).
    for route in pages[4:]:
        if route.endswith('/index.html'):
            continue
        page.goto(urljoin(base, route))
        destinations = page.locator('a[href]').evaluate_all('(nodes)=>nodes.map(e=>e.getAttribute("href"))')
        for index, ref in enumerate(destinations):
            if ref.startswith(('https:', 'mailto:')):
                continue
            page.goto(urljoin(base, route))
            page.locator('a[href]').nth(index).click()
            expected = urljoin(urljoin(base, route), ref)
            page.wait_for_load_state('networkidle')
            # Dashboard startup supplies its default hash; explicit course/section hashes must match.
            assert urlparse(page.url)._replace(fragment='') == urlparse(expected)._replace(fragment=''), (page.url, expected)
            if urlparse(expected).fragment:
                assert urlparse(page.url).fragment == urlparse(expected).fragment, (page.url, expected)
    checked('Every static course and role-welcome navigation/CTA link clicked')

    page.goto(urljoin(base, 'WebDev-L1-Portfolio/'))
    pdf_bytes = (root / 'WebDev-L1-Portfolio/assets/Varmitha_Resume_Public.pdf').read_bytes()
    response = page.request.get(urljoin(page.url, 'assets/Varmitha_Resume_Public.pdf'))
    assert response.headers['content-type'].startswith('application/pdf')
    assert response.body() == pdf_bytes and pdf_bytes.startswith(b'%PDF-')
    for link in page.locator('a[download]').all():
        with page.expect_download() as download:
            link.click()
        assert Path(download.value.path()).read_bytes() == pdf_bytes
    with context.expect_page() as opened:
        page.get_by_role('link', name='Preview resume', exact=False).click()
    preview = opened.value
    # Chromium's built-in PDF viewer need not emit a normal HTML load event.
    expect(preview).to_have_url(urljoin(page.url, 'assets/Varmitha_Resume_Public.pdf'))
    preview.close()
    checked('Resume MIME, byte-identical downloads, actual preview-tab URL and PDF signature')
    report['resume_sha256'] = hashlib.sha256(pdf_bytes).hexdigest()

    learner = context.new_page()
    admin = context.new_page()
    learner_url = urljoin(base, 'WebDev-L1-LandingPage/apps/user/index.html')
    admin_url = urljoin(base, 'WebDev-L1-LandingPage/apps/admin/index.html')
    learner.goto(learner_url)
    admin.goto(admin_url)
    for page, views in [(learner, ['dashboard','catalog','learning','announcements','profile']),
                        (admin, ['dashboard','courses','learners','announcements','reports','settings'])]:
        for width in widths:
            page.set_viewport_size({'width': width, 'height': 900})
            for view in views:
                nav(page, view)
                fit(page)
                # Exercise this view's actions, without revisiting it for controls in hidden views.
                actions = page.locator('#view-' + view + ' [data-go]')
                for index in range(actions.count()):
                    if not page.locator('#view-' + view).is_visible():
                        nav(page, view)
                    action = actions.nth(index)
                    if action.is_visible():
                        destination = action.get_attribute('data-go')
                        action.click()
                        expect(page.locator('#view-' + destination)).to_be_visible()
            page.locator('.skip').focus()
            page.keyboard.press('Enter')
            assert page.evaluate('location.hash') == '#main-content'
        page.set_viewport_size({'width': 1440, 'height': 1000})
        nav(page, 'dashboard')
    checked('All learner/admin navigation and dashboard CTA buttons; each view fits 7 widths; keyboard skip links')

    learner.goto(learner_url)
    for course in ['web','design','python','data','brand','js']:
        for selector in ['.course-cover', 'h3 a', '.course-details-link']:
            nav(learner,'catalog')
            card=learner.locator('#catalog-courses .course-card').filter(
                has=learner.locator('[data-detail="'+course+'"]'))
            card.locator(selector).click()
            expect(learner.locator('#view-course')).to_be_visible()
            assert learner.url.endswith('#course/'+course)
            assert learner.locator('#course-detail-modules li').count()==4
            if selector == '.course-details-link':
                learner.locator('#course-detail-actions [data-go="catalog"]').click()
            else:
                learner.locator('#course-back').click()
            expect(learner.locator('#view-catalog')).to_be_visible()
    checked('All 18 image/title/details entries for the 6 learner catalog courses and course-back buttons')
    learner.goto(learner_url)
    learner.locator('#demo-join-form button[type=submit]').click()
    assert learner.locator('#new-name').evaluate('(e)=>!e.validity.valid')
    learner.locator('#new-name').fill('  ')
    learner.locator('#new-email').fill('audit@example.com')
    learner.locator('#demo-join-form button[type=submit]').click()
    expect(learner.locator('#setup-status')).to_contain_text('valid')
    learner.locator('#new-name').fill('Audit Learner')
    learner.locator('#new-email').fill('not-an-email')
    learner.locator('#demo-join-form button[type=submit]').click()
    assert learner.locator('#new-email').evaluate('(e)=>!e.validity.valid')
    nav(learner,'catalog')
    learner.locator('#catalog-courses [data-enroll="web"]').click()
    learner.locator('#new-name').fill('Audit Learner')
    learner.locator('#new-email').fill('audit@example.com')
    learner.locator('#demo-join-form button[type=submit]').click()
    expect(learner.locator('#view-course')).to_be_visible()
    learner.locator('#course-detail-actions [data-enroll="web"]').click()
    learner.locator('#my-courses [data-open="web"]').click()
    learner.locator('#lesson-list input').first.check()
    nav(learner,'profile')
    learner.locator('#profile-name').fill('  ')
    learner.locator('#profile-form button[type=submit]').click()
    expect(learner.locator('#profile-status')).to_contain_text('two')
    learner.locator('#profile-name').fill('Audit Name Updated')
    learner.locator('#profile-form button[type=submit]').click()
    expect(learner.locator('#top-name')).to_have_text('Audit Name Updated')
    learner.locator('#signout').click()
    expect(learner.locator('#setup-panel')).to_be_visible()
    learner.locator('#new-name').fill('Audit Learner')
    learner.locator('#new-email').fill('audit@example.com')
    learner.locator('#demo-join-form button[type=submit]').click()
    expect(learner.locator('#stat-lessons')).to_have_text('1')
    checked('Profile/native validation, pending enrollment flow, profile update, switch and same-email progress restore')

    nav(learner,'learning')
    learner.locator('#my-courses [data-open="web"]').click()
    first_lesson=learner.locator('#lesson-list input[data-lesson="0"]')
    first_lesson.focus()
    learner.keyboard.press('Space')
    expect(first_lesson).not_to_be_checked()
    expect(first_lesson).to_be_focused()
    learner.keyboard.press('Space')
    expect(first_lesson).to_be_checked()
    expect(first_lesson).to_be_focused()
    learner.keyboard.press('Tab')
    expect(learner.locator('#lesson-list input[data-lesson="1"]')).to_be_focused()
    learner.keyboard.press('Space')
    expect(learner.locator('#lesson-list input[data-lesson="1"]')).to_be_checked()
    expect(learner.locator('#lesson-list input[data-lesson="1"]')).to_be_focused()
    for index in range(4):
        learner.locator(f'#lesson-list input[data-lesson="{index}"]').check()
    expect(learner.locator('#lesson-progress')).to_contain_text('100%')
    learner.locator('#lesson-list input').first.uncheck()
    expect(learner.locator('#lesson-progress')).to_contain_text('75%')
    learner.locator('#lesson-back').click()
    expect(learner.locator('#lesson-detail')).to_be_hidden()
    nav(learner,'catalog')
    learner.locator('#catalog-search').fill('No-such-course-8472')
    expect(learner.locator('#catalog-empty')).to_be_visible()
    learner.locator('#catalog-search').fill('')
    for category in ['Web Development','Design','Programming','Data','all']:
        learner.locator('#catalog-category').select_option(category)
        assert learner.locator('#catalog-courses .course-card').count() >= 1
    checked('Keyboard Space/Tab focus retained, all checklists, 100%/75% completion, lesson back, search empty state and all categories')

    nav(admin,'courses')
    admin.locator('#save-course').click()
    assert admin.locator('#course-name').evaluate('(e)=>!e.validity.valid')
    name = 'Audit, Studio "One"'
    admin.locator('#course-name').fill(name)
    admin.locator('#course-duration').fill('2 weeks')
    admin.locator('#course-description').fill('A practical audit course with clear learning steps.')
    admin.locator('#course-lessons').fill('   ')
    admin.locator('#save-course').click()
    expect(admin.locator('#course-status')).to_contain_text('lessons')
    admin.locator('#course-lessons').fill('Plan a project\nBuild and verify')
    admin.locator('#save-course').click()
    row = admin.locator('#course-table tr').filter(has=admin.locator('strong', has_text=name))
    expect(row).to_be_visible()
    learner.locator('#catalog-category').select_option('all')
    expect(learner.locator('#catalog-courses')).to_contain_text(name)  # Same-origin storage event, without reload.
    row.get_by_role('button',name='Edit',exact=True).click()
    expect(admin.locator('#course-name')).to_have_value(name)
    admin.locator('#cancel-edit').click()
    expect(admin.locator('#course-id')).to_have_value('')
    expect(admin.locator('#course-name')).to_have_value('')
    row.get_by_role('button',name='Edit',exact=True).click()
    admin.locator('#course-name').fill(name + ' Updated')
    admin.locator('#save-course').click()
    name += ' Updated'
    expect(learner.locator('#catalog-courses')).to_contain_text(name)
    row = admin.locator('#course-table tr').filter(has=admin.locator('strong',has_text=name))
    row.get_by_role('button',name='Hide',exact=True).click()
    expect(learner.locator('#catalog-courses')).not_to_contain_text(name)
    row.get_by_role('button',name='Show',exact=True).click()
    expect(learner.locator('#catalog-courses')).to_contain_text(name)
    choose_dialog(admin, False, lambda: row.get_by_role('button',name='Delete',exact=True).click())
    expect(row).to_be_visible()
    checked('Course validation/create/edit/cancel/hide/show/delete-cancel with live same-origin learner updates')

    nav(admin,'announcements')
    admin.locator('#announcement-form button[type=submit]').click()
    assert admin.locator('#announcement-title').evaluate('(e)=>!e.validity.valid')
    admin.locator('#announcement-title').fill('Audit announcement')
    admin.locator('#announcement-message').fill('A useful local notice for the audit learner.')
    admin.locator('#announcement-form button[type=submit]').click()
    nav(learner,'announcements')
    expect(learner.locator('#all-announcements')).to_contain_text('Audit announcement')
    notice = admin.locator('#announcement-list article').filter(has_text='Audit announcement')
    choose_dialog(admin, False, lambda: notice.get_by_role('button',name='Remove').click())
    expect(notice).to_be_visible()
    choose_dialog(admin, True, lambda: notice.get_by_role('button',name='Remove').click())
    expect(learner.locator('#all-announcements')).not_to_contain_text('Audit announcement')
    checked('Announcement validation/publish/cancel/remove and cross-tab updates')

    nav(admin,'reports')
    expect(admin.locator('#report-lessons')).to_have_text('3')
    expect(admin.locator('#report-average')).to_have_text('75%')
    with admin.expect_download() as download:
        admin.locator('#download-report').click()
    assert download.value.suggested_filename == 'eduspark-course-report.csv'
    rows = list(csv.DictReader(io.StringIO(Path(download.value.path()).read_text())))
    assert len(rows) == 7
    record = next(row for row in rows if row['Course name'] == name)
    assert record['Category'] == 'Web Development'
    enrolled = next(row for row in rows if row['Course ID'] == 'web')
    assert enrolled['Enrollments'] == '1' and enrolled['Average progress percent'] == '75'
    checked('Admin CSV parsed: exact quoted course name, 7 rows, enrollment count and 75% progress')

    nav(admin,'learners')
    person = admin.locator('#learner-table tr').filter(has_text='audit@example.com')
    choose_dialog(admin, False, lambda: person.get_by_role('button',name='Remove').click())
    expect(person).to_be_visible()
    choose_dialog(admin, True, lambda: person.get_by_role('button',name='Remove').click())
    expect(learner.locator('#setup-panel')).to_be_visible()
    expect(learner.locator('#stat-enrolled')).to_have_text('0')
    nav(admin,'courses')
    row = admin.locator('#course-table tr').filter(has_text=name)
    choose_dialog(admin, True, lambda: row.get_by_role('button',name='Delete',exact=True).click())
    learner.goto(learner_url+'#catalog')
    expect(learner.locator('#catalog-courses')).not_to_contain_text(name)
    learner.goto(learner_url+'#course/missing-course')
    expect(learner.locator('#view-catalog')).to_be_visible()
    learner.goto(learner_url+'#course/%E0%A4%A')
    expect(learner.locator('#view-catalog')).to_be_visible()
    checked('Learner delete cancel/confirm, course deletion, stale and malformed deep-link recovery')

    nav(admin,'settings')
    admin.evaluate('localStorage.setItem("submission-unrelated", "preserve")')
    choose_dialog(admin, False, lambda: admin.locator('#reset-demo').click())
    expect(admin.locator('#view-settings')).to_be_visible()
    choose_dialog(admin, True, lambda: admin.locator('#reset-demo').click())
    expect(admin.locator('#admin-total-courses')).to_have_text('6')
    assert admin.evaluate('localStorage.getItem("submission-unrelated")') == 'preserve'
    checked('Full reset cancellation/confirmation, restores seed courses and preserves unrelated storage')

    assert not report['failed_assets'], report['failed_assets']
    assert not report['page_errors'], report['page_errors']
    assert not report['console_errors'], report['console_errors']
    browser.close()
print(json.dumps(report, indent=2))
