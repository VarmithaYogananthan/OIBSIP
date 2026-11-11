// Optional verification only: node --test tests/converter.test.cjs (Node 18+).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { convertTemperature, formatTemperature } = require('../WebDev-L1-TemperatureConverter/converter.js');
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
test('reference temperatures in every input scale', () => {
  for (const [value, unit, expected] of [
    [0, 'C', { C: 0, F: 32, K: 273.15 }],
    [212, 'F', { C: 100, F: 212, K: 373.15 }],
    [273.15, 'K', { C: 0, F: 32, K: 273.15 }],
    [-40, 'C', { C: -40, F: -40, K: 233.15 }],
    [98.6, 'F', { C: 37, F: 98.6, K: 310.15 }]
  ]) for (const [scale, result] of Object.entries(expected)) near(convertTemperature(value, unit)[scale], result);
});
test('accepts each absolute-zero boundary and rejects values just below it', () => {
  for (const [unit, limit] of Object.entries({ C: -273.15, F: -459.67, K: 0 })) {
    near(convertTemperature(limit, unit).K, 0);
    assert.throws(() => convertTemperature(limit - 1e-8, unit), /absolute zero/);
  }
});
test('round trips all nine scale combinations', () => {
  for (const unit of ['C', 'F', 'K']) for (const value of [0, 1, 273.15, 1000, 1e6]) {
    const converted = convertTemperature(value, unit);
    for (const scale of ['C', 'F', 'K']) near(convertTemperature(converted[scale], scale)[unit], value);
  }
});
test('rejects non-finite input, invalid scales, and overflow', () => {
  for (const input of [NaN, Infinity, -Infinity, '25', null]) assert.throws(() => convertTemperature(input, 'C'), /finite/);
  for (const unit of ['X', 'toString', '__proto__']) assert.throws(() => convertTemperature(25, unit), /valid unit/);
  assert.throws(() => convertTemperature(1.79e308, 'K'), /too large/);
});
test('formats zero, decimals, and extreme magnitudes clearly', () => {
  assert.equal(formatTemperature(-0), '0');
  assert.equal(formatTemperature(273.15), '273.15');
  assert.equal(formatTemperature(1e-8), '1.000000e-8');
  assert.equal(formatTemperature(1e10), '1.000000e+10');
});
