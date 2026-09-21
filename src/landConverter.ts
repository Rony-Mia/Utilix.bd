import { banglaToAsciiDigits, toBanglaDigits } from './amountToWords.ts';

export type KaniBasis = 'nol8' | 'shotok40';
export type BighaBasis = 'sqft14400' | 'shotok33';

export const KANI_SQFT: Record<KaniBasis, number> = {
  nol8: 17280,
  shotok40: 17424,
};

export const BIGHA_SQFT: Record<BighaBasis, number> = {
  sqft14400: 14400,
  shotok33: 14374.8,
};

export type UnitKind = 'exact' | 'standard' | 'derived';

export type UnitGroup =
  | 'acre_shotok'
  | 'bigha_katha'
  | 'kani_gonda'
  | 'metric'
  | 'general';

export interface LandUnit {
  id: string;
  bn: string;
  en: string;
  group: UnitGroup;
  kind: UnitKind;
}

export const UNIT_GROUP_LABELS: Record<UnitGroup, { bn: string; en: string }> = {
  acre_shotok: { bn: 'একর ও শতক', en: 'Acre & Decimal' },
  bigha_katha: { bn: 'বিঘা ও কাঠা', en: 'Bigha & Katha' },
  kani_gonda: { bn: 'কানি ও গণ্ডা', en: 'Kani & Gonda' },
  metric: { bn: 'মেট্রিক একক', en: 'Metric Units' },
  general: { bn: 'সাধারণ ও জরিপ একক', en: 'General & Survey Units' },
};

export const UNITS: LandUnit[] = [
  // একর ও শতক
  { id: 'acre', bn: 'একর', en: 'Acre', group: 'acre_shotok', kind: 'exact' },
  { id: 'shotok', bn: 'শতক / শতাংশ / ডেসিমেল', en: 'Shotok / Decimal', group: 'acre_shotok', kind: 'standard' },
  { id: 'ojutangsho', bn: 'অযুতাংশ', en: 'Ojutangsho', group: 'acre_shotok', kind: 'standard' },

  // বিঘা ও কাঠা (standard + derived)
  { id: 'bigha', bn: 'বিঘা', en: 'Bigha', group: 'bigha_katha', kind: 'standard' },
  { id: 'katha', bn: 'কাঠা', en: 'Katha (Kattah)', group: 'bigha_katha', kind: 'standard' },
  { id: 'chotak', bn: 'ছটাক', en: 'Chotak', group: 'bigha_katha', kind: 'standard' },
  { id: 'gonda_chotak', bn: 'গণ্ডা (ছটাকের)', en: 'Gonda (of Chotak)', group: 'bigha_katha', kind: 'derived' },
  { id: 'kora_chotak', bn: 'কড়া (ছটাকের)', en: 'Kora (of Chotak)', group: 'bigha_katha', kind: 'derived' },
  { id: 'kak', bn: 'কাক', en: 'Kak', group: 'bigha_katha', kind: 'derived' },

  // কানি ও গণ্ডা (standard + derived)
  { id: 'kani', bn: 'কানি', en: 'Kani', group: 'kani_gonda', kind: 'standard' },
  { id: 'gonda_kani', bn: 'গণ্ডা (কানির)', en: 'Gonda (of Kani)', group: 'kani_gonda', kind: 'standard' },
  { id: 'kora_kani', bn: 'কড়া (কানির)', en: 'Kora (of Kani)', group: 'kani_gonda', kind: 'standard' },
  { id: 'kranti', bn: 'ক্রান্তি (কন্ঠ)', en: 'Kranti', group: 'kani_gonda', kind: 'standard' },
  { id: 'til', bn: 'তিল', en: 'Til', group: 'kani_gonda', kind: 'standard' },
  { id: 'dondho', bn: 'দণ্ড', en: 'Dondho', group: 'kani_gonda', kind: 'derived' },
  { id: 'dhul', bn: 'ধুল', en: 'Dhul', group: 'kani_gonda', kind: 'derived' },
  { id: 'renu', bn: 'রেণু', en: 'Renu', group: 'kani_gonda', kind: 'derived' },

  // মেট্রিক
  { id: 'hectare', bn: 'হেক্টর', en: 'Hectare', group: 'metric', kind: 'exact' },
  { id: 'are', bn: 'আর', en: 'Are', group: 'metric', kind: 'exact' },

  // সাধারণ ও জরিপ
  { id: 'sqft', bn: 'বর্গফুট', en: 'Square Feet (sq ft)', group: 'general', kind: 'exact' },
  { id: 'sqyd', bn: 'বর্গগজ', en: 'Square Yard (sq yd)', group: 'general', kind: 'exact' },
  { id: 'sqm', bn: 'বর্গমিটার', en: 'Square Meter (sq m)', group: 'general', kind: 'exact' },
  { id: 'sqhat', bn: 'বর্গহাত', en: 'Square Hat (sq hat)', group: 'general', kind: 'standard' },
  { id: 'sqlink', bn: 'বর্গলিংক', en: 'Square Link (sq link)', group: 'general', kind: 'standard' },
  { id: 'sqchain', bn: 'বর্গচেইন (গান্টার্স)', en: 'Square Chain (sq chain)', group: 'general', kind: 'standard' },
  { id: 'bargonol', bn: 'বর্গনল', en: 'Bargo Nol', group: 'general', kind: 'standard' },
];

export function getFactors(
  kani: KaniBasis = 'nol8',
  bigha: BighaBasis = 'sqft14400'
): Record<string, number> {
  const bighaSqft = BIGHA_SQFT[bigha];
  const kathaSqft = bighaSqft / 20;
  const chotakSqft = kathaSqft / 16;
  const gondaChotakSqft = chotakSqft / 20;
  const koraChotakSqft = gondaChotakSqft / 4;
  const kakSqft = koraChotakSqft / 4;

  const kaniSqft = KANI_SQFT[kani];
  const gondaKaniSqft = kaniSqft / 20;
  const koraKaniSqft = kaniSqft / 80;
  const krantiSqft = kaniSqft / 240;
  const tilSqft = kaniSqft / 4800;
  const dondhoSqft = krantiSqft / 6;
  const dhulSqft = dondhoSqft / 7;
  const renuSqft = dhulSqft / 30;

  return {
    // সাধারণ
    sqft: 1,
    sqyd: 9,
    sqm: 1 / 0.09290304,
    sqhat: 2.25,
    sqlink: 0.4356,
    sqchain: 4356,
    bargonol: 144,

    // একর ও শতক
    acre: 43560,
    shotok: 435.6,
    ojutangsho: 4.356,

    // মেট্রিক
    hectare: 10000 / 0.09290304,
    are: 100 / 0.09290304,

    // বিঘা ও কাঠা
    bigha: bighaSqft,
    katha: kathaSqft,
    chotak: chotakSqft,
    gonda_chotak: gondaChotakSqft,
    kora_chotak: koraChotakSqft,
    kak: kakSqft,

    // কানি ও গণ্ডা
    kani: kaniSqft,
    gonda_kani: gondaKaniSqft,
    kora_kani: koraKaniSqft,
    kranti: krantiSqft,
    til: tilSqft,
    dondho: dondhoSqft,
    dhul: dhulSqft,
    renu: renuSqft,
  };
}

export function convertLand(
  value: number,
  fromId: string,
  toId: string,
  factors: Record<string, number>
): number {
  if (fromId === toId) return value;
  const fromFactor = factors[fromId];
  const toFactor = factors[toId];
  if (!fromFactor || !toFactor || !isFinite(value)) return 0;
  return (value * fromFactor) / toFactor;
}

export interface DecomposedPart {
  id: string;
  value: number;
}

export function decompose(
  sqft: number,
  ids: string[],
  factors: Record<string, number>
): DecomposedPart[] {
  if (!isFinite(sqft) || sqft <= 0) {
    return [{ id: ids[0], value: 0 }];
  }

  let rem = sqft;
  const rawParts: DecomposedPart[] = [];

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const f = factors[id];
    if (!f || f <= 0) continue;

    const isLast = i === ids.length - 1;
    if (!isLast) {
      const count = Math.floor(rem / f + 1e-9);
      rawParts.push({ id, value: count });
      rem = Math.max(0, rem - count * f);
    } else {
      // Last unit fractional (up to 3 decimal places)
      const rawVal = rem / f;
      const rounded = Math.round((rawVal + 1e-9) * 1000) / 1000;
      rawParts.push({ id, value: rounded });
      rem = 0;
    }
  }

  // Filter out zero parts: "শূন্য অংশ লুকাও, সব শূন্য হলে ০"
  const nonZero = rawParts.filter((p) => p.value > 0);
  if (nonZero.length === 0) {
    return [{ id: ids[0], value: 0 }];
  }
  return nonZero;
}

export function decomposeRaw(
  sqft: number,
  ids: string[],
  factors: Record<string, number>
): DecomposedPart[] {
  if (!isFinite(sqft) || sqft <= 0) {
    return ids.map((id) => ({ id, value: 0 }));
  }

  let rem = sqft;
  const rawParts: DecomposedPart[] = [];

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const f = factors[id];
    if (!f || f <= 0) {
      rawParts.push({ id, value: 0 });
      continue;
    }

    const isLast = i === ids.length - 1;
    if (!isLast) {
      const count = Math.floor(rem / f + 1e-9);
      rawParts.push({ id, value: count });
      rem = Math.max(0, rem - count * f);
    } else {
      const rawVal = rem / f;
      const rounded = Math.round((rawVal + 1e-9) * 1000) / 1000;
      rawParts.push({ id, value: rounded });
      rem = 0;
    }
  }
  return rawParts;
}

export function formatDecomposed(
  parts: DecomposedPart[],
  bnDigits = true
): string {
  if (!parts || parts.length === 0) return bnDigits ? '০' : '0';
  const nonZero = parts.filter((p) => p.value > 0);
  if (nonZero.length === 0) return bnDigits ? '০' : '0';

  return nonZero
    .map((p) => {
      const u = UNITS.find((unit) => unit.id === p.id);
      const label = bnDigits ? (u ? u.bn.split('/')[0].trim() : p.id) : (u ? u.en.split('/')[0].trim() : p.id);
      let s = p.value.toString();
      if (s.includes('.')) {
        s = Number(p.value.toFixed(3)).toString();
      }
      const numStr = bnDigits ? toBanglaDigits(s) : s;
      return `${numStr} ${label}`;
    })
    .join(' ');
}

export interface ParseResult {
  isValid: boolean;
  value: number;
  error: string | null;
}

export function parseAreaInput(raw: string): ParseResult {
  if (!raw || typeof raw !== 'string') {
    return { isValid: false, value: 0, error: 'জমির পরিমাণ লিখুন, যেমন ৫ বা ২.৫' };
  }

  const trimmed = raw.trim();
  if (trimmed === '') {
    return { isValid: false, value: 0, error: 'জমির পরিমাণ লিখুন, যেমন ৫ বা ২.৫' };
  }

  // Convert Bangla digits to ASCII
  const ascii = banglaToAsciiDigits(trimmed);

  // Check for negative sign
  if (ascii.includes('-')) {
    return { isValid: false, value: 0, error: 'জমির পরিমাণ ঋণাত্মক হতে পারে না' };
  }

  // Remove spaces and commas
  const cleaned = ascii.replace(/[\s,]/g, '');

  if (cleaned === '') {
    return { isValid: false, value: 0, error: 'জমির পরিমাণ লিখুন, যেমন ৫ বা ২.৫' };
  }

  // Check valid numeric characters (only digits and at most one dot)
  if (!/^\d*(\.\d*)?$/.test(cleaned) || cleaned === '.') {
    return { isValid: false, value: 0, error: 'সঠিক সংখ্যা প্রদান করুন (যেমন ৫ বা ২.৫)' };
  }

  const num = Number(cleaned);

  if (!isFinite(num) || isNaN(num)) {
    return { isValid: false, value: 0, error: 'সঠিক সংখ্যা প্রদান করুন' };
  }

  if (num < 0) {
    return { isValid: false, value: 0, error: 'জমির পরিমাণ ঋণাত্মক হতে পারে না' };
  }

  if (num > 1e12) {
    return {
      isValid: false,
      value: 0,
      error: 'জমির পরিমাণ অত্যন্ত বৃহৎ (সর্বোচ্চ ১,০০,০০,০০,০০,০০০)',
    };
  }

  return { isValid: true, value: num, error: null };
}

export function formatAreaNumber(
  value: number,
  bnDigits = true
): string {
  if (!isFinite(value)) return bnDigits ? '০' : '0';
  if (value === 0) return bnDigits ? '০' : '0';

  const absVal = Math.abs(value);

  // If smaller than 0.0001, use exponent form
  if (absVal < 0.0001) {
    let expStr = value.toExponential(4);
    // Remove trailing zeros in mantissa before 'e'
    expStr = expStr.replace(/(\.\d*?[1-9])0+e/, '$1e').replace(/\.0+e/, 'e');
    if (bnDigits) {
      return toBanglaDigits(expStr);
    }
    return expStr;
  }

  const maxDecimals = absVal >= 1000 ? 2 : 4;
  let fixed = value.toFixed(maxDecimals);

  // Remove trailing zeros after decimal point
  if (fixed.includes('.')) {
    fixed = fixed.replace(/\.?0+$/, '');
  }

  // Split integer and decimal parts
  const [intPart, decPart] = fixed.split('.');

  // Format integer part with commas (thousand grouping)
  const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = decPart !== undefined ? `${intWithCommas}.${decPart}` : intWithCommas;

  if (bnDigits) {
    return toBanglaDigits(formatted);
  }
  return formatted;
}

export function getCleanCopyValue(x: number): string {
  if (!isFinite(x)) return '0';
  return String(Number(x.toPrecision(10)));
}
