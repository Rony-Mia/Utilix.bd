import assert from 'node:assert/strict';
import {
  getFactors,
  convertLand,
  decompose,
  decomposeRaw,
  formatDecomposed,
  parseAreaInput,
  formatAreaNumber,
  getCleanCopyValue,
  UNITS,
  KANI_SQFT,
  BIGHA_SQFT,
  KaniBasis,
  BighaBasis,
} from './landConverter.ts';

function relEq(actual: number, expected: number, relTol = 1e-6, message?: string) {
  const diff = Math.abs(actual - expected);
  const scale = Math.max(Math.abs(actual), Math.abs(expected), 1e-9);
  const rel = diff / scale;
  assert.ok(
    rel <= relTol,
    `${message ?? 'Tolerance exceeded'}: actual=${actual}, expected=${expected}, relDiff=${rel} > ${relTol}`
  );
}

console.log('--- Starting Land Converter Engine Tests ---');

// 1. Default basis tests (kani: nol8, bigha: sqft14400)
{
  console.log('Test 1: Default Basis Constants & Standard Conversions');
  const factors = getFactors('nol8', 'sqft14400');

  // ১ একর = ১০০ শতক = ৩.০২৫ বিঘা = ৬০.৫ কাঠা = ৪৮৪০ বর্গগজ = ১,০০,০০০ বর্গলিংক = ১৯৩৬০ বর্গহাত = ৪০৪৬.৮৫৬৪ বর্গমিটার
  const acreInShotok = convertLand(1, 'acre', 'shotok', factors);
  relEq(acreInShotok, 100, 1e-9, '1 acre in shotok');

  const acreInBigha = convertLand(1, 'acre', 'bigha', factors);
  relEq(acreInBigha, 3.025, 1e-9, '1 acre in bigha');

  const acreInKatha = convertLand(1, 'acre', 'katha', factors);
  relEq(acreInKatha, 60.5, 1e-9, '1 acre in katha');

  const acreInSqyd = convertLand(1, 'acre', 'sqyd', factors);
  relEq(acreInSqyd, 4840, 1e-9, '1 acre in sqyd');

  const acreInSqlink = convertLand(1, 'acre', 'sqlink', factors);
  relEq(acreInSqlink, 100000, 1e-9, '1 acre in sqlink');

  const acreInSqhat = convertLand(1, 'acre', 'sqhat', factors);
  relEq(acreInSqhat, 19360, 1e-9, '1 acre in sqhat');

  const acreInSqm = convertLand(1, 'acre', 'sqm', factors);
  relEq(acreInSqm, 4046.8564, 1e-4, '1 acre in sqm');

  // ১ বিঘা = ২০ কাঠা = ৩২০ ছটাক = ১৪৪০০ বর্গফুট = ১৬০০ বর্গগজ = ১৩৩৭.৮০৩৮ বর্গমিটার = ৩৩.০৫৭৯ শতক
  relEq(convertLand(1, 'bigha', 'katha', factors), 20, 1e-9, '1 bigha in katha');
  relEq(convertLand(1, 'bigha', 'chotak', factors), 320, 1e-9, '1 bigha in chotak');
  relEq(convertLand(1, 'bigha', 'sqft', factors), 14400, 1e-9, '1 bigha in sqft');
  relEq(convertLand(1, 'bigha', 'sqyd', factors), 1600, 1e-9, '1 bigha in sqyd');
  relEq(convertLand(1, 'bigha', 'sqm', factors), 1337.8038, 1e-4, '1 bigha in sqm');
  relEq(convertLand(1, 'bigha', 'shotok', factors), 33.0579, 1e-4, '1 bigha in shotok');

  // ১ কাঠা = ৭২০ বর্গফুট = ১৬ ছটাক = ১.৬৫২৯ শতক
  relEq(convertLand(1, 'katha', 'sqft', factors), 720, 1e-9, '1 katha in sqft');
  relEq(convertLand(1, 'katha', 'chotak', factors), 16, 1e-9, '1 katha in chotak');
  relEq(convertLand(1, 'katha', 'shotok', factors), 1.6529, 1e-4, '1 katha in shotok');

  // ১ ছটাক = ৪৫ বর্গফুট = ২০ গণ্ডা (ছটাকের) = ২০ বর্গহাত
  relEq(convertLand(1, 'chotak', 'sqft', factors), 45, 1e-9, '1 chotak in sqft');
  relEq(convertLand(1, 'chotak', 'gonda_chotak', factors), 20, 1e-9, '1 chotak in gonda_chotak');
  relEq(convertLand(1, 'chotak', 'sqhat', factors), 20, 1e-9, '1 chotak in sqhat');

  // ১ কানি = ১৭২৮০ বর্গফুট = ২০ গণ্ডা = ৮০ কড়া = ২৪০ ক্রান্তি = ৪৮০০ তিল = ১৬০৫.৩৬৪৫ বর্গমিটার = ৩৯.৬৬৯৪ শতক
  relEq(convertLand(1, 'kani', 'sqft', factors), 17280, 1e-9, '1 kani in sqft');
  relEq(convertLand(1, 'kani', 'gonda_kani', factors), 20, 1e-9, '1 kani in gonda_kani');
  relEq(convertLand(1, 'kani', 'kora_kani', factors), 80, 1e-9, '1 kani in kora_kani');
  relEq(convertLand(1, 'kani', 'kranti', factors), 240, 1e-9, '1 kani in kranti');
  relEq(convertLand(1, 'kani', 'til', factors), 4800, 1e-9, '1 kani in til');
  relEq(convertLand(1, 'kani', 'sqm', factors), 1605.3645, 1e-4, '1 kani in sqm');
  relEq(convertLand(1, 'kani', 'shotok', factors), 39.6694, 1e-4, '1 kani in shotok');

  // ১ ক্রান্তি = ৬ দণ্ড = ৭২ বর্গফুট; ১ দণ্ড = ৭ ধুল = ১২ বর্গফুট; ১ ধুল = ৩০ রেণু
  relEq(convertLand(1, 'kranti', 'dondho', factors), 6, 1e-9, '1 kranti in dondho');
  relEq(convertLand(1, 'kranti', 'sqft', factors), 72, 1e-9, '1 kranti in sqft');
  relEq(convertLand(1, 'dondho', 'dhul', factors), 7, 1e-9, '1 dondho in dhul');
  relEq(convertLand(1, 'dondho', 'sqft', factors), 12, 1e-9, '1 dondho in sqft');
  relEq(convertLand(1, 'dhul', 'renu', factors), 30, 1e-9, '1 dhul in renu');

  // ১ হেক্টর = ১০০ আর = ১০০০০ বর্গমিটার = ২৪৭.১০৫৪ শতক = ২.৪৭১১ একর = ৭.৪৭৪৯ বিঘা
  relEq(convertLand(1, 'hectare', 'are', factors), 100, 1e-9, '1 hectare in are');
  relEq(convertLand(1, 'hectare', 'sqm', factors), 10000, 1e-6, '1 hectare in sqm');
  relEq(convertLand(1, 'hectare', 'shotok', factors), 247.1054, 1e-4, '1 hectare in shotok');
  relEq(convertLand(1, 'hectare', 'acre', factors), 2.4711, 1e-4, '1 hectare in acre');
  relEq(convertLand(1, 'hectare', 'bigha', factors), 7.4749, 1e-4, '1 hectare in bigha');

  // ১ শতক = ১০০ অযুতাংশ = ৪৩৫.৬ বর্গফুট = ৪০.৪৬৮৬ বর্গমিটার
  relEq(convertLand(1, 'shotok', 'ojutangsho', factors), 100, 1e-9, '1 shotok in ojutangsho');
  relEq(convertLand(1, 'shotok', 'sqft', factors), 435.6, 1e-9, '1 shotok in sqft');
  relEq(convertLand(1, 'shotok', 'sqm', factors), 40.4686, 1e-4, '1 shotok in sqm');
}

// 2. Kani basis toggle tests (shotok40)
{
  console.log('Test 2: Kani Basis Toggle (shotok40)');
  const factors = getFactors('shotok40', 'sqft14400');
  const defaultFactors = getFactors('nol8', 'sqft14400');

  // ১ কানি = ৪০ শতক = ১৭৪২৪ বর্গফুট = ১৬১৮.৭৪২৬ বর্গমিটার
  relEq(convertLand(1, 'kani', 'shotok', factors), 40, 1e-9, '1 kani in shotok (shotok40)');
  relEq(convertLand(1, 'kani', 'sqft', factors), 17424, 1e-9, '1 kani in sqft (shotok40)');
  relEq(convertLand(1, 'kani', 'sqm', factors), 1618.7426, 1e-4, '1 kani in sqm (shotok40)');

  // Acre, shotok, bigha should NOT change
  assert.equal(factors.acre, defaultFactors.acre, 'acre unchanged under kani toggle');
  assert.equal(factors.shotok, defaultFactors.shotok, 'shotok unchanged under kani toggle');
  assert.equal(factors.bigha, defaultFactors.bigha, 'bigha unchanged under kani toggle');
}

// 3. Bigha basis toggle tests (shotok33)
{
  console.log('Test 3: Bigha Basis Toggle (shotok33)');
  const factors = getFactors('nol8', 'shotok33');
  const defaultFactors = getFactors('nol8', 'sqft14400');

  // ১ বিঘা = ৩৩ শতক = ১৪৩৭৪.৮ বর্গফুট, ১ কাঠা = ৭১৮.৭৪ বর্গফুট
  relEq(convertLand(1, 'bigha', 'shotok', factors), 33, 1e-9, '1 bigha in shotok (shotok33)');
  relEq(convertLand(1, 'bigha', 'sqft', factors), 14374.8, 1e-9, '1 bigha in sqft (shotok33)');
  relEq(convertLand(1, 'katha', 'sqft', factors), 718.74, 1e-9, '1 katha in sqft (shotok33)');

  // Acre, shotok, kani should NOT change
  assert.equal(factors.acre, defaultFactors.acre, 'acre unchanged under bigha toggle');
  assert.equal(factors.shotok, defaultFactors.shotok, 'shotok unchanged under bigha toggle');
  assert.equal(factors.kani, defaultFactors.kani, 'kani unchanged under bigha toggle');
}

// 4. Round-trip conversion tests across all pairs and 4 toggle combinations
{
  console.log('Test 4: Round-Trip Invariance Across All Pairs & Modes');
  const toggleCombinations: Array<[KaniBasis, BighaBasis]> = [
    ['nol8', 'sqft14400'],
    ['shotok40', 'sqft14400'],
    ['nol8', 'shotok33'],
    ['shotok40', 'shotok33'],
  ];

  const testVal = 17.8425;
  const unitIds = UNITS.map((u) => u.id);

  for (const [kBasis, bBasis] of toggleCombinations) {
    const factors = getFactors(kBasis, bBasis);
    for (let i = 0; i < unitIds.length; i++) {
      for (let j = 0; j < unitIds.length; j++) {
        const u1 = unitIds[i];
        const u2 = unitIds[j];
        const forward = convertLand(testVal, u1, u2, factors);
        const back = convertLand(forward, u2, u1, factors);
        relEq(back, testVal, 1e-9, `Round trip for ${u1} <-> ${u2} [${kBasis}, ${bBasis}]`);
      }
    }
  }
}

// 5. Decompose tests
{
  console.log('Test 5: Mixed Form Decompose');
  const factors = getFactors('nol8', 'sqft14400');

  // ৫.৩৫ বিঘা → ৫ বিঘা ৭ কাঠা (ছটাক ০)
  // 5.35 * 14400 = 77040 sqft
  const dec535 = decompose(5.35 * 14400, ['bigha', 'katha', 'chotak'], factors);
  assert.equal(dec535.length, 2, '5.35 bigha has 2 non-zero components');
  assert.equal(dec535[0].id, 'bigha');
  assert.equal(dec535[0].value, 5);
  assert.equal(dec535[1].id, 'katha');
  assert.equal(dec535[1].value, 7);

  const raw535 = decomposeRaw(5.35 * 14400, ['bigha', 'katha', 'chotak'], factors);
  assert.equal(raw535[2].id, 'chotak');
  assert.equal(raw535[2].value, 0, 'chotak is 0');

  const formatted535 = formatDecomposed(dec535, true);
  assert.equal(formatted535, '৫ বিঘা ৭ কাঠা');

  // ১ একর → ৩ বিঘা, ০ কাঠা, ৮ ছটাক (1 acre = 43560 sqft)
  const rawAcre = decomposeRaw(43560, ['bigha', 'katha', 'chotak'], factors);
  assert.equal(rawAcre[0].id, 'bigha');
  assert.equal(rawAcre[0].value, 3);
  assert.equal(rawAcre[1].id, 'katha');
  assert.equal(rawAcre[1].value, 0);
  assert.equal(rawAcre[2].id, 'chotak');
  assert.equal(rawAcre[2].value, 8);

  const decAcre = decompose(43560, ['bigha', 'katha', 'chotak'], factors);
  assert.equal(decAcre[0].value, 3);
  assert.equal(decAcre[1].value, 8);
  assert.equal(formatDecomposed(decAcre, true), '৩ বিঘা ৮ ছটাক');

  // Test zero
  const decZero = decompose(0, ['bigha', 'katha', 'chotak'], factors);
  assert.equal(formatDecomposed(decZero, true), '০');
}

// 6. Parsing tests
{
  console.log('Test 6: Area Input Parsing');

  // Valid inputs
  const p1 = parseAreaInput('1,000');
  assert.equal(p1.isValid, true);
  assert.equal(p1.value, 1000);

  const p2 = parseAreaInput('১২.৫');
  assert.equal(p2.isValid, true);
  assert.equal(p2.value, 12.5);

  const p3 = parseAreaInput(' 5 ');
  assert.equal(p3.isValid, true);
  assert.equal(p3.value, 5);

  // Invalid inputs with Bengali error messages
  const i1 = parseAreaInput('');
  assert.equal(i1.isValid, false);
  assert.ok(i1.error && i1.error.length > 0);

  const i2 = parseAreaInput('abc');
  assert.equal(i2.isValid, false);
  assert.ok(i2.error && i2.error.length > 0);

  const i3 = parseAreaInput('-3');
  assert.equal(i3.isValid, false);
  assert.ok(i3.error && i3.error.includes('ঋণাত্মক'));

  const i4 = parseAreaInput('1.2.3');
  assert.equal(i4.isValid, false);
  assert.ok(i4.error && i4.error.length > 0);

  const i5 = parseAreaInput('1e13');
  assert.equal(i5.isValid, false);
  assert.ok(i5.error && i5.error.length > 0);
}

// 7. Floating-point guard
{
  console.log('Test 7: Floating-Point Rounding Guard');
  const factors = getFactors('nol8', 'sqft14400');

  // ০.৩৫ বিঘা = 0.35 * 14400 = 5040 sqft
  // 5040 / 720 = 7 katha (exactly 7, remainder 0, chotak 0)
  const dec035 = decompose(0.35 * 14400, ['bigha', 'katha', 'chotak'], factors);
  assert.equal(dec035.length, 1);
  assert.equal(dec035[0].id, 'katha');
  assert.equal(dec035[0].value, 7);

  const raw035 = decomposeRaw(0.35 * 14400, ['bigha', 'katha', 'chotak'], factors);
  assert.equal(raw035[1].value, 7, 'Katha must be 7, not 6');
  assert.equal(raw035[2].value, 0, 'Chotak must be 0, not 15.99');
}

// 8. Number Formatting & Copy
{
  console.log('Test 8: Display Formatting & Clean Copy');
  assert.equal(formatAreaNumber(1000, true), '১,০০০');
  assert.equal(formatAreaNumber(1000, false), '1,000');
  assert.equal(formatAreaNumber(0.000025, false), '2.5e-5');
  assert.equal(getCleanCopyValue(12.3456789123), '12.34567891');
}

console.log('--- All 8 Test Suites Passed Successfully! ---');
