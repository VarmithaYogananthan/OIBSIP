# Final UI & functionality verification

Verified 11 November 2026 on the existing `feat/level-1-web-development` branch. This record supersedes the earlier Forma and intermediate-theme screenshots and notes.

## Environment and reproduction

System Chromium was automated through Python Playwright against a local Python static server. Tasks 1 and 2 were tested with browser JavaScript disabled. Task 3 used its existing vanilla JavaScript. No application dependencies or build tools were added.

```sh
python3 -m http.server 8000
# In a second terminal, using an environment with Python Playwright and Chromium:
python3 tests/browser-check.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium
# Optional dependency-free calculation checks, with Node.js 18+:
node --test tests/converter.test.cjs
```

The optional browser script uses existing test tooling, checks public GitHub URLs, and refreshes the six screenshots. It is not loaded by any website. Its default Chromium path can be overridden with `--chromium`.

## Responsive and interaction coverage

All three sites were checked at **320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels**: 21 page/viewport combinations.

- No horizontal document overflow at those widths. Main sections, cards, buttons, and input controls fit within their viewport.
- Header navigation targets fit without overlapping one another. Portfolio navigation wraps on small phones; all items remain visible without a menu script.
- 238 internal anchor clicks verified unique, existing targets and the resulting URL fragments. Back-to-top links, EduSpark CTAs, matching course-to-path links, and all portfolio navigation destinations were covered.
- 28 actual local project-link clicks verified navigation to working sibling project files.
- All local images, stylesheets, and scripts resolve. CSS was confirmed loaded; the portrait loaded successfully. Tasks 1 and 2 contain no scripts.
- Keyboard skip links, focus outlines, header focus traversal, sticky navigation/anchor offsets, and reduced-motion behavior were checked. Normal-motion smooth scrolling was separately checked.
- No uncaught browser JavaScript errors or failed local asset HTTP responses during the passing run.

## Task 1 — EduSpark

All nine existing sections retained. The final action audit corrected the white CTA styling overridden by a previous generic gradient rule. Glass-inspired learning cards, premium CTAs, blue/violet/lavender styling, and responsive course artwork remain HTML/CSS only.

Course cards navigate to `#path-web`, `#path-design`, and `#path-python`; Get Started and Explore Courses navigate to `#courses`; Why EduSpark? navigates to `#features`. The dashboard and learner journeys are explicitly examples. No fake login, purchase, or enrollment action is present.

## Task 2 — Varmitha portfolio

Source content verified against `VarmithaYogananthan/portfolio` commit `bb0231ad54aed179f1ad864dcfa89d214b653d2f`. Education/training statuses and project descriptions reflect that snapshot; no dates or new qualifications were added. Original portrait bytes match SHA-256 `d66059167c377d327f55ce07a4848c9caf9ab19fffdc3765f56b809c4a366d4b`.

- All eight required sections present, including separate Education and Training & Experience sections.
- Maroon, burgundy, rose, cream, and gold identity visually reviewed in desktop/mobile captures.
- EduSpark and TempConvert project cards open the correct sibling projects.
- GitHub/profile/source URLs returned HTTP 200. Additional original-portfolio projects have informational summaries, without invented demo/source URLs.
- Contact links have the verified `mailto:yvarmitha@gmail.com` destination. This checks correct link construction, not email delivery or a desktop mail-client integration.
- No fake contact form, CV download, or unverified LinkedIn URL.

## Task 3 — Climate Glass Premium

The existing `converter.js`, `script.js`, and `tests/converter.test.cjs` were preserved unchanged. The redesign keeps the same form IDs, input validation, calculation functions, live results, reset behavior, and example-handler path.

### Browser calculation results

12 valid conversion cases passed, including all supplied samples:

| Input | Celsius | Fahrenheit | Kelvin |
| --- | ---: | ---: | ---: |
| 0 °C | 0 | 32 | 273.15 |
| 100 °C | 100 | 212 | 373.15 |
| 25 °C | 25 | 77 | 298.15 |
| 32 °F | 0 | 32 | 273.15 |
| 0 K | −273.15 | −459.67 | 0 |

Additional cases covered each other absolute-zero boundary, −40 degrees, 98.6 °F, decimal input, scientific notation, and Kelvin reference conversion. Large scientific-notation results remained within the viewport at all widths.

12 invalid cases were rejected: blank, text, partial numeric text, hexadecimal, Infinity, NaN, overflowing input, comma decimals, below-limit values in each input scale, and conversion overflow. Each produced a clear error, invalid-field state, empty results, and input focus. No NaN/Infinity output appeared.

All five quick examples were activated at every width: **35 example checks**. Enter submission, error recovery, input-change clearing, unit-change clearing and symbol update, Reset, result labels, and the expandable formula disclosure passed. A separate real-keyboard check exercised ArrowDown on the native selector, Enter on a quick example, Enter on Reset, and restored input focus.

### Existing automated calculation tests

**5 passed, 0 failed** using Node’s built-in test runner. Coverage includes reference values, exact absolute-zero boundaries and below-limit rejection, 45 round trips across all nine scale combinations, invalid units/non-finite input/overflow, and numerical formatting. Neither tests nor validation were removed or weakened. Both JavaScript files also passed `node --check`.

## Screenshot artifacts

Real full-page Chromium captures, with a 1440 × 1000 desktop viewport and a 390 × 844 mobile viewport:

- `WebDev-L1-LandingPage/screenshots/desktop.png` and `mobile.png`
- `WebDev-L1-Portfolio/screenshots/desktop.png` and `mobile.png`
- `WebDev-L1-TemperatureConverter/screenshots/desktop.png` and `mobile.png`

Converter images show actual `25 °C → 77 °F → 298.15 K` output after selecting the quick example. Capture focus is cleared and the page is returned to the top so sticky headers appear in the correct position. No mockups or generated images are used. After the final line-break spacing and ordered training-timeline refinement, 14 targeted responsive checks passed for the portfolio and converter, and their four screenshots were refreshed again.

## External URLs and remaining limits

The five distinct public GitHub destinations used across the pages returned HTTP 200: the owner profile, each task’s source directory, and the original portfolio source file.

- Only Chromium was exercised. Firefox, Safari, physical devices, and screen readers were not tested; these checks are not a full accessibility certification.
- The cloud environment blocks direct `file://` navigation; rendering checks used a static HTTP server. Local references and script-free Tasks 1/2 were inspected.
- EduSpark remains a static concept with a contact placeholder; it has no live course/enrollment services.
- Mail delivery and external mail applications were not exercised. No PDF resume was found in the provided portfolio repository, so no CV action was added.
- Additional portfolio project live-demo/source links can be added when verified URLs are supplied.
- Conversion uses JavaScript floating-point arithmetic and is not for precision-critical scientific measurements.

`git diff --check` passed. Review is through the existing PR #1; no automatic merge or deployment is included.
