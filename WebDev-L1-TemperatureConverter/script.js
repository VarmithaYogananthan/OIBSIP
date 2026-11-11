"use strict";

const form = document.querySelector("#temperature-form");
const input = document.querySelector("#temperature");
const unit = document.querySelector("#unit");
const targetUnit = document.querySelector("#target-unit");
const precision = document.querySelector("#precision");
const liveMode = document.querySelector("#live-mode");
const error = document.querySelector("#error");
const caption = document.querySelector("#result-caption");
const note = document.querySelector("#result-note");
const copyStatus = document.querySelector("#copy-status");
const historyList = document.querySelector("#history-list");
const historyCount = document.querySelector("#history-count");
const historyEmpty = document.querySelector("#history-empty");
const exportButton = document.querySelector("#export-history");
const clearHistoryButton = document.querySelector("#clear-history");
const themeToggle = document.querySelector("#theme-toggle");
const HISTORY_KEY = "tempconvert_history_v2";
const THEME_KEY = "tempconvert_theme_v2";
const SCALES = ["C", "F", "K"];
let lastConversion = null;
let historyEntries = [];

function displayValue(value) {
  const digits = Number(precision.value);
  if (digits === 6) return formatTemperature(value);
  if (Object.is(value, -0) || value === 0) return "0";
  if (Math.abs(value) >= 1e9 || Math.abs(value) < 1e-6) return value.toExponential(digits);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
}

function parseInput() {
  const raw = input.value.trim();
  if (!raw) throw new Error("Enter a temperature to convert.");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw)) {
    throw new Error("Enter a valid number, such as 25, -10, or 98.6. Use a dot for decimals.");
  }
  return Number(raw);
}

function setCopyEnabled(enabled) {
  document.querySelectorAll(".copy-scale").forEach(function(button) { button.disabled = !enabled; });
  document.querySelector("#copy-all").disabled = !enabled;
}

function clearResults(message = "Enter a temperature and select Convert to get started.") {
  lastConversion = null;
  SCALES.forEach(function(scale) { document.querySelector("#result-" + scale).textContent = "—"; });
  caption.textContent = "Your temperature, three ways.";
  note.textContent = message;
  document.querySelector("#climate-indicator").hidden = true;
  setCopyEnabled(false);
  copyStatus.textContent = "";
  updateTargetHighlight();
}

function updateTargetHighlight() {
  document.querySelectorAll(".result-card").forEach(function(card) { card.classList.remove("focused-result"); });
  const output = document.querySelector("#result-" + targetUnit.value);
  if (output) output.closest(".result-card").classList.add("focused-result");
}

function updateClimate(celsius) {
  const container = document.querySelector("#climate-indicator");
  const label = document.querySelector("#climate-label");
  const fill = document.querySelector("#climate-fill");
  let category = "Hot";
  if (celsius < 0) category = "Freezing";
  else if (celsius < 15) category = "Cold";
  else if (celsius < 30) category = "Mild";
  else if (celsius < 40) category = "Warm";
  label.textContent = category;
  fill.style.width = Math.max(0, Math.min(100, ((celsius + 50) / 150) * 100)) + "%";
  container.hidden = false;
}

function renderConversion(value, results, info) {
  lastConversion = { value: value, source: unit.value, results: results };
  SCALES.forEach(function(scale) {
    document.querySelector("#result-" + scale).textContent = displayValue(results[scale]);
  });
  caption.textContent = displayValue(value) + " " + SYMBOLS[unit.value] + ", three ways.";
  note.textContent = info || "Conversion complete. Results show your selected display precision.";
  setCopyEnabled(true);
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  updateTargetHighlight();
  updateClimate(results.C);
}

function showFailure(failure, focusInput) {
  error.textContent = failure.message;
  input.setAttribute("aria-invalid", "true");
  clearResults("Check your input, then convert again.");
  if (focusInput) input.focus();
}

function safeRead(key) {
  try { return localStorage.getItem(key); } catch (failure) { return null; }
}
function safeWrite(key, value) {
  try { localStorage.setItem(key, value); } catch (failure) { /* Private browsing or file origin: session-only history. */ }
}

function addHistory(value, source) {
  const item = { value: value, source: source, at: new Date().toISOString() };
  if (historyEntries.length && historyEntries[0].value === value && historyEntries[0].source === source) {
    historyEntries[0] = item;
  } else {
    historyEntries.unshift(item);
  }
  historyEntries = historyEntries.slice(0, 12);
  saveHistory();
  renderHistory();
}
function saveHistory() {
  safeWrite(HISTORY_KEY, JSON.stringify(historyEntries));
}
function restoreHistory() {
  const stored = safeRead(HISTORY_KEY);
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;
    historyEntries = parsed.filter(function(item) {
      if (!item || typeof item.value !== "number" || !SCALES.includes(item.source)) return false;
      try { convertTemperature(item.value, item.source); return true; } catch (failure) { return false; }
    }).slice(0, 12).map(function(item) {
      return { value: item.value, source: item.source, at: typeof item.at === "string" && !Number.isNaN(Date.parse(item.at)) ? item.at : new Date().toISOString() };
    });
  } catch (failure) {
    historyEntries = [];
  }
}

function renderHistory() {
  historyList.replaceChildren();
  historyCount.textContent = "(" + historyEntries.length + ")";
  historyEmpty.hidden = historyEntries.length > 0;
  exportButton.disabled = historyEntries.length === 0;
  clearHistoryButton.disabled = historyEntries.length === 0;
  historyEntries.forEach(function(item) {
    const results = convertTemperature(item.value, item.source);
    const row = document.createElement("li");
    const summary = document.createElement("div");
    summary.className = "history-values";
    const primary = document.createElement("strong");
    primary.textContent = displayValue(item.value) + " " + SYMBOLS[item.source];
    const translated = document.createElement("span");
    translated.textContent = SCALES.filter(function(scale) { return scale !== item.source; }).map(function(scale) {
      return displayValue(results[scale]) + " " + SYMBOLS[scale];
    }).join(" · ");
    summary.append(primary, translated);
    const controls = document.createElement("div");
    controls.className = "history-controls";
    const time = document.createElement("time");
    time.dateTime = item.at;
    time.textContent = new Date(item.at).toLocaleString();
    const restore = document.createElement("button");
    restore.type = "button";
    restore.textContent = "Use again";
    restore.setAttribute("aria-label", "Use " + item.value + " " + SYMBOLS[item.source] + " again");
    restore.addEventListener("click", function() {
      unit.value = item.source;
      input.value = String(item.value);
      document.querySelector("#input-symbol").textContent = SYMBOLS[item.source];
      form.requestSubmit();
      document.querySelector("#converter").scrollIntoView({ behavior: "auto", block: "start" });
    });
    controls.append(time, restore);
    row.append(summary, controls);
    historyList.append(row);
  });
}

function calculate(record) {
  const value = parseInput();
  const results = convertTemperature(value, unit.value);
  renderConversion(value, results, record ? undefined : "Live preview. Select Convert to save this to history.");
  if (record) addHistory(value, unit.value);
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  try { calculate(true); } catch (failure) { showFailure(failure, true); }
});

function inputChanged() {
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  if (liveMode.checked && input.value.trim()) {
    try { calculate(false); } catch (failure) { showFailure(failure, false); }
  } else {
    clearResults(liveMode.checked ? "Start typing to preview a conversion." : "Input changed. Select Convert to update the results.");
  }
}
input.addEventListener("input", inputChanged);
unit.addEventListener("change", function() {
  document.querySelector("#input-symbol").textContent = SYMBOLS[unit.value];
  inputChanged();
});
liveMode.addEventListener("change", inputChanged);
targetUnit.addEventListener("change", updateTargetHighlight);
precision.addEventListener("change", function() {
  if (lastConversion) renderConversion(lastConversion.value, lastConversion.results, "Display precision updated. Calculations remain unrounded.");
  renderHistory();
});
form.addEventListener("reset", function() {
  error.textContent = "";
  input.removeAttribute("aria-invalid");
  document.querySelector("#input-symbol").textContent = "°C";
  clearResults();
  input.focus();
});

document.querySelectorAll(".sample-row button").forEach(function(button) {
  button.addEventListener("click", function() {
    unit.value = button.dataset.unit;
    input.value = button.dataset.value;
    document.querySelector("#input-symbol").textContent = SYMBOLS[unit.value];
    form.requestSubmit();
  });
});

document.querySelector("#swap-units").addEventListener("click", function() {
  const from = unit.value;
  const to = targetUnit.value;
  if (from === to) {
    note.textContent = "Choose a different Focus result to swap units.";
    targetUnit.focus();
    return;
  }
  try {
    const raw = input.value.trim();
    const translated = raw ? convertTemperature(parseInput(), from)[to] : null;
    unit.value = to;
    targetUnit.value = from;
    document.querySelector("#input-symbol").textContent = SYMBOLS[to];
    if (translated !== null) {
      input.value = String(Number(translated.toPrecision(14))); // Avoid binary-float artifacts such as 76.99999999999994
      form.requestSubmit();
    } else {
      clearResults("Units swapped. Enter a temperature to convert.");
      input.focus();
    }
    updateTargetHighlight();
  } catch (failure) { showFailure(failure, true); }
});

function fallbackCopy(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (failure) { ok = false; }
  helper.remove();
  return ok;
}
async function copyText(text, successMessage) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else if (!fallbackCopy(text)) {
      throw new Error("Clipboard permission unavailable");
    }
    copyStatus.textContent = successMessage;
  } catch (failure) {
    if (fallbackCopy(text)) copyStatus.textContent = successMessage;
    else copyStatus.textContent = "Copy unavailable here. Select the displayed value and press Ctrl+C.";
  }
}
document.querySelectorAll(".copy-scale").forEach(function(button) {
  button.addEventListener("click", function() {
    if (!lastConversion) return;
    const scale = button.dataset.scale;
    copyText(displayValue(lastConversion.results[scale]) + " " + SYMBOLS[scale], scale + " result copied.");
  });
});
document.querySelector("#copy-all").addEventListener("click", function() {
  if (!lastConversion) return;
  const text = SCALES.map(function(scale) { return scale + ": " + displayValue(lastConversion.results[scale]) + " " + SYMBOLS[scale]; }).join("\n");
  copyText(text, "All temperature results copied.");
});

clearHistoryButton.addEventListener("click", function() {
  historyEntries = [];
  saveHistory();
  renderHistory();
});
exportButton.addEventListener("click", function() {
  if (!historyEntries.length) return;
  const rows = ["Input,Source,Celsius,Fahrenheit,Kelvin,Timestamp"];
  historyEntries.forEach(function(item) {
    const result = convertTemperature(item.value, item.source);
    rows.push([item.value, item.source, result.C, result.F, result.K, item.at].join(","));
  });
  const blob = new Blob([rows.join("\r\n") + "\r\n"], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const download = document.createElement("a");
  download.href = url;
  download.download = "tempconvert-history.csv";
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
});

function applyTheme(theme) {
  const light = theme === "light";
  document.body.classList.toggle("light-theme", light);
  themeToggle.textContent = light ? "☾ Dark mode" : "☀ Light mode";
  themeToggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  themeToggle.setAttribute("aria-pressed", String(light));
  safeWrite(THEME_KEY, light ? "light" : "dark");
}
themeToggle.addEventListener("click", function() {
  applyTheme(document.body.classList.contains("light-theme") ? "dark" : "light");
});

restoreHistory();
renderHistory();
updateTargetHighlight();
applyTheme(safeRead(THEME_KEY) === "light" ? "light" : "dark");
