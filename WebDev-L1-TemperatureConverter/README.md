# TempConvert — Climate Glass Premium

**Oasis Infobyte — Web Development & Designing · Level 1 · Task 3**

## Overview

An original, responsive internship project built without a framework, build system, backend, or database. This project runs directly from its static files and has no remote font or design-library dependency.

## Technologies

HTML5 + CSS3 + Vanilla JavaScript. Browser-native Grid, Flexbox, fluid sizing, media queries, CSS hover effects, and reduced-motion support. No runtime packages to install.

## Features

- Dark navy climate gradients with blue, cyan, violet, pink, and warm-orange accents.
- Frosted-glass input panel, clear Celsius/Fahrenheit/Kelvin selector, glowing Convert action, Reset, and three labelled result cards.
- Full-number parsing, finite-input validation, absolute-zero limits, clear errors, and rejection of conversion overflow.
- Enter submits; Reset clears input/errors/results and restores Celsius; editing input or changing scale clears stale results.
- Five functional quick examples: 0 °C, 25 °C, 100 °C, 98.6 °F, and 0 K. Each uses the same form and calculation path as manual input.
- Accessible live results, input labels, error focus, reference values, and expandable formulas.

## Folder structure

```text
WebDev-L1-TemperatureConverter/
index.html
styles.css
README.md
screenshots/
  desktop.png
  mobile.png
converter.js
script.js
```

## Run locally

Clone the existing repository and check out the review branch:

```sh
git clone https://github.com/VarmithaYogananthan/OIBSIP.git
cd OIBSIP
git checkout feat/level-1-web-development
python3 -m http.server 8000
```

Open `http://localhost:8000/WebDev-L1-TemperatureConverter/`. Alternatively open this folder’s `index.html` directly in an unrestricted modern browser. Keep all three task folders together for the portfolio’s sibling-project links. Python is optional, used only as a convenient local static server.

## Responsive design and accessibility

Layouts are verified at 320, 375, 390, 768, 1024, 1440, and 1920 CSS pixels. Navigation remains visible without a menu script. Sections/cards stack on phones; flexible fields, fluid typography, and capped content widths support larger displays.

Semantic headings/landmarks, skip links, visible keyboard focus, meaningful link labels, accessible color choices, sticky-header anchor offsets, and reduced-motion preferences are implemented. Decorative SVGs are hidden from assistive technology. Automated checks do not constitute a full accessibility audit.

## Validation and testing

See [TESTING.md](../TESTING.md) for actual browser results, test commands, scope, and limitations. The browser checks cover navigation/CTA destinations, local assets and CSS loading, keyboard focus, overflow, interactive controls, console errors, and screenshots.

## Screenshots

- [Desktop](screenshots/desktop.png) — actual Chromium capture, 1440 × 1000 viewport.
- [Mobile](screenshots/mobile.png) — actual Chromium capture, 390 × 844 viewport.

To refresh: serve the repository, open the page in Chromium, set each viewport in developer tools, return to the page top, and use **Capture full size screenshot**. Save the exact filenames above. Full-page images extend beyond the viewport height. For the converter, select the **Mild day 25 °C** example before capturing to show real calculated output.

## Known limitations

JavaScript is required for calculations. A noscript message and static reference formulas remain available without it. JavaScript uses IEEE-754 floating point; tiny rounding differences are possible. Results display up to six decimals, with scientific notation for very large or very small values. Not intended for precision-critical scientific use.

Chromium checks used a static local server. The managed environment blocks `file://` browser navigation; direct-file rendering was not verified here. Firefox, Safari, physical-device, and screen-reader testing have not been performed.

## Submission

Review desktop/mobile screenshots and use the existing branch `feat/level-1-web-development` and [PR #1](https://github.com/VarmithaYogananthan/OIBSIP/pull/1) for internship review. Do not merge automatically.

## Formulas and accepted input

- `K = C + 273.15`
- `K = (F + 459.67) × 5/9`
- `C = K − 273.15`
- `F = K × 9/5 − 459.67`

No intermediate rounding. Lower bounds: −273.15 °C, −459.67 °F, and 0 K. Signed decimals and scientific notation are accepted; blank input, commas, hexadecimal, partial numeric strings, non-finite values, and numeric overflow are rejected. No validation tolerance admits below-limit numeric input.

`converter.js` contains the pure calculations; `script.js` manages the form and examples. Existing calculation logic and tests are preserved. Optional checks, from the repository root with Node.js 18+:

```sh
node --test tests/converter.test.cjs
```
