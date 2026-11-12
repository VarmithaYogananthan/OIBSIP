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
- Two working internship project demos, plus nine additional project cards: Spendly, Green Leaf Grand, CRM & Automated Marketing, MovieReviewAPI, Taskly / TaskFlow, Banking Application, HealthBridge, REQVIORA (formerly SYNTIVO), and Personal Portfolio Website. Spendly and Banking Application link to public repositories; the rest are described without invented live demo links.
- Verified email (`mailto:yvarmitha@gmail.com`), GitHub profile, source repository links, visible navigation, and Back to Top.
- **Bonus public resume:** a real, one-page, downloadable PDF resume with verified education, skills, training, projects, and Jaffna-level location (no residential street address or private personal details).
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
  Varmitha_Resume_Public.pdf
```

## Run locally

Clone the existing repository and check out the review branch:

```sh
git clone https://github.com/VarmithaYogananthan/OIBSIP.git
cd OIBSIP
git checkout main
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

To refresh: serve the repository, open the page in Chromium, set each viewport in developer tools, return to the page top, and use **Capture full size screenshot**. Save the exact filenames above. Full-page images extend beyond the viewport height. Keep all 11 project entries and the resume preview/download actions visible in the full-page capture.

## Known limitations

A real, one-page PDF resume is available at `assets/Varmitha_Resume_Public.pdf`, with both Download PDF and Preview Resume links in the portfolio. It was prepared from the user's CV/portfolio information and intentionally omits residential address and marital status for public sharing. No pretend contact form or unverified LinkedIn profile is included. Email requires a configured mail application; delivery was not tested. Live demos/source repositories for the five additional source-portfolio projects were not supplied, so their descriptions are informational rather than fake project buttons.

Chromium checks used a static local server. The managed environment blocks `file://` browser navigation; direct-file rendering was not verified here. Firefox, Safari, physical-device, and screen-reader testing have not been performed.

## Submission

The original [PR #1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1) is merged into `main`. Final audit fixes are reviewed separately on `fix/level1-final-verification`; do not reopen PR #1 or merge follow-up changes automatically. Review the current screenshots and TESTING.md before internship submission.

## Verified content and portrait provenance

Source: [VarmithaYogananthan/portfolio](https://github.com/VarmithaYogananthan/portfolio), inspected at commit `bb0231ad54aed179f1ad864dcfa89d214b653d2f`. Content comes from `index.html`, with the archived original maroon page used to confirm the color identity and background details. Descriptions are condensed, not new achievement claims. Current education/training statuses reflect that source snapshot and should be reviewed when your circumstances change.

The source contains an embedded JPEG portrait. `assets/varmitha-portrait.jpg` is the exact decoded byte sequence, reused under the owner’s instruction without modifying the photo. SHA-256: `d66059167c377d327f55ce07a4848c9caf9ab19fffdc3765f56b809c4a366d4b`.

## Additional project cards (11 November 2026)

The project inventory now includes verified public source links for Spendly and a C# Banking Application alongside five documented projects from the original portfolio and two ongoing concepts. HealthBridge and SYNTIVO are clearly labelled as work in development or prototype concepts; no production deployment is claimed. Updated card layout is responsive. The expanded layout and verified source links passed Chromium checks at all seven required widths on 12 November 2026; both actual screenshots are refreshed.

### Project inventory update
The previous SYNTIVO project is now described as REQVIORA (formerly SYNTIVO) to reflect the user's newer naming, with no claim of production completion. The original standalone personal portfolio repository is also displayed as a separate project. The section now contains two featured internship projects and nine additional cards (11 total). The expanded project inventory is not a substitute for the user's confirmation that all other private/local projects are included. The current inventory is included in the 12 November 2026 browser/link checks and refreshed screenshots; see TESTING.md.

## Resume download and privacy

A one-page public-safe PDF is included at `assets/Varmitha_Resume_Public.pdf`. It uses verified details available in the existing user-provided CV and project portfolio, excludes residential address/marital status, and is a **public profile document**, not the unredacted original CV. The hero action downloads it as `Varmitha_Yogananthan_Resume.pdf`; the Resume section also has PDF preview and download links.

The final audit verified an application/pdf response, byte-identical browser downloads and the actual preview tab, then rendered and reviewed the single PDF page. No residential street address, marital status or private CV attachment is present. Only the Spendly project-stack description was aligned with its verified HTML/CSS/JavaScript/local-storage repository; all other resume text and the one-page layout were preserved. Confirm personal details and ongoing education/training statuses before posting it.
