# Varmitha Yogananthan — Personal Portfolio

**Oasis Infobyte — Web Development & Designing · Level 1 · Task 2**

## Overview

An original, responsive internship project built without a framework, build system, backend, or database. This project runs directly from its static files and has no remote font or design-library dependency.

## Technologies

HTML5 + CSS3 only. Browser-native Grid, Flexbox, fluid sizing, media queries, CSS hover effects, and reduced-motion support. No runtime packages to install.

## Features

- Deep maroon/burgundy sections balanced with warm cream surfaces, rose details, and champagne gold highlights.
- Home, About Me, Skills, Featured Projects, Education, Training & Experience, Contact, and footer.
- Original portrait copied byte-for-byte from the provided portfolio; no retouching or replacement imagery.
- Two working internship project demos, plus eight additional project cards: Spendly, Green Leaf Grand, CRM & Automated Marketing, MovieReviewAPI, Taskly / TaskFlow, Banking Application, HealthBridge, and SYNTIVO. Spendly and Banking Application link to public repositories; the rest are described without invented live demo links.
- Verified email (`mailto:yvarmitha@gmail.com`), GitHub profile, source repository links, visible navigation, and Back to Top.
- Education and training use source-listed statuses; no new qualifications, employers, dates, grades, or internship completion claims.

## Folder structure

```text
WebDev-L1-Portfolio/
index.html
styles.css
README.md
screenshots/
  desktop.png
  mobile.png
assets/
  varmitha-portrait.jpg
```

## Run locally

Clone the existing repository and check out the review branch:

```sh
git clone https://github.com/VarmithaYogananthan/OIBSIP.git
cd OIBSIP
git checkout feat/level-1-web-development
python3 -m http.server 8000
```

Open `http://localhost:8000/WebDev-L1-Portfolio/`. Alternatively open this folder’s `index.html` directly in an unrestricted modern browser. Keep all three task folders together for the portfolio’s sibling-project links. Python is optional, used only as a convenient local static server.

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

No CV download is offered because the provided repository contains no PDF resume. No pretend contact form or unverified LinkedIn profile is included. Email requires a configured mail application; delivery was not tested. Live demos/source repositories for the five additional source-portfolio projects were not supplied, so their descriptions are informational rather than fake project buttons.

Chromium checks used a static local server. The managed environment blocks `file://` browser navigation; direct-file rendering was not verified here. Firefox, Safari, physical-device, and screen-reader testing have not been performed.

## Submission

Review desktop/mobile screenshots and use the existing branch `feat/level-1-web-development` and [PR #1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1) for internship review. Do not merge automatically.

## Verified content and portrait provenance

Source: [VarmithaYogananthan/portfolio](https://github.com/VarmithaYogananthan/portfolio), inspected at commit `bb0231ad54aed179f1ad864dcfa89d214b653d2f`. Content comes from `index.html`, with the archived original maroon page used to confirm the color identity and background details. Descriptions are condensed, not new achievement claims. Current education/training statuses reflect that source snapshot and should be reviewed when your circumstances change.

The source contains an embedded JPEG portrait. `assets/varmitha-portrait.jpg` is the exact decoded byte sequence, reused under the owner’s instruction without modifying the photo. SHA-256: `d66059167c377d327f55ce07a4848c9caf9ab19fffdc3765f56b809c4a366d4b`.

## Additional project cards (11 November 2026)

The project inventory now includes verified public source links for Spendly and a C# Banking Application alongside five documented projects from the original portfolio and two ongoing concepts. HealthBridge and SYNTIVO are clearly labelled as work in development or prototype concepts; no production deployment is claimed. Updated card layout is responsive. The prior browser test/screenshot report predates this content change: rerun browser checks and refresh portfolio screenshots before final submission.
