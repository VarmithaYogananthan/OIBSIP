# OIBSIP — Web Development & Designing

Three original Level 1 internship projects for **Oasis Infobyte**, by Varmitha Yogananthan.

| Task | Working entry | Technology | Documentation |
| --- | --- | --- | --- |
| 1 | [EduSpark landing page](WebDev-L1-LandingPage/index.html) | HTML5 + CSS3 | [README](WebDev-L1-LandingPage/README.md) |
| 2 | [Personal portfolio](WebDev-L1-Portfolio/index.html) | HTML5 + CSS3 | [README](WebDev-L1-Portfolio/README.md) |
| 3 | [TempConvert — Climate Glass](WebDev-L1-TemperatureConverter/index.html) | HTML5 + CSS3 + vanilla JavaScript | [README](WebDev-L1-TemperatureConverter/README.md) |

The root [`index.html`](index.html) is the project hub. GitHub's file viewer displays HTML source; serve the files locally or configure Pages to see the rendered sites.

## Official requirements and status

[LEVEL1_SUBMISSION_CHECKLIST.md](LEVEL1_SUBMISSION_CHECKLIST.md) maps the implementation to the [official SIP task list](https://docs.google.com/document/d/1p4uB1o7RU3YqfUDFXRbL-YSMS-x6vM90LMo_IV7jgq0/edit), reached from the 6 November 2026 Oasis Infobyte orientation email and rechecked on 12 November 2026. Level 1 requires **all three** core tasks. The extra dashboards and downloadable resume exceed the mandatory task-card scope.

The original [PR #1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1) **was merged** into `main` on 12 November 2026. Final audit fixes are reviewed separately on `fix/level1-final-verification`; no PR is merged automatically. The verified base on `main` is `9a8f39a`.

## Run locally

```sh
git clone https://github.com/VarmithaYogananthan/OIBSIP.git
cd OIBSIP
git checkout main
python3 -m http.server 8000
```

Open `http://localhost:8000/` for the hub. The three task folders are direct entries beneath it. The static pages have no install step or build system. Use HTTP for the browser-local demos so they share a consistent origin.

## Extra EduSpark experiences

The original Task 1 landing page remains **HTML/CSS-only**. Its course images, headings and Explore actions open separate static [Web Development](WebDev-L1-LandingPage/courses/web-development.html), [UI/UX](WebDev-L1-LandingPage/courses/ui-ux-design.html) and [Python](WebDev-L1-LandingPage/courses/python-programming.html) details pages.

- [Learner landing](WebDev-L1-LandingPage/apps/user/welcome.html) → [Learner dashboard](WebDev-L1-LandingPage/apps/user/index.html): catalog search/filter, course details, local demo profiles, enrollment, lesson checklists, progress and announcements.
- [Admin landing](WebDev-L1-LandingPage/apps/admin/welcome.html) → [Admin dashboard](WebDev-L1-LandingPage/apps/admin/index.html): course create/edit/hide/delete, learner management, announcements, reports and CSV export.

JavaScript is confined to these optional apps and Task 3. The dashboards are **public, browser-local prototypes** without secure authentication, backend services or cross-device synchronization. Their local data is shared only on the same origin/browser profile. See [app documentation](WebDev-L1-LandingPage/apps/README.md).

## Portfolio and public resume

The portfolio retains the original portrait, maroon/rose/gold identity, 11 project entries, education and training. Verified destinations are used where supplied; projects without public source/demo links remain informational.

The [one-page public resume](WebDev-L1-Portfolio/assets/Varmitha_Resume_Public.pdf) has working preview and download actions. It omits a residential street address and private personal CV fields. The final audit checked its HTTP/MIME response, download bytes and rendered page. Review personal details and current training statuses before submission.

## Verification and screenshots

[TESTING.md](TESTING.md) records actual results, limitations, commands and the audit against the `/OIBSIP/` hosting prefix. The task folders each contain real Chromium `screenshots/desktop.png` and `screenshots/mobile.png` captures. The optional browser suites require Python Playwright and Chromium as test tooling; the sites themselves have no runtime packages.

```sh
node --test tests/converter.test.cjs
python3 tests/browser-check.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium
python3 tests/feature-check.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium
python3 tests/eduspark-apps.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium
```

The additional `tests/submission-audit.py` checks subpath assets, resume actions and extended cross-app workflows. The [GitHub Actions workflow](.github/workflows/verify-oibsip-level1.yml) serves the checkout under `/OIBSIP/` and runs all four browser suites plus the Node tests. Check the current PR's **Checks** tab before merging.

## GitHub Pages — activation still required

On 12 November 2026, the Pages API and expected public URL both returned **404**. A published site was not verified, and this audit did not enable hosting.

To activate after reviewing the final verification PR:

1. Merge the reviewed fixes into `main` when satisfied.
2. In this repository, open **Settings → Pages → Build and deployment**.
3. Set **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**, then **Save**.
4. Wait for the Pages build/deployment to succeed in **Actions**.
5. Verify the expected address `https://varmithayogananthan.github.io/OIBSIP/` returns the project hub; follow all three task links, course pages, role pages and resume download. Treat this address as a proposed destination until deployment is confirmed.

The browser audit verified the repository subpath locally. It does not prove a public deployment is live. No custom domain or build system is needed.

## Personal submission steps

Review the final sites and resume, then follow the [submission checklist](LEVEL1_SUBMISSION_CHECKLIST.md). Record one live demo per task, beginning with a two-second title card containing full name, track and task title. Post the demos to LinkedIn, tag Oasis Infobyte and include `#oasisinfobyte`; leave substantive comments on at least two fellow interns' videos. Submit repository/documentation links and a live demo if applicable through the official form in the orientation email.

The orientation email states **15 December 2026** as the deadline; check official communications for changes. No videos, LinkedIn posts, peer comments or official form submission were made by this repository audit.
