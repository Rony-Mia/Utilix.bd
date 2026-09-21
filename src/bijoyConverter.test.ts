/**
 * Test suite for Bijoy to Unicode conversion utilities.
 * Utools.bd - Verifying BUG 1 (Kar/hasanta conjunct reordering) and BUG 2 (English/Latin pass-through).
 */

import { bijoyToUnicode } from "./bijoyConverter";

interface TestCase {
  name: string;
  input: string;
  expected: string;
  description?: string;
}

export const TEST_CASES: TestCase[] = [
  // --- BUG 1 TEST CASES: Kar/hasanta conjunct reordering ---
  {
    name: "হচ্ছে (hocche)",
    input: "n†P&Q",
    expected: "হচ্ছে",
    description: "e-kar (†) with hasanta-joined চ্ছ (P&Q) cluster must not produce হচ্েছ"
  },
  {
    name: "যাচ্ছে (jacche)",
    input: "hv†P&Q",
    expected: "যাচ্ছে",
    description: "e-kar (†) with hasanta-joined চ্ছ (P&Q) cluster after ja-a (hv)"
  },
  {
    name: "পাচ্ছি (pacchi)",
    input: "cvwP&Q",
    expected: "পাচ্ছি",
    description: "i-kar (w) preceding hasanta-joined চ্ছ (P&Q) cluster must place i-kar after the cluster"
  },
  {
    name: "বাচ্চা (baccha - hasanta form)",
    input: "evP&Pv",
    expected: "বাচ্চা",
    description: "consonant + hasanta + consonant + a-kar (ev + P + & + P + v)"
  },
  {
    name: "বাচ্চা (baccha - ligature form)",
    input: "ev”Pv",
    expected: "বাচ্চা",
    description: "consonant + pre-symbol ligature + a-kar"
  },
  {
    name: "সচ্ছল (sacchal)",
    input: "mP&Qj",
    expected: "সচ্ছল",
    description: "sa (m) + চ্ছ conjunct (P&Q) + la (j)"
  },
  {
    name: "নিষ্ক্রিয় (nishkriyo - symbol ligature)",
    input: "wbw®Œq",
    expected: "নিষ্ক্রিয়",
    description: "ni (wb) + i-kar (w) + ষ্ক্র (®Œ) + yo (q)"
  },
  {
    name: "নিষ্ক্রিয় (nishkriyo - hasanta cluster)",
    input: "wbwl&KÖq",
    expected: "নিষ্ক্রিয়",
    description: "ni (wb) + i-kar (w) + sh (l) + hasanta (&) + kra (KÖ) + yo (q)"
  },
  {
    name: "আনন্দ (ananda - conjunct nda)",
    input: "Avb›`",
    expected: "আনন্দ",
    description: "a (Av) + na (b) + nda (›`) conjunct"
  },
  {
    name: "লজ্জা (lajja - conjunct jja)",
    input: "j¾v",
    expected: "লজ্জা",
    description: "la (j) + jja (¾) + a-kar (v)"
  },

  // --- BUG 2 TEST CASES: English, brackets, acronyms & punctuation pass-through ---
  {
    name: "Verified test case: Bracketed English term",
    input: "GB c‡`i Rb¨ (Field Representatives/TSO) cÖ‡qvRb|",
    expected: "এই পদের জন্য (Field Representatives/TSO) প্রয়োজন।",
    description: "Bracketed English phrase must remain completely unchanged"
  },
  {
    name: "ALL CAPS acronyms in text",
    input: "Avgv‡`i TSO Ges CEO Gi NID cÖ‡qvRb|",
    expected: "আমাদের TSO এবং CEO এর NID প্রয়োজন।",
    description: "All-caps acronyms TSO, CEO, NID must not convert into garbled Bangla glyphs"
  },
  {
    name: "Bracketed square brackets and mixed punctuation",
    input: "‡fvUvi ZvwjKv [Section 4.2: Dhaka-1200] cwi`k©b|",
    expected: "ভোটার তালিকা [Section 4.2: Dhaka-1200] পরিদর্শন।",
    description: "Square brackets containing English words, numbers, punctuation preserved"
  },
  {
    name: "Curly braces English tag",
    input: "cÖKí †KvW {ISO 9001:2015} Aby‡gv`b|",
    expected: "প্রকল্প কোড {ISO 9001:2015} অনুমোদন।",
    description: "Curly braces tag preserved"
  },
  {
    name: "Common mixed English words in business context",
    input: "GB project Gi total price I rate KZ?",
    expected: "এই project এর total price ও rate কত?",
    description: "Common English words 'project', 'total', 'price', 'rate' kept intact"
  },
  {
    name: "Plain ASCII punctuation pass-through",
    input: "Avgiv cÖwZw`b 9:00 AM - 5:00 PM, †mvgevi/g½jevi KvR Kwi.",
    expected: "আমরা প্রতিদিন ৯:০০ AM - ৫:০০ PM, সোমবার/মঙ্গলবার কাজ করি.",
    description: "Hyphens (-), commas (,), colons (:), slashes (/) and dots (.) preserved"
  },
  {
    name: "Straight quotes with Bangla text",
    input: "\"Avgvi †mvbvi evsjv\" I 'Utools.bd' c¬¨vUdg©",
    expected: "\"আমার সোনার বাংলা\" ও 'Utools.bd' প্ল্যাটফর্ম",
    description: "Straight quotes preserved around Bangla & English text"
  },
  {
    name: "Bijoy single-letter list bullet conversion",
    input: "(K) cÖ_g kZ©, (L) wØZxq kZ©|",
    expected: "(ক) প্রথম শর্ত, (খ) দ্বিতীয় শর্ত।",
    description: "Single Bijoy letters (K), (L) inside brackets convert to (ক), (খ) as list items"
  }
];

export function runTests(): { total: number; passed: number; failed: number; results: Array<{ name: string; pass: boolean; expected: string; actual: string }> } {
  let passed = 0;
  let failed = 0;
  const results: Array<{ name: string; pass: boolean; expected: string; actual: string }> = [];

  for (const tc of TEST_CASES) {
    const actual = bijoyToUnicode(tc.input);
    const pass = actual === tc.expected;
    if (pass) {
      passed++;
    } else {
      failed++;
    }
    results.push({
      name: tc.name,
      pass,
      expected: tc.expected,
      actual
    });
  }

  return { total: TEST_CASES.length, passed, failed, results };
}
