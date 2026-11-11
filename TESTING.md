# Verification record

Tested on 11 November 2026 using headless system Chromium through Playwright. Pages were served locally with Python’s static HTTP server. Playwright was already available in the testing environment; it is not a project dependency.

## Responsive layouts and navigation

- All three projects checked at viewport widths 320, 390, 768, and 1440 CSS pixels (12 page/viewport combinations).
- No horizontal document overflow at the tested widths.
- All fragment targets exist; relative project links return HTTP success. Across the repeated viewport runs, 124 link instances were checked.
- Every local HTML stylesheet, script, and file link resolves on disk.
- Skip links accept keyboard focus and activate successfully. Reduced-motion preference disables smooth scrolling.
- Six full-page screenshots included: 1440 × 1000 desktop and 390 × 844 mobile viewports for each project. Page lengths vary.
- Visual review of desktop and mobile screenshots. Phone and tablet overflow discovered during testing was corrected and the full browser suite rerun.
- No uncaught browser JavaScript errors during the suite.

## Temperature converter

Browser checks passed for 12 valid cases, including freezing/boiling points, −40 degrees, decimal/scientific notation, large values, and each scale’s absolute-zero boundary.

Eleven invalid cases were rejected with visible error messages and invalid-field state: empty input, text, partial numeric text, hexadecimal, Infinity, numeric overflow, comma decimals, values below absolute zero in each scale, and conversion overflow. Errors clear old results and focus the input.

Also checked Enter submission, reset to Celsius, error recovery, and clearing stale results when input changes. Calculation checks exercised 45 round trips across all nine input/output scale combinations.

The committed optional Node test suite has five passing tests covering known reference values, absolute-zero boundaries, all scale round trips, invalid/non-finite input and overflow, and display formatting. Run:

```sh
node --test tests/converter.test.cjs
```

Both JavaScript source files passed `node --check`. `git diff --check` passed before commit.

## External links

The repository URL, supplied GitHub owner profile, and LinkedIn homepage each returned HTTP 200 during verification. The LinkedIn homepage is an intentional placeholder, identified in the portfolio and its README; it must be replaced with a verified personal profile.

## Remaining review

- Supply real portfolio details, initials, email, and LinkedIn URL before publication.
- Firefox, Safari, physical-device, and screen-reader testing were not performed. Keyboard and semantic markup checks do not constitute a full accessibility audit.
- No deployment or automatic merge is included.

## Task 1 update — EduSpark

The following supersedes the original Forma landing page evidence above. Task 2 and Task 3 source, documentation, and screenshots remain unchanged.

- Opened the updated EduSpark page in system Chromium through Python Playwright, with JavaScript disabled. Testing uses only the existing browser tooling; the website contains no scripts or build dependencies.
- Checked viewport widths **320, 375, 390, 768, 1024, 1440, and 1920** pixels. No horizontal document overflow; main sections, cards, and CTAs stay within the viewport. Header click targets fit and do not overlap.
- Clicked every visible internal navigation/CTA link at every width and verified that each URL fragment resolves to one real element. Course cards lead to their matching illustrative learning paths. The skip link was verified separately through keyboard activation.
- Verified keyboard focus through the skip link and header controls, visible focus outlines, reduced-motion behavior, normal smooth scrolling, and sticky-header positioning without obscuring the Courses section heading.
- Confirmed no script elements or inline event handlers, a resolving local stylesheet, and no external images or font dependencies. No uncaught browser errors during checks.
- Reviewed full-page desktop and mobile captures and corrected illustration spacing, icon rendering, and course artwork captions. Fresh EduSpark captures replace `WebDev-L1-LandingPage/screenshots/desktop.png` (1440 × 1000 viewport) and `mobile.png` (390 × 844 viewport).
- The dashboard is explicitly labelled a concept preview; course progress and learning journeys are illustrative. No live enrollment, student statistics, or real endorsements are claimed.

Direct `file://` navigation was attempted but Chromium returned `ERR_BLOCKED_BY_ADMINISTRATOR` under this environment’s managed URL policy. Browser verification therefore used the local static HTTP server. Relative assets were inspected and the page uses only static HTML/CSS, but direct-file rendering was not verified here. Firefox, Safari, physical-device, and screen-reader testing remain unperformed.

The root overview and untouched portfolio still use the previous Forma project label; their relative landing-page links continue to resolve to EduSpark. They were left unchanged to respect the requested Task 1 scope. Contact information remains an explicit placeholder.
