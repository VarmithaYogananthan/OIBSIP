# Oasis Infobyte — Web Development & Designing · Level 1

**Portfolio of three internship tasks (code deliverables).** Source branch: `feat/level-1-web-development`; original pull request: [#1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1). This document distinguishes finished code from actions that require a final human review, publishing or submission.

## Requirement-to-implementation checklist

### Task 1 — Responsive Landing Page

| Reported Level 1 requirement | Implementation | Location |
| --- | --- | --- |
| HTML and CSS | Original public landing page is HTML/CSS-only (no scripts) | `WebDev-L1-LandingPage/index.html`, `styles.css` |
| Attractive header, sections, columns and footer | EduSpark branding, hero, courses, features, learning journeys, planner, FAQ and footer | `index.html` |
| All navigation and calls to action work | Section links, syllabus expansions and landing-page course links | `index.html` |
| Each visible featured course opens full details | Distinct curriculum/outcome/capstone pages for Web, UI/UX and Python | `courses/*.html` |
| Mobile responsive | CSS media queries and keyboard-friendly controls | `styles.css` |

**Bonus only, not a required real platform:** separate Learner and Admin demo landing pages and JavaScript-powered dashboards in `apps/`. They share browser-local data only, have no authentication, and do not constitute a real course provider or production admin portal.

### Task 2 — Personal Portfolio

| Reported Level 1 requirement | Implementation | Location |
| --- | --- | --- |
| Personal introduction and portrait | Hero with original portrait photo, name and introductory copy | `WebDev-L1-Portfolio/index.html`, `assets/varmitha-portrait.jpg` |
| About, skills, projects | Dedicated sections; featured demos plus additional project history | `index.html` |
| Resume available | Actual one-page downloadable/previewable PDF (public-safe edition) | `assets/Varmitha_Resume_Public.pdf` |
| Contact information | Valid email link and GitHub profile (no simulated form) | `index.html#contact` |
| Responsive layout | Mobile/desktop CSS with reduced-motion and contrast handling | `styles.css` |

The public resume excludes residential details and unnecessary private information. Do **not** publish the unredacted original personal CV without explicit review.

### Task 3 — Temperature Converter

| Reported Level 1 requirement | Implementation | Location |
| --- | --- | --- |
| Input temperature with validation | Numeric parsing, error states and below-absolute-zero constraints | `WebDev-L1-TemperatureConverter/index.html`, `script.js`, `converter.js` |
| Choose input unit | Celsius/Fahrenheit/Kelvin selector | `index.html` |
| Convert button and meaningful output | Convert and Enter; three unit-labelled result cards | `index.html`, `script.js` |
| Correct calculations | Pure conversion engine and existing Node test cases | `converter.js`, `tests/converter.test.cjs` |
| Responsive interface | Climate Glass layout, mobile view and accessible controls | `styles.css` |

Optional enhancements: live preview, unit swapping, result copying, browser-local history, CSV export, precision selection and appearance toggle.

## Local run

From the repository root:

```bat
python -m http.server 8000
```

Then open:

- Task 1: `http://localhost:8000/WebDev-L1-LandingPage/`
- Task 2: `http://localhost:8000/WebDev-L1-Portfolio/`
- Task 3: `http://localhost:8000/WebDev-L1-TemperatureConverter/`

The three original task pages are static and do not require installation. The extra Task 1 Learner/Admin demos use JavaScript and local browser storage, and should be previewed through the same local HTTP server.

## Automated QA

A GitHub Actions workflow, `.github/workflows/verify-oibsip-level1.yml`, is configured for pushes and PRs. It runs:

```sh
node --test tests/converter.test.cjs
python tests/browser-check.py --base-url http://127.0.0.1:8000 --chromium /path/to/chromium
python tests/feature-check.py --base-url http://127.0.0.1:8000 --chromium /path/to/chromium
python tests/eduspark-apps.py --base-url http://127.0.0.1:8000 --chromium /path/to/chromium
```

The script collection checks responsive widths, real links/downloads, keyboard behavior, converter formulas and optional app workflows. **Always check the latest GitHub Actions job results before claiming the current commit passed full browser QA.** Earlier screenshot pass counts predate the newest resume and EduSpark role/course pages. Confirm screenshots for all pages you will showcase.

## Demo walkthrough outlines

**Task 1 (~60–90 seconds):** Show the responsive EduSpark hero, navigation, course filter, three detail pages, study planner, FAQ, and (optional) brief look at Learner/Admin welcome screens. Keep focus on the HTML/CSS landing-page requirement.

**Task 2 (~60–90 seconds):** Introduce yourself and portrait, show About, Skills, at least three different projects, education, experience, working Download Resume PDF button, and contact email.

**Task 3 (~60–90 seconds):** Enter 25 °C and show 77 °F / 298.15 K; test 0 °C, 32 °F and 0 K; show invalid input, reset, live preview, swap, saved history and mobile layout.

## Actions still requiring the user

- [ ] Review all three final rendered sites and the public resume content.
- [ ] Confirm all current CI test results are green; address any remaining failed checks.
- [ ] Review and merge PR #1 into `main` when satisfied.
- [ ] Enable/configure static hosting (for example, GitHub Pages) if a live demo URL is required. Do not invent live URLs.
- [ ] Record demo walkthrough videos and follow the **specific instructions in your offer letter / task sheet** (including any LinkedIn/peer review requirements).
- [ ] Use the official task submission form and links supplied to you by Oasis Infobyte. Submission has **not** been performed by this repository.

The publicly described Level 1 tasks are Landing Page, Personal Portfolio, and Temperature Converter. Details can vary across internship cohorts, so the user's own task sheet/offer email takes priority over public examples.
