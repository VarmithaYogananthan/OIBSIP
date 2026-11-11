"use strict";

// Conversion uses Kelvin as the common scale. No intermediate rounding.
const ABSOLUTE_ZERO = Object.freeze({ C: -273.15, F: -459.67, K: 0 });
const SYMBOLS = Object.freeze({ C: "°C", F: "°F", K: "K" });

function convertTemperature(value, unit) {
  if (!Number.isFinite(value) || !Object.hasOwn(ABSOLUTE_ZERO, unit)) {
    throw new Error("Enter a finite temperature and select a valid unit.");
  }
  if (value < ABSOLUTE_ZERO[unit]) {
    throw new Error(`Temperature cannot be below absolute zero (${ABSOLUTE_ZERO[unit]} ${SYMBOLS[unit]}).`);
  }
  const kelvin = unit === "C" ? value + 273.15 : unit === "F" ? (value + 459.67) * (5 / 9) : value;
  const result = { C: kelvin - 273.15, F: kelvin * 1.8 - 459.67, K: kelvin };
  result[unit] = value; // Preserve the exact input in its original scale.
  if (!Object.values(result).every(Number.isFinite)) {
    throw new Error("This temperature is too large to convert. Enter a smaller number.");
  }
  return result;
}

function formatTemperature(value) {
  if (Object.is(value, -0) || value === 0) return "0";
  if (Math.abs(value) >= 1e9 || Math.abs(value) < 1e-6) return value.toExponential(6);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(value);
}

// Export the pure calculations for optional dependency-free Node.js checks.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { convertTemperature, formatTemperature };
}
