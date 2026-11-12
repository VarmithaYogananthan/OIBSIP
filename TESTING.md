# OIBSIP — final audit and submission readiness

**Audit date: 12 November 2026.** This supersedes the earlier pre-resume/pre-dashboard notices. The clean checkout was synchronized with `origin/main` at `9a8f39a`. PR #1 was confirmed **merged**; this follow-up uses `fix/level1-final-verification` and a new review PR, without merging automatically.

## Official requirement check

The [official Oasis Infobyte SIP task list](https://docs.google.com/document/d/1p4uB1o7RU3YqfUDFXRbL-YSMS-x6vM90LMo_IV7jgq0/edit) was read through the Task List link in the 6 November 2026 orientation email. Its Web Development & Designing Level 1 cards require **all three tasks**:

| Task | Result | Evidence |
| --- | --- | --- |
| 1 — Landing Page | **PASS** | HTML/CSS-only main page, sticky navigation with 5 section links, hero/CTAs, multiple sections/footer, consistent blue/violet/white theme, responsive Flex/Grid, working filters/planner/FAQ/course routes |
| 2 — Portfolio | **PASS** | Correct name/original portrait, About/Skills/Projects/Education/Experience/Contact, maroon/rose/gold identity, 11 visible project entries, working GitHub/email destinations, responsive and smooth navigation |
| 3 — Converter | **PASS** | Validated numeric input, all 3 scales, Convert/Reset/Enter, correct labelled values, negative/decimal handling and rejection below absolute zero; premium controls also tested |

The public resume, separate course pages and Learner/Admin apps are **additional features**, not mandatory Task Card requirements. The apps are explicitly browser-local, public prototypes without secure authentication or a backend.

## Executed tests

Tests used system Chromium through Python Playwright and a static server mounting the repository beneath **`/OIBSIP/`**, matching GitHub Pages project hosting. Tasks 1 and 2 were exercised with JavaScript disabled in the core suites. No application dependency/build system was added.

| Executed suite | Actual result |
| --- | --- |
| `node --test tests/converter.test.cjs` | **5 passed, 0 failed**, including 45 round trips |
| `tests/browser-check.py` | **Passed**: 21 layout checks, 266 anchor clicks, 154 local link/file-action checks, 12 valid conversions, 12 invalid conversions, 35 examples, 37 feature checks, 6 actual captures |
| `tests/feature-check.py` | **22 scenario groups passed**, including every filter/planner/FAQ option, clipboard contents/fallbacks, CSV contents, all swaps/precision settings, history and both themes |
| `tests/eduspark-apps.py` | **17 scenario groups passed**, covering the root hub, course pages, separate role landings, learner/admin workflows and seven widths |
| `tests/submission-audit.py` | **14 scenario groups passed**: 11 HTML routes, 77 viewport checks, 26 distinct local targets, 9 static course entries, 18 learner course entries, resume downloads and extended cross-app regressions; no application console errors, page errors or failed assets |
| Final external destinations | All **9 distinct HTTPS destinations in the HTML pages returned HTTP 200**, including stable `main` source URLs |
| Syntax / whitespace checks | JavaScript syntax checks and `git diff --check` passed; resume PDF is classified binary to preserve its xref bytes |

All required widths were exercised: **320, 375, 390, 768, 1024, 1440 and 1920 CSS pixels**. There was no document-level horizontal overflow. Wide admin tables intentionally scroll inside their own containers. Header targets, native keyboard controls, sticky offsets, reduced-motion behavior and cards were checked. Screenshots are browser output, not generated mockups.

## Routes, links and controls

### Main landing page, course pages and role entries

- All Home/Courses/Features/About/Contact, Get Started, Explore Courses, Why EduSpark?, planner/FAQ and Back to Top actions have valid destinations.
- All four category filters, three syllabus disclosures, 15/30/60-minute plans and five FAQs open/change/close as expected, including radio keyboard controls and Enter on disclosures.
- Every course **image, heading and Explore** action opens its matching static Web Development, UI/UX or Python course page (9 distinct entry checks). Curriculum and syllabus anchors work.
- Learner and Admin role buttons open their own `welcome.html`, whose dashboard CTAs enter the matching app. Course pages link to the matching app course, not a generic unrelated screen.
- The root hub actually navigates to all three canonical task folders. Relative HTML/CSS/JS/portrait/PDF references resolve inside `/OIBSIP/`; no root-relative path bypass is needed.

### Learner and Admin prototypes

- Guest browsing and all 6 seeded course details are available. Catalog search, no-results state, each category, enrollment, lesson check/uncheck, progress and persistence work.
- Display-name/email validation, pending enrollment, name update, switching profiles and returning to the same demo email preserve the expected local progress.
- All sidebar views and visible in-view CTA buttons are exercised on phones and desktops. Space toggles a lesson and **retains focus**; Tab reaches the next checkbox instead of restarting navigation. Lesson-back and course-back actions work.
- Admin create/edit/clear/hide/show/delete changes are reflected in the **already-open** learner tab via same-origin storage events, not only after a reload. Admin-created courses have their own dynamic details.
- Announcement publish/remove and learner removal update the learner tab. Destructive actions are checked with both Cancel and Confirm.
- Reports correctly show enrollment, completed lesson totals and percentage progress. Downloaded CSV content is parsed, including quoted/comma-containing course names, row count, enrollments and progress.
- Reset cancellation keeps data; confirmed reset restores sample courses/profiles and does not clear unrelated local storage.
- Missing/deleted and malformed course deep links return to the catalog without a JavaScript exception.

These behaviors do not establish real authentication, production authorization, assessed lessons, certification or cross-device synchronization. Only synthetic names and `example.com` emails were used in isolated browser contexts.

### Portfolio and public PDF

- Both featured projects and all **9 additional project cards** remain present (11 total). Verified GitHub source links resolve; cards without a verified public destination remain informational instead of fake links.
- The original portrait is unchanged: SHA-256 `d66059167c377d327f55ce07a4848c9caf9ab19fffdc3765f56b809c4a366d4b`. It has no EXIF/GPS fields.
- Resume HTTP response is `application/pdf`; downloads from the hero and resume section match the actual file bytes, and the Preview action opens the real PDF URL. The final PDF was rendered and visually reviewed as **one page**, with no clipping, encryption, forms or embedded JavaScript.
- No residential street address, marital status, birth date or private CV attachment is present. Only general location and the supplied public contact details are displayed. Repository PDF history contains the public edition only.
- The **Spendly line alone** was corrected from a PHP/MySQL claim to the linked repository's HTML/CSS/JavaScript/local-storage implementation. Text comparison confirmed all other resume content, including education and training, was preserved. The one-page layout is unchanged.
- Final resume SHA-256: `42be7e45b6c47403d119b25c00fffdda92202427872ced7ea59bf2b0857b551d`.
- Mailto destinations were inspected; no email was sent. Final personal/education-status review remains the user's responsibility.

### Temperature converter

Reference conversions passed:

| Input | Celsius | Fahrenheit | Kelvin |
| --- | ---: | ---: | ---: |
| 0 °C | 0 | 32 | 273.15 |
| 25 °C | 25 | 77 | 298.15 |
| 100 °C | 100 | 212 | 373.15 |
| 0 K | −273.15 | −459.67 | 0 |

Additional tests cover the other absolute-zero boundaries, 32 °F, −40 degrees, 98.6 °F, decimals, scientific notation and extreme values. Blank/text/partial/hex/NaN/Infinity/overflow/comma input and below-limit values in each scale are rejected with clear error state; no broken numeric output appears.

Live preview does not save until Convert. All 9 source/target swap combinations, same-scale/empty/invalid swap behavior, all precision/focus options, stale-result clearing, Enter and Reset pass. Actual single/all clipboard text and allowed/denied fallback behavior were checked. CSV headers/order/full-precision values/timestamps were parsed. History cap, replay, duplicates, reload, clear, malformed storage and blocked-storage fallback pass. Both themes and their ARIA/persistence state fit all seven widths. The pure engine and its original tests are unchanged.

## Actual fixes and audit additions

1. Preserved learner checkbox focus when progress rendering rebuilds the list. No lesson or enrollment feature was removed.
2. Replaced unsupported decorative diagonal-arrow glyphs with small inline SVG arrows after visual review found square missing-glyph symbols. Added inline SVG favicons to the new hub/course/role pages after a fresh browser showed an automatic favicon 404. No external assets or scripts were added to the static landing page.
3. Pointed task source links to stable `main` URLs instead of the merged feature branch.
4. Corrected the one public-resume project-stack line against its linked public repository; preserved qualifications/layout and added binary PDF handling in `.gitattributes`.
5. Corrected stale merged-PR, resume-required and unexecuted-test statements in the READMEs/checklist.
6. Added the submission audit to CI and changed its static server to exercise `/OIBSIP/`. The browser PDF check verifies the actual preview URL rather than waiting for the built-in PDF viewer to emit an HTML load event.

No completed page was redesigned. No course, planner, FAQ, portfolio project or converter feature was deleted.

## Screenshots and visual review

All six full-page repository captures were refreshed at **1440 × 1000** desktop and **390 × 844** mobile viewports:

- `WebDev-L1-LandingPage/screenshots/desktop.png`, `mobile.png`
- `WebDev-L1-Portfolio/screenshots/desktop.png`, `mobile.png`
- `WebDev-L1-TemperatureConverter/screenshots/desktop.png`, `mobile.png`

They include current role/course entry links, the portfolio resume section and actual `25 °C / 77 °F / 298.15 K` converter output. Root/course/role-page review captures and the rendered PDF were also inspected during the audit. Focus is cleared and the page is returned to the top before core captures.

## CI and publication

- Verified `main` run [43178574461](https://github.com/VarmithaYogananthan/OIBSIP/actions/runs/43178574461) is successful for base `9a8f39a`. This is historical base evidence; follow-up CI is reported in the new PR's Checks tab and must be checked before merging it.
- On 12 November 2026, the Pages API and `https://varmithayogananthan.github.io/OIBSIP/` both returned **404**. A public deployment is **not verified live**. This audit did not change hosting settings.
- The local subpath audit proves path readiness, not actual public hosting. Follow README.md: review/merge the final fix PR, then **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**, wait for the Pages deployment and verify the hub and all linked pages before sharing that URL.

## Remaining limitations and submission actions

Only Chromium was exercised; Firefox, Safari, physical devices and screen readers were not tested. No full accessibility or production-security certification is claimed. Browser clipboard/download permissions vary. JavaScript floating-point results are not for precision-critical scientific use. Direct `file://` navigation is restricted by the managed environment; HTTP/subpath behavior was tested. Chromium’s built-in PDF viewer also requests the origin-level `/favicon.ico`, outside the `/OIBSIP/` repository, which returns a cosmetic 404 on the empty local origin. The audit records that exact native-viewer diagnostic separately; it does not mask application console errors or failed project assets. All HTML pages declare working inline favicons.

The three required code tasks pass. User actions remain: review the fixes and personal resume, approve/merge the new PR, enable/verify hosting if a live link is needed, record three end-to-end demos with the official two-second name/track/task title cards, post/tag `#oasisinfobyte` on LinkedIn, leave substantive comments on two fellow interns' videos, and submit the official form. The orientation email deadline is **15 December 2026**, subject to later official updates. No posting, peer comments, form submission, merge or deployment was performed by this audit.
