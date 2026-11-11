# TempConvert — Temperature Converter

Oasis Infobyte · Web Development & Designing · Level 1

## Technology

HTML5, CSS3 and Vanilla JavaScript. Original design and source code; no templates, external fonts, libraries, build tools, backend, or database. Works offline after download.

## Setup and usage

1. Clone the existing repository: `git clone https://github.com/VarmithaYogananthan/OIBSIP.git`.
2. Check out the review branch: `git checkout feat/level-1-web-development`.
3. Open `WebDev-L1-TemperatureConverter/index.html` in a modern browser. No installation is needed.
4. Alternatively, from the repository root run `python3 -m http.server 8000`, then visit `http://localhost:8000/WebDev-L1-TemperatureConverter/`.

Keep the three task folders next to one another so portfolio project links resolve.

## Screenshot instructions

1. Open the project in Chrome, Firefox, or Edge.
2. Capture a desktop view at 1440 × 1000 and a mobile view at 390 × 844 using browser developer tools and its screenshot command.
3. For a full-page screenshot, use the browser’s “Capture full size screenshot” option.
4. Save captures in this folder’s `screenshots/` directory as `desktop.png` and `mobile.png`. Captures made during automated review are included there.
5. Check navigation, focus visibility, text wrapping, and horizontal overflow before recording your internship demonstration.

## Accessibility and responsive design

Semantic landmarks, a skip link, visible keyboard focus, fluid typography, responsive grid layouts, and reduced-motion support. No remote assets are required.

## Usage

Enter a temperature, choose the input scale, and select **Convert temperature** (or press Enter). All three scales appear together. Reset clears the input, errors, and results and returns to Celsius. Editing input clears old results to avoid displaying stale conversions.

Signed decimals and scientific notation are accepted (for example `-10`, `.5`, `1e3`). Use a decimal dot; commas, units in the field, partial numbers, hexadecimal, blank input, non-finite values, and numeric overflow are rejected. Values below −273.15 °C / −459.67 °F / 0 K are rejected before conversion. There is no tolerance that accepts below-limit input.

## Formulas

- Celsius → Kelvin: `K = C + 273.15`
- Fahrenheit → Kelvin: `K = (F + 459.67) × 5/9`
- Kelvin → Celsius: `C = K − 273.15`
- Kelvin → Fahrenheit: `F = K × 9/5 − 459.67`

No intermediate rounding. Display precision is up to six decimals, or six decimal places in scientific notation for magnitudes below 0.000001 or at least 1 billion. JavaScript uses IEEE-754 floating point; results are not for precision-critical scientific calculations.

## Manual checks

- `0 °C` → `32 °F`, `273.15 K`.
- `212 °F` → `100 °C`, `373.15 K`.
- `0 K` → `−273.15 °C`, `−459.67 °F`.
- `−40 °C` → `−40 °F`, `233.15 K`.
- Reject empty input, `abc`, `12abc`, `Infinity`, and temperatures below each scale’s absolute zero.
- Test reset, Enter submission, changed-input clearing, error recovery, and keyboard focus.

## Optional automated calculation checks

From the repository root, with Node.js 18+: `node --test tests/converter.test.cjs`. The test uses Node’s built-in runner with no packages to install. `converter.js` contains pure calculation/formatting functions; `script.js` manages the form and accessible results.

## Premium UI and quick examples

The converter now uses a responsive climate-glass colour system. Quick example buttons set verified Celsius/Fahrenheit/Kelvin values and submit via the existing validated conversion handler. Converted results are displayed only after the user presses Convert or selects an example; Reset clears the form and results. All calculations remain in `converter.js`.

The JavaScript behavior and styles were updated after the original automated browser run. Rerun tests and capture fresh desktop/mobile screenshots before submitting.
