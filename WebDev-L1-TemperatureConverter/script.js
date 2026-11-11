"use strict";

const form = document.querySelector("#temperature-form");
const input = document.querySelector("#temperature");
const unit = document.querySelector("#unit");
const error = document.querySelector("#error");
const caption = document.querySelector("#result-caption");
const note = document.querySelector("#result-note");

function clearResults(message = "Enter a temperature and select Convert to get started.") {
  for (const scale of Object.keys(SYMBOLS)) document.querySelector(`#result-${scale}`).textContent = "—";
  caption.textContent = "Your temperature, three ways.";
  note.textContent = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  const raw = input.value.trim();
  try {
    if (!raw) throw new Error("Enter a temperature to convert.");
    // Accept signed decimal/scientific notation; reject partial numbers and hex.
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw)) {
      throw new Error("Enter a valid number, such as 25, -10, or 98.6. Use a dot for decimals.");
    }
    const value = Number(raw);
    const result = convertTemperature(value, unit.value);
    for (const scale of Object.keys(SYMBOLS)) document.querySelector(`#result-${scale}`).textContent = formatTemperature(result[scale]);
    caption.textContent = `${formatTemperature(value)} ${SYMBOLS[unit.value]}, three ways.`;
    note.textContent = "Conversion complete. Results show up to six decimal places.";
  } catch (failure) {
    error.textContent = failure.message;
    input.setAttribute("aria-invalid", "true");
    clearResults("Check your input, then convert again.");
    input.focus();
  }
});

function clearInputState() {
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  clearResults("Input changed. Select Convert to update the results.");
}
input.addEventListener("input", clearInputState);
unit.addEventListener("change", () => {
  document.querySelector("#input-symbol").textContent = SYMBOLS[unit.value];
  clearInputState();
});
form.addEventListener("reset", () => {
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  document.querySelector("#input-symbol").textContent = "°C";
  clearResults();
  input.focus();
});


// Quick examples use the same verified calculation path as manual input.
document.querySelectorAll(".sample-row button").forEach((button) => {
  button.addEventListener("click", () => {
    unit.value = button.dataset.unit;
    input.value = button.dataset.value;
    document.querySelector("#input-symbol").textContent = SYMBOLS[unit.value];
    form.requestSubmit();
  });
});
