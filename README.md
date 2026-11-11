# OIBSIP — Web Development & Designing

Three original, responsive Level 1 internship projects for **Oasis Infobyte**.

| Task | Project | Technology | Documentation |
| --- | --- | --- | --- |
| 1 | [EduSpark landing page](WebDev-L1-LandingPage/index.html) | HTML5, CSS3 | [README](WebDev-L1-LandingPage/README.md) |
| 2 | [Personal portfolio](WebDev-L1-Portfolio/index.html) | HTML5, CSS3 | [README](WebDev-L1-Portfolio/README.md) |
| 3 | [TempConvert — Climate Glass](WebDev-L1-TemperatureConverter/index.html) | HTML5, CSS3, Vanilla JavaScript | [README](WebDev-L1-TemperatureConverter/README.md) |

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

The portfolio uses Varmitha Yogananthan’s verified source-portfolio details and original portrait, with provenance in its README. Contact uses the supplied email rather than a form. EduSpark is a fictional education-platform concept; its contact field remains an explicit placeholder. TempConvert uses the Climate Glass Premium theme and retains its tested conversion logic.

## Repository workflow

Work is submitted from `feat/level-1-web-development` into `main` for review. The existing repository was empty at the start; a minimal README established the base branch for the pull request. No existing files were removed and no additional repository was created.
