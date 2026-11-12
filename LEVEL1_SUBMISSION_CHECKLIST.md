# Oasis Infobyte — Web Development & Designing · Level 1

**Portfolio of three internship tasks (code deliverables).** The checklist below was cross-checked against the **Web Development & Designing Level 1 Task Cards** in the current Oasis Infobyte SIP task list supplied through the user's 6 November 2026 orientation email. The extra Learner/Admin demos and resume download go beyond the mandatory Level 1 card scope. Source branch: `feat/level-1-web-development`; original pull request: [#1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1). This document distinguishes finished code from actions that require a final human review, publishing or submission.

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
| Optional enhancement: downloadable resume PDF | Actual one-page downloadable/previewable PDF (public-safe edition) | `assets/Varmitha_Resume_Public.pdf` |
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


## Exact Level 1 task-card verification

The assigned **Level 1** contains **all three** required tasks. The Task Card feature lists were checked as follows:

**Task 1 — Landing Page (HTML5 + CSS3; JS not required).**
- [x] Fixed/sticky navigation with at least three links (Home, Courses, Features, About, Contact).
- [x] Hero includes headline, subheadline and clear CTA.
- [x] More than two distinct content sections.
- [x] Footer with contact/social or project-source link.
- [x] Consistent color palette and readable heading/body type sizes.
- [x] Flex/Grid responsive layout, with intentional padding/box sizing.
- [x] No element overlap in previously verified mobile/desktop browser widths.

**Task 2 — Personal Portfolio (HTML5 + CSS3; JS optional).**
- [x] Name, role and a real source-portfolio portrait.
- [x] About Me background/interest copy.
- [x] Visual technical skills listing.
- [x] At least two project cards, with title, description and useful working links.
- [x] Contact section with name, email and GitHub.
- [x] Smooth scrolling navigation between sections.
- [x] Consistent maroon, rose and gold branding and responsive layout.
- [x] Bonus public-safe resume PDF supplied in the repository.

**Task 3 — Temperature Converter (HTML5 + CSS3 + vanilla JS).**
- [x] Numeric temperature input and friendly error for invalid values.
- [x] Celsius/Fahrenheit/Kelvin input-unit dropdown.
- [x] Separate target-unit option and simultaneous output in all three scales.
- [x] Convert action performs actual conversion.
- [x] Correctly labelled Celsius/Fahrenheit/Kelvin result area.
- [x] Below-absolute-zero rejection with user-friendly error.
- [x] Clear, centered responsive input and result presentation.

These checkboxes describe the implementation; they are **not** substitutes for final browser verification on the latest commit.

## Specific internship submission rules (orientation guidance)

- Repository name must be **`OIBSIP`** and folders follow **`[TrackName]-[Level/Task]-[ProjectName]`**. Existing `WebDev-L1-...` folders match the task-list example.
- Every task must be documented and committed with source and screenshots/output files.
- Each of the **three demo videos** must begin with a **2-second title card** including full name, assigned track and task title, followed by an end-to-end live walkthrough.
- Post the videos on LinkedIn, tag **Oasis Infobyte**, and include **`#oasisinfobyte`** on each post.
- Watch and leave substantive comments on **two fellow interns'** LinkedIn demo videos.
- Submit through the official Task Submission Form sent in the orientation email, including repository URL and documentation. **The repo has not been submitted yet.**
- Orientation email states **15 December 2026** as the final submission deadline; confirm any updates through official communications.
- Recommended video filenames matching the orientation email's `YourName_TaskNumber` pattern: `Varmitha_Task1.mp4`, `Varmitha_Task2.mp4`, and `Varmitha_Task3.mp4`.

The profile/video/peer evaluation/form items require user interaction and are **not marked complete** merely because the website code is pushed.
