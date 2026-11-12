# OIBSIP — complete browser verification

Verified **12 November 2026** on `feat/level-1-web-development`, after safely fast-forwarding the clean checkout to remote commit `5fc71c7`. These are results for the current interactive features, replacing the earlier V2 “not yet tested” notices. No features were removed.

## Reproduce

Use an environment with Python Playwright and Chromium installed for browser tests. They are test tools, not website dependencies.

```sh
python3 -m http.server 8000
# Second terminal:
python3 tests/browser-check.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium
python3 tests/feature-check.py --base-url http://127.0.0.1:8000 --chromium /usr/bin/chromium
node --test tests/converter.test.cjs
```

The browser suites use a local static server and isolated browser contexts. Tasks 1 and 2 are tested with website JavaScript disabled. Screenshots use the Asia/Colombo timezone, a 1440 × 1000 desktop viewport and a 390 × 844 mobile viewport. `browser-check.py` refreshes all six screenshots; `feature-check.py` downloads a temporary CSV, exercises clipboard permissions, and verifies storage/error fallbacks. Tests do not send email or change remote applications.

## Actual results

| Suite | Result |
| --- | --- |
| Existing Node calculation suite | **5 passed, 0 failed**, including 45 round trips |
| Existing full browser suite | **Passed**: 21 layout checks, 287 internal anchor clicks, 28 local project-link clicks, 12 valid conversions, 12 invalid conversions, 35 quick-example checks, 37 additional feature checks, 6 screenshot captures |
| New extended feature/regression suite | **22 scenario groups passed**; no console errors, uncaught page errors, or failed local asset responses |
| External link checks | All **8 distinct GitHub URLs returned HTTP 200** |
| JavaScript syntax / git whitespace checks | Passed |

Both browser suites checked widths **320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels**. There was no horizontal document overflow. Header click targets fit; local stylesheets and the portrait loaded. Existing keyboard skip-link/focus, sticky navigation/anchor offsets, normal smooth scrolling, reduced-motion, and responsive-card checks passed. The expanded suite also checks native radio keyboard operation and both converter themes at all seven widths.

## EduSpark — every learning control

At every listed width:

- Activated **All paths, Web Development, Design, and Programming** filters; confirmed checked-state and the exact matching visible card count.
- Opened and closed **all three course syllabi**, checked their three syllabus items, and activated disclosure controls with Enter.
- Selected **15, 30, and 60 minute study plans**, then returned to 15; confirmed exactly one matching plan appears each time.
- Opened and closed **all five FAQs**, including keyboard activation.
- Used ArrowRight on the course and planner radio groups; verified the checked option changes.
- Verified Home/Courses/Features/About/Contact, Get Started, all Explore Courses actions, Why EduSpark?, planner CTA, syllabus journey links, matching course-to-path links, and Back to Top through actual anchor clicks.

This remains HTML/CSS only. The contact enquiry link uses the creator’s email, rather than implying real course support. No enrollment, payment, login, or backend is implied.

## Portfolio — project and contact links

- All navigation and section CTAs, both featured project visuals and their View Project links, and Back to Top passed real local navigation checks.
- The expanded nine-card additional-project inventory remains intact. Source links for Spendly, Banking Application, the original portfolio, and the original project descriptions resolve. Entries without verified demos remain informational and are not fake buttons.
- GitHub profile/source links were checked by HTTP requests. Actual email links were inspected for the supplied `mailto:yvarmitha@gmail.com` destination; no email was sent.
- Portrait, CSS, expanded cards, education timeline, and training timeline loaded and fit at the seven widths. The original portrait is unchanged.

## TempConvert — calculations and every control

### Conversion, input and preview

12 valid cases include all supplied references, all three absolute-zero boundaries, −40 degrees, 98.6 °F, decimal input, scientific notation, and Kelvin reference conversion:

| Input | Celsius | Fahrenheit | Kelvin |
| --- | ---: | ---: | ---: |
| 0 °C | 0 | 32 | 273.15 |
| 100 °C | 100 | 212 | 373.15 |
| 25 °C | 25 | 77 | 298.15 |
| 32 °F | 0 | 32 | 273.15 |
| 0 K | −273.15 | −459.67 | 0 |

12 invalid cases cover blank input, text, partial numbers, hexadecimal, Infinity, NaN, overflowing input, comma decimals, below-absolute-zero input in every scale, and conversion overflow. Errors appear clearly, results/copy actions clear, invalid-field state is set, and explicit submission returns focus to the input. No NaN/Infinity result is shown.

- Convert and Enter submission work. All five quick examples were activated at every width (35 checks).
- Live preview handles valid, invalid, empty, and changed-source input. It does **not** save previews to history; Convert saves one.
- Climate categories Freezing, Cold, Mild, Warm, and Hot were verified.
- Editing manual input or changing its scale clears stale results. The unit symbol updates.
- Reset clears input/errors/results/live mode, restores Celsius/Fahrenheit/default precision, restores the correct focused card, refreshes history display precision, and preserves saved history.
- The expandable formulas open and close.

### Swap, focus and precision

- Exercised **all nine source/focus combinations**, including same-scale guidance, six genuine swaps, blank-input swap, and invalid-input swap.
- Every focus option highlights its matching result card.
- Display precision **2, 4, and 6** was checked against nontrivial decimals. The original numeric calculation remains unchanged. Large scientific-notation output fits at every width.

### Clipboard and CSV

- Read the **actual clipboard contents** after all three scale-copy buttons and Copy All: `25 °C`, `77 °F`, `298.15 K`, and the full labelled multiline output.
- Checked successful legacy clipboard fallback, denied clipboard/failed fallback messaging, and retained keyboard focus on the triggering copy action.
- Downloaded `tempconvert-history.csv` and **parsed its contents**: six exact column headers, expected three-row count/order, original full-precision values despite a two-place display setting, and UTC ISO timestamps.
- Empty-state copy/export/clear-history actions are disabled.

### History and themes

- Verified the **12-entry history limit**, immediate duplicate handling, persistence after reload, every saved row’s Use Again action (oldest first within the bounded list), Clear History, and clear persistence after reload.
- Tested malformed JSON, non-array storage, invalid/null entries, below-limit stored values, and invalid timestamps; invalid entries are discarded and dates repaired safely.
- Simulated blocked browser storage: calculations, session history, and theme switching continue to work.
- Toggled **both themes at every width**, checked `aria-pressed`, theme persistence after reload, header control positioning, and absence of horizontal overflow. Theme-specific heading/icon accents now use darker colors on light backgrounds.

The pure `converter.js` calculation engine and the existing five Node tests were not modified or weakened.

## Failures found and fixed

1. **Reset state mismatch:** native form defaults changed after the reset handler ran, leaving the previous focused card highlighted and history formatted at the old precision. Dependent UI is now reconciled after native defaults are restored; a browser regression covers both states.
2. **Fallback copy lost keyboard focus:** removing the temporary textarea dropped focus. The copy fallback now restores the triggering element without scrolling; success and failure paths are tested.
3. **Light-theme accent visibility:** pale dark-theme accents were reused on a pale background. Added theme-specific darker heading, scale, and reference-icon accents.
4. **Missing favicon request:** console monitoring exposed an automatic `/favicon.ico` 404. Each page now supplies its own lightweight inline SVG favicon; the passing extended run has no failed asset responses or console errors.

5. **Syllabus marker rendering:** screenshot review found numeric markers on closed course syllabi. Restored native closed/open disclosure triangles; open/close and layout checks passed at 320, 390 and 1440px, and the EduSpark captures were refreshed.

Test harness repairs also preserve realistic interactions: use the visible label for the custom live-preview switch, await asynchronous clipboard confirmation, and replay bounded history oldest-first rather than expecting evicted rows to remain available. No control was force-clicked or removed to obtain a pass.

## Six refreshed real screenshots

All are actual full-page Chromium output, with focus cleared and the page returned to the top before capture:

| Project | Desktop | Mobile |
| --- | --- | --- |
| EduSpark | `WebDev-L1-LandingPage/screenshots/desktop.png` | `WebDev-L1-LandingPage/screenshots/mobile.png` |
| Portfolio | `WebDev-L1-Portfolio/screenshots/desktop.png` | `WebDev-L1-Portfolio/screenshots/mobile.png` |
| TempConvert | `WebDev-L1-TemperatureConverter/screenshots/desktop.png` | `WebDev-L1-TemperatureConverter/screenshots/mobile.png` |

Converter captures show actual **25 °C → 77 °F → 298.15 K** output, the climate indicator, new controls and three recent history entries. No generated mockups are used.

## Remaining limits

- Only system Chromium was exercised. Firefox, Safari, physical devices and screen readers remain untested; this is not a full accessibility audit.
- Browser tests used localhost. Direct-file access is restricted by the managed browser environment and was not verified here.
- Clipboard tests used an allowed localhost origin; both allowed and denied fallback paths were exercised. Other browsers may impose different clipboard/download restrictions.
- Mail links were inspected; email delivery and external mail applications were not exercised. External GitHub URLs were HTTP-checked, not audited internally.
- History/theme persistence is local to the browser. When storage is blocked, history is session-only by design.
- The converter uses JavaScript floating-point arithmetic; it is not a precision-critical scientific tool.

Work is committed to the existing feature branch and PR #1 for review. No merge or deployment is performed.
