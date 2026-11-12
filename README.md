# OIBSIP — Web Development & Designing

Three original, responsive Level 1 internship projects for **Oasis Infobyte**.

| Task | Project | Technology | Documentation |
| --- | --- | --- | --- |
| 1 | [EduSpark landing page](WebDev-L1-LandingPage/index.html) | HTML5, CSS3 | [README](WebDev-L1-LandingPage/README.md) |
| 2 | [Personal portfolio](WebDev-L1-Portfolio/index.html) | HTML5, CSS3 | [README](WebDev-L1-Portfolio/README.md) |
| 3 | [TempConvert — Climate Glass](WebDev-L1-TemperatureConverter/index.html) | HTML5, CSS3, Vanilla JavaScript | [README](WebDev-L1-TemperatureConverter/README.md) |

## Internship requirement checklist

See [Level 1 Task 1–3 submission checklist](LEVEL1_SUBMISSION_CHECKLIST.md) for a precise feature-by-feature mapping to the 2026 cohort task list, honest demo limitations, required video/LinkedIn/peer-evaluation steps, and final submission procedure.

Task 2 now includes a [public-safe one-page downloadable PDF resume](WebDev-L1-Portfolio/assets/Varmitha_Resume_Public.pdf), linked from the hero and resume section. An automated [GitHub Actions browser/functional test](.github/workflows/verify-oibsip-level1.yml) runs on PRs and pushes.

## Run locally

Open any project’s `index.html` directly in a modern browser, or serve the repository:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000/WebDev-L1-LandingPage/`, `http://localhost:8000/WebDev-L1-Portfolio/`, or `http://localhost:8000/WebDev-L1-TemperatureConverter/`.

No dependencies, build, account, backend, or database are needed. Keep all task folders alongside one another for the portfolio’s project links. The repository links above open source files on GitHub; use the local URLs to view the rendered pages.

## Screenshots and verification

Each task includes desktop/mobile PNGs in `screenshots/` and instructions for capturing replacements. See [TESTING.md](TESTING.md) for tested behavior and limitations.

Optional dependency-free calculation checks require Node.js 18+:

```sh
node --test tests/converter.test.cjs
```

## Content and remaining review

The portfolio uses Varmitha Yogananthan’s verified source-portfolio details and original portrait, with provenance in its README. Contact uses the supplied email rather than a form. EduSpark is a fictional education-platform concept; its contact link is for project enquiries rather than live course support. TempConvert uses the Climate Glass Premium theme and retains its tested conversion logic.

## Repository workflow

Work is submitted from `feat/level-1-web-development` into `main` for review. The existing repository was empty at the start; a minimal README established the base branch for the pull request. No existing files were removed and no additional repository was created.

## November 2026 — feature-rich enhancement in review

Task 1 EduSpark now has HTML/CSS-only course category filters, expandable course syllabi, a three-pace learning planner, FAQs and a verified project-enquiry email link. Task 3 TempConvert now includes optional live mode, source/target swapping, result copying, adjustable precision, local history, CSV export, theme switching and a visual temperature indicator. The pure conversion engine and Task 2 portfolio remain unchanged. These additions are on `feat/level-1-web-development` in PR #1; not merged. The full browser and extended regression suites have now passed; all six real desktop/mobile screenshots are refreshed. See TESTING.md for the 12 November 2026 results and remaining limits.

## EduSpark learner/admin demos

Task 1 now includes two extra independent browser-local apps: [Learner demo](WebDev-L1-LandingPage/apps/user/) and [Admin demo](WebDev-L1-LandingPage/apps/admin/), linked directly from the existing EduSpark landing page. The learner demo includes catalog, lesson checklists and progress; the admin demo includes course CRUD, local learner metrics, announcements and CSV reports. The original internship landing page remains HTML/CSS-only, and the new JavaScript runs only in the demo web apps.

These are frontend demonstration interfaces: no secure authentication, production admin access control, live registration, backend, shared database or cross-device synchronization. Use a local static server, and do not enter sensitive information. See [app documentation](WebDev-L1-LandingPage/apps/README.md) and the new `tests/eduspark-apps.py` browser workflow script. Its runtime test results remain pending.

## EduSpark routing and dual landing-page enhancement

The public EduSpark landing page now opens distinct static pages for each featured course: Web Development, UI/UX Design and Python Programming. Clicking a course image, heading, or Explore link navigates to a dedicated curriculum/details page. A corresponding details screen is also available for **all** Learner App catalog courses, including admin-created ones, via `#course/<id>`.

The EduSpark role buttons now open the **separate Learner landing** (`WebDev-L1-LandingPage/apps/user/welcome.html`) and **separate Admin landing** (`WebDev-L1-LandingPage/apps/admin/welcome.html`) before their respective dashboards. No real secure role login is implied. Both apps remain a frontend-only shared-browser demo. The original HTML/CSS landing-page scope is preserved.

Additional Playwright navigation and responsive tests have been added in `tests/eduspark-apps.py`; the new routes have not yet had a recorded complete browser execution. Re-run tests and regenerate screenshots after pulling these commits.
