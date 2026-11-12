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

Clone the existing repository and check out the review branch:

```sh
git clone https://github.com/VarmithaYogananthan/OIBSIP.git
cd OIBSIP
git checkout feat/level-1-web-development
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

Review desktop/mobile screenshots and use the existing branch `feat/level-1-web-development` and [PR #1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1) for internship review. Do not merge automatically.

## V2 browser verification completed — 12 November 2026

All four CSS course-filter options, three syllabus disclosures, three study routines, five FAQs, keyboard radio navigation, and CTA targets passed real Chromium testing. All seven required widths were exercised with JavaScript disabled; both real screenshots are refreshed. See [TESTING.md](../TESTING.md) and run `tests/browser-check.py` plus `tests/feature-check.py` from the repository root to reproduce. This remains an HTML/CSS concept without enrollment or a backend.
