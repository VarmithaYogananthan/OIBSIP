#!/usr/bin/env python3
"""Chromium end-to-end checks for EduSpark's separate browser-local learner/admin prototypes.
Run a static web server at the repository root, then: python tests/eduspark-apps.py
Requires: Python Playwright and a Chromium executable (test-only dependencies).
"""
import argparse
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument("--base-url", default="http://127.0.0.1:8000")
parser.add_argument("--chromium", default="/usr/bin/chromium")
args = parser.parse_args()
base = args.base_url.rstrip("/")
user_url = base + "/WebDev-L1-LandingPage/apps/user/"
admin_url = base + "/WebDev-L1-LandingPage/apps/admin/"
checks = []

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=args.chromium, args=["--no-sandbox"])
    context = browser.new_context(accept_downloads=True, viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    user = context.new_page()
    errors = []
    user.on("pageerror", lambda err: errors.append(str(err)))
    user.goto(user_url)
    user.evaluate("localStorage.clear()")
    user.reload()
    assert user.locator("#setup-panel").is_visible()
    assert user.locator("#catalog-courses .course-card").count() >= 5
    checks.append("Guest course browsing and demo profile gateway")

    user.locator("#new-name").fill("Alex Demo")
    user.locator("#new-email").fill("alex@example.com")
    user.locator("#demo-join-form button[type=submit]").click()
    assert user.locator("#setup-panel").is_hidden()
    assert "Alex" in user.locator("#welcome-name").inner_text()
    checks.append("Learner profile creation and dashboard welcome")

    user.locator('[data-go="catalog"]').first.click()
    user.locator("#catalog-search").fill("python")
    assert user.locator("#catalog-courses .course-card").count() >= 1
    user.locator("#catalog-search").fill("")
    user.locator("#catalog-category").select_option("Design")
    assert user.locator("#catalog-courses .course-card").count() >= 2
    user.locator("#catalog-category").select_option("all")
    checks.append("Catalog text search and category filtering")

    user.locator('[data-enroll="web"]').first.click()
    assert user.locator("#stat-enrolled").inner_text() == "1"
    assert user.locator('[data-open="web"]').first.count() >= 1
    user.locator('[data-open="web"]').first.click()
    assert user.locator("#lesson-detail").is_visible()
    user.locator('#lesson-list input[data-lesson="0"]').check()
    assert user.locator("#stat-lessons").inner_text() == "1"
    assert "25%" in user.locator("#lesson-progress").inner_text()
    user.reload()
    assert user.locator("#stat-enrolled").inner_text() == "1"
    checks.append("Enrollment, lesson checklist, progress persistence")

    admin = context.new_page()
    admin.on("pageerror", lambda err: errors.append(str(err)))
    admin.goto(admin_url)
    assert "Public Admin Prototype" in admin.locator(".sidebar").inner_text()
    assert admin.locator("#admin-learners").inner_text() == "1"
    assert admin.locator("#admin-enrollments").inner_text() == "1"
    admin.locator('[data-view="learners"]').click()
    assert "Alex Demo" in admin.locator("#learner-table").inner_text()
    assert "25%" in admin.locator("#learner-table").inner_text()
    checks.append("Separate Admin dashboard reads local learner activity")

    admin.locator('[data-view="courses"]').click()
    admin.locator("#course-name").fill("Creative Coding Lab")
    admin.locator("#course-category").select_option("Programming")
    admin.locator("#course-level").select_option("Beginner")
    admin.locator("#course-duration").fill("2 weeks")
    admin.locator("#course-description").fill("Create a small playful interactive web project.")
    admin.locator("#course-lessons").fill("Explore ideas\nPrototype an interaction\nTest and improve")
    admin.locator("#course-form button[type=submit]").click()
    assert "Creative Coding Lab" in admin.locator("#course-table").inner_text()
    user.goto(user_url)
    user.locator('[data-view="catalog"]').click()
    assert "Creative Coding Lab" in user.locator("#catalog-courses").inner_text()
    checks.append("Course creation shared with separate learner web app")

    row = admin.locator("#course-table tr").filter(has_text="Creative Coding Lab")
    row.get_by_role("button", name="Hide").click()
    user.reload()
    user.locator('[data-view="catalog"]').click()
    assert "Creative Coding Lab" not in user.locator("#catalog-courses").inner_text()
    row = admin.locator("#course-table tr").filter(has_text="Creative Coding Lab")
    row.get_by_role("button", name="Show").click()
    row.get_by_role("button", name="Edit").click()
    admin.locator("#course-name").fill("Creative Coding Studio")
    admin.locator("#course-form button[type=submit]").click()
    assert "Creative Coding Studio" in admin.locator("#course-table").inner_text()
    checks.append("Course visibility and edits")

    admin.locator('[data-view="announcements"]').click()
    admin.locator("#announcement-title").fill("New demo learning update")
    admin.locator("#announcement-message").fill("Welcome to the new creative coding lesson plan.")
    admin.locator("#announcement-form button[type=submit]").click()
    user.goto(user_url)
    user.locator('[data-view="announcements"]').click()
    assert "New demo learning update" in user.locator("#all-announcements").inner_text()
    checks.append("Admin announcements visible on Learner demo")

    admin.locator('[data-view="reports"]').click()
    assert admin.locator("#report-active").inner_text() != "0"
    with admin.expect_download() as info:
        admin.locator("#download-report").click()
    assert info.value.suggested_filename == "eduspark-course-report.csv"
    checks.append("Course report metrics and CSV export")

    admin.locator('[data-view="courses"]').click()
    admin.once("dialog", lambda d: d.accept())
    admin.locator("#course-table tr").filter(has_text="Creative Coding Studio").get_by_role("button", name="Delete").click()
    assert "Creative Coding Studio" not in admin.locator("#course-table").inner_text()
    checks.append("Course deletion with confirmation")

    for width in (320, 375, 390, 768, 1024, 1440, 1920):
        for page in (user, admin):
            page.set_viewport_size({"width": width, "height": 880})
            assert not page.evaluate("document.documentElement.scrollWidth > innerWidth"), (
                "Horizontal page overflow", width, page.url
            )
            page.locator('[data-view="dashboard"]').click()
            assert page.locator("#view-dashboard").is_visible()
    checks.append("Both demo apps responsive across seven widths")

    admin.locator('[data-view="settings"]').click()
    admin.once("dialog", lambda d: d.accept())
    admin.locator("#reset-demo").click()
    assert admin.locator("#admin-learners").inner_text() == "0"
    user.goto(user_url)
    assert user.locator("#setup-panel").is_visible()
    checks.append("Full demo reset clears local profiles and activity")

    assert not errors, errors
    browser.close()

print("EduSpark learner/admin browser checks passed:", len(checks))
for text in checks:
    print("  ✓", text)
