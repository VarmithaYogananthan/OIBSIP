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
