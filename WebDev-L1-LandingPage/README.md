# EduSpark — Learn Today, Lead Tomorrow.

**Oasis Infobyte — Web Development & Designing · Level 1 · Task 1**

## Overview

An original, responsive internship project built without a framework, build system, backend, or database. This project runs directly from its static files and has no remote font or design-library dependency.

## Technologies

HTML5 + CSS3 only. Browser-native Grid, Flexbox, fluid sizing, media queries, CSS hover effects, and reduced-motion support. No runtime packages to install.

## Features

- All nine sections preserved: sticky navigation, hero, courses, features, how it works, About, illustrative learner journeys, final CTA, and contact/footer.
- Blue/violet gradient CTAs, soft lavender backgrounds, glass-inspired learning cards, and original CSS/SVG course artwork.
- Courses/Get Started/Explore Courses lead to Courses; Why EduSpark? leads to Features; course cards lead to their matching example paths.
- Every informational action has a real destination. No live courses, login, payment, or enrollment are implied.
- Native, no-JavaScript category filters show all paths or Web Development, UI/UX Design, or Python individually.
- Each course includes an expandable sample syllabus, capstone idea, and matching learner journey.
- Interactive CSS-only 15/30/60-minute study planner demonstrates alternative routines without collecting data.
- Five expandable FAQ answers provide clear guidance on choosing a path and understanding the static-site scope.
- Project creator contact uses a verified mailto link; it is not a student-support inbox.

## Folder structure

```text
WebDev-L1-LandingPage/
index.html
styles.css
README.md
screenshots/
  desktop.png
  mobile.png
```

## Run locally

Clone the repository and use the `main` branch:

```sh
git clone https://github.com/VarmithaYogananthan/OIBSIP.git
cd OIBSIP
git checkout main
python3 -m http.server 8000
```

Open `http://localhost:8000/WebDev-L1-LandingPage/`. Alternatively open this folder’s `index.html` directly in an unrestricted modern browser. Keep all three task folders together for the portfolio’s sibling-project links. Python is optional, used only as a convenient local static server.

## Responsive design and accessibility

Layouts are verified at 320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels. Navigation remains visible without a menu script. Sections/cards stack on phones; flexible fields, fluid typography, and capped content widths support larger displays.

Semantic headings/landmarks, skip links, visible keyboard focus, meaningful link labels, accessible color choices, sticky-header anchor offsets, and reduced-motion preferences are implemented. Decorative SVGs are hidden from assistive technology. Automated checks do not constitute a full accessibility audit.

## Validation and testing

See [TESTING.md](../TESTING.md) for actual browser results, test commands, scope, and limitations. The browser checks cover navigation/CTA destinations, local assets and CSS loading, keyboard focus, overflow, interactive controls, console errors, and screenshots.

## Screenshots

- [Desktop](screenshots/desktop.png) — actual Chromium capture, 1440 × 1000 viewport.
- [Mobile](screenshots/mobile.png) — actual Chromium capture, 390 × 844 viewport.

To refresh: serve the repository, open the page in Chromium, set each viewport in developer tools, return to the page top, and use **Capture full size screenshot**. Save the exact filenames above. Full-page images extend beyond the viewport height. For the converter, select the **Mild day 25 °C** example before capturing to show real calculated output.

## Known limitations

Static learning-platform concept. The dashboard progress and sample learning journeys are explicitly illustrative. The footer now links to the project creator’s verified email for concept enquiries, not live course support. No actual courses or enrollment are implemented.

Chromium checks used a static local server. The managed environment blocks `file://` browser navigation; direct-file rendering was not verified here. Firefox, Safari, physical-device, and screen-reader testing have not been performed.

## Submission

Both [PR #1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1) and final-verification [PR #2](https://github.com/VarmithaYogananthan/OIBSIP/pull/2) are merged into `main`. Review the current screenshots, personal details and TESTING.md before internship submission.

## V2 browser verification completed — 12 November 2026

All four CSS course-filter options, three syllabus disclosures, three study routines, five FAQs, keyboard radio navigation, and CTA targets passed real Chromium testing. All seven required widths were exercised with JavaScript disabled; both real screenshots are refreshed. See [TESTING.md](../TESTING.md) and run `tests/browser-check.py` plus `tests/feature-check.py` from the repository root to reproduce. This remains an HTML/CSS concept without enrollment or a backend.

## Separate Learner + Admin Web App demos (12 November 2026)

The original HTML/CSS-only Task 1 landing page is preserved. Two separately navigable interactive demonstration interfaces have been added under `apps/`:

- **Learner demo:** `apps/user/` — learner demo profile, course browsing/search/filter, enrollment, lesson checklist progress, notices and profile editing.
- **Admin demo:** `apps/admin/` — dashboards, course create/edit/visibility/delete, demo learner management, announcements, reports/CSV export and reset.
- **Shared app files:** `apps/store.js` and `apps/app.css` implement a consistent learner/admin experience with browser-local persistence. No backend or real sign-in exists.

The landing page links to both apps via the hero and portal cards. This extra demo functionality is separate from the original internship Task 1 requirement and uses JavaScript **inside the new apps only**. Full technical details, data safety limitations and instructions are in [apps/README.md](apps/README.md).

### Separate app test procedure

From the repository root, start a local HTTP server (`python -m http.server 8000`), then run `python tests/eduspark-apps.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium` in an environment with Python Playwright and Chromium. The suite passed 17 scenario groups during the final audit. The additional submission audit exercises every course entry, all app views and buttons, form validation, same-origin changes without reload, report contents and keyboard lesson focus. All checks run under a local `/OIBSIP/` prefix; see TESTING.md for current evidence.

## Landing-page routing fix — course and role destinations

The existing three course cards are now fully clickable on their artwork, title and Explore link and point to dedicated static course details:

| Course | Details page |
|---|---|
| Web Development | `courses/web-development.html` |
| UI/UX Design | `courses/ui-ux-design.html` |
| Python Programming | `courses/python-programming.html` |

The secondary **See learning journey** links still scroll to the existing example-path sections. Every details page includes an overview, four modules, outcomes, mini project and a linked Learner App course screen.

The **Open Learner App** / **Open Admin Demo** buttons and portal cards route to `apps/user/welcome.html` and `apps/admin/welcome.html`, respectively. These are fully separate welcome/landing experiences with direct CTA links to their respective dashboards. Demo course browsing and admin data remain browser-local, not authenticated.

The new cross-app test cases in `tests/eduspark-apps.py` check course-page navigation, role welcome pages, learner catalog detail deep links, reload/back, and responsiveness. These routes passed the current 17-group learner/admin suite; the earlier 16-group GitHub Actions result is historical, not the final audit result. The original HTML/CSS landing page remains without JavaScript.
