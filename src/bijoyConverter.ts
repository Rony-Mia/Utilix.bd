/**
 * Bijoy (SutonnyMJ / ANSI) to Unicode & Unicode to Bijoy conversion utilities.
 * Utools.bd - Browser-side processing engine.
 */

export const CONVERSION_MAP: Record<string, string> = {
  "°": "ক্ক", "±": "ক্ট", "²": "ক্ষ্ণ", "³": "ক্ত", "´": "ক্ম", "µ": "ক্র", "¶": "ক্ষ", "·": "ক্স",
  "¸": "গু", "¹": "জ্ঞ", "º": "গ্দ", "»": "গ্ধ", "¼": "ঙ্ক", "½": "ঙ্গ", "¾": "জ্জ", "¿": "্ত্র",
  "À": "জ্ঝ", "Á": "জ্ঞ", "Â": "ঞ্চ", "Ã": "ঞ্ছ", "Ä": "ঞ্জ", "Å": "ঞ্ঝ", "Æ": "ট্ট", "Ç": "ড্ড",
  "È": "ণ্ট", "É": "ণ্ঠ", "Ê": "ণ্ড", "Ë": "ত্ত", "Ì": "ত্থ", "Î": "ত্র", "Ï": "দ্দ", "Ð": "ণ্ড",
  "Ñ": "-", "Ò": "\"", "Ó": "\"", "Ô": "'", "Õ": "'", "×": "দ্ধ", "Ø": "দ্ব", "Ù": "দ্ম", "Ú": "ন্ঠ",
  "Û": "ন্ড", "Ü": "ন্ধ", "Ý": "ন্স", "Þ": "প্ট", "ß": "প্ত", "à": "প্প", "á": "প্স", "â": "ব্জ",
  "ã": "ব্দ", "ä": "ব্ধ", "å": "ভ্র", "ç": "ম্ফ", "é": "ল্ক", "ê": "ল্গ", "ë": "ল্ট", "ì": "ল্ড",
  "í": "ল্প", "î": "ল্ফ", "ï": "শু", "ð": "শ্চ", "ñ": "শ্ছ", "ò": "ষ্ণ", "ó": "ষ্ট", "ô": "ষ্ঠ",
  "õ": "ষ্ফ", "ö": "স্খ", "÷": "স্ট", "ø": "স্ন", "ù": "স্ফ", "û": "হু", "ü": "হৃ", "ý": "হ্ন",
  "ÿ": "ক্ষ", "þ": "হ্ম",
  "A": "অ", "B": "ই", "C": "ঈ", "D": "উ", "E": "ঊ", "F": "ঋ", "G": "এ", "H": "ঐ", "I": "ও", "J": "ঔ",
  "K": "ক", "L": "খ", "M": "গ", "N": "ঘ", "O": "ঙ", "P": "চ", "Q": "ছ", "R": "জ", "S": "ঝ", "T": "ঞ",
  "U": "ট", "V": "ঠ", "W": "ড", "X": "ঢ", "Y": "ণ", "Z": "ত", "_": "থ", "`": "দ", "a": "ধ", "b": "ন",
  "c": "প", "d": "ফ", "e": "ব", "f": "ভ", "g": "ম", "h": "য", "i": "র", "j": "ল", "k": "শ", "l": "ষ",
  "m": "স", "n": "হ", "o": "ড়", "p": "ঢ়", "q": "য়", "r": "ৎ", "s": "ং", "t": "ঃ", "u": "ঁ",
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  "•": "ঙ্", "|": "।"
};

export const PRE_SYMBOLS_MAP: Record<string, string> = {
  "®": "ষ্", "¯": "স্", "”": "চ্", "˜": "দ্", "™": "দ্", "š": "ন্", "›": "ন্", "¤": "ম্"
};

export const REFF: Record<string, string> = { "©": "র্" };

export const POST_SYMBOLS_MAP: Record<string, string> = {
  "&": "্", "ú": "্প", "è": "্ন", "^": "্ব", "‘": "্তু", "’": "্থ", "‹": "্ক", "Œ": "্ক্র", "—": "্ত",
  "Í": "্ত", "œ": "্ন", "Ÿ": "্ব", "¡": "্ব", "¢": "্ভ", "£": "্ভ্র", "¥": "্ম", "¦": "্ব", "§": "্ম",
  "¨": "্য", "ª": "্র", "«": "্র", "¬": "্ল", "Ö": "্র"
};

export const KAARS: Record<string, string> = {
  "v": "া", "w": "ি", "x": "ী", "y": "ু", "z": "ু", "æ": "ু", "“": "ু", "–": "ু", "~": "ূ", "ƒ": "ূ",
  "‚": "ূ", "„": "ৃ", "…": "ৃ", "†": "ে", "‡": "ে", "ˆ": "ৈ", "‰": "ৈ", "Š": "ৗ"
};

export const KAAR_POST_CONVERSION: Record<string, string> = {
  "ো": "ো",
  "ৌ": "ৌ",
  "ো": "ো",
  "ৌ": "ৌ"
};

export const POST_CONVERSION_MAP: Record<string, string> = {
  "অা": "আ",
  "্্": "্",
  "ো": "ো",
  "ৌ": "ৌ"
};

export const PRE_CONVERSION_MAP: Record<string, string> = {
  " +": " ", "yy": "y", "vv": "v", "„„": "„", "y&": "y", "„&": "„", "‡u": "u‡", "wu": "uw",
  " ,": ",", " \\|": "\\|", "\\\\ ": "", " \\\\": "", "\\\\": "", "\n +": "\n", " +\n": "\n",
  "\n\n\n\n\n": "\n\n", "\n\n\n\n": "\n\n", "\n\n\n": "\n\n"
};

export const POST_PHALAS_MAP: Record<string, string> = { ...POST_SYMBOLS_MAP };
delete POST_PHALAS_MAP["&"];

export const ALL_SYMBOLS: Record<string, string> = Object.assign({}, CONVERSION_MAP, PRE_SYMBOLS_MAP, POST_SYMBOLS_MAP);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pattern(symbols: Record<string, string>, delim?: string): string {
  delim = delim || "";
  return Object.keys(symbols).filter(k => k.length > 0).map(escapeRegExp).join(delim);
}

const SYMBOLS_CONVERSION_PATTERN = new RegExp("([" + pattern(ALL_SYMBOLS) + "])", "g");

// Base consonant sub-unit:
// Allows pre-symbols (e.g. ®, ¯, ”), base consonant/ligature, and attached phalas (excluding hasanta &)
const C_BASE_PATTERN = "(?:[" + pattern(PRE_SYMBOLS_MAP) + "]*[" +
  pattern(CONVERSION_MAP) + pattern(PRE_SYMBOLS_MAP) + "][" +
  pattern(POST_PHALAS_MAP) + "]*)";

// Conjunct cluster:
// Captures full hasanta-joined conjuncts (consonant1 + hasanta + consonant2 + ...) as ONE unit
// so preKaar (ি, ে, ৈ) attaches AFTER the entire conjunct cluster (e.g. n†P&Q -> হচ্ছে, cvwP&Q -> পাচ্ছি)
const CONJUNCT_CLUSTER_PATTERN = "(?:" +
  C_BASE_PATTERN + "(?:&+" + C_BASE_PATTERN + ")*&*(?:[" + pattern(POST_PHALAS_MAP) + "])*" +
  "|[" + pattern(PRE_SYMBOLS_MAP) + "]+[" + pattern(POST_PHALAS_MAP) + "]*" +
  "|[" + pattern(POST_SYMBOLS_MAP) + "]+" +
  ")";

const MAIN_CONVERSION_PATTERN = new RegExp(
  "([w\u2020\u2021\u02C6\u2030\u0160]?)(" + CONJUNCT_CLUSTER_PATTERN + ")([" +
  pattern(REFF) + "])?([\u00E6vxyz\u201C\u2013~\u0192\u201A\u201E\u2026]?)([" +
  pattern(POST_SYMBOLS_MAP) + "])*", "g"
);

const HASAANT_PATTERN = new RegExp("(্)+", "g");
const PRE_CONVERSION_PATTERN = new RegExp("(" + pattern(PRE_CONVERSION_MAP, "|") + ")", "g");
const POST_CONVERSION_PATTERN = new RegExp("(" + pattern(POST_CONVERSION_MAP, "|") + ")", "g");

/**
 * Common English words often appearing in Bangladeshi business, government,
 * education, or technical mixed-language documents that should pass through untouched.
 */
export const COMMON_ENGLISH_WORDS = new Set([
  "the", "and", "of", "for", "in", "to", "with", "at", "by", "from", "on", "into", "over",
  "price", "rate", "lead", "cutting", "down", "project", "protection", "management",
  "field", "representatives", "representative", "manager", "officer", "executive",
  "assistant", "director", "coordinator", "supervisor", "specialist", "consultant",
  "division", "department", "section", "unit", "branch", "office", "zone", "region",
  "total", "net", "gross", "amount", "taka", "date", "time", "year", "month", "day",
  "name", "address", "phone", "mobile", "email", "mail", "web", "website",
  "bill", "invoice", "receipt", "voucher", "account", "bank", "cheque", "cash",
  "report", "summary", "status", "active", "pending", "approved", "rejected",
  "service", "services", "system", "systems", "software", "hardware", "network",
  "national", "international", "ltd", "limited", "pvt", "corp", "corporation",
  "company", "group", "holdings", "enterprise", "enterprises", "associates",
  "school", "college", "university", "institute", "center", "centre", "academy",
  "board", "grade", "class", "roll", "registration", "session", "result", "gpa", "cgpa",
  "page", "pages", "no", "number", "serial", "item", "items", "qty", "quantity",
  "note", "notes", "remark", "remarks", "signature", "signed", "verified", "checked",
  "male", "female", "gender", "age", "dob", "nid", "bcs", "ssc", "hsc", "jsc", "psc",
  "tso", "ceo", "coo", "cto", "cfo", "hrm", "it", "hr", "admin", "iso"
]);

/**
 * Common 2-letter English acronyms that frequently appear in mixed documents.
 */
export const COMMON_2_LETTER_ACRONYMS = new Set([
  "AM", "PM", "IT", "HR", "CV", "ID", "AI", "PR", "MD", "PO", "TO", "DO",
  "LC", "QC", "QA", "IP", "UI", "UX", "TV", "FM", "AC", "DC", "PC", "OK",
  "EU", "UN", "US", "UK", "HQ", "BD"
]);

/**
 * Common 2-letter uppercase Bijoy combinations that form real Bengali words
 * and should NOT be treated as English acronyms.
 * e.g. GB = এই, KZ = কত, MZ = গত.
 */
const BIJOY_2_LETTER_WORDS = new Set([
  "GB", // এই
  "KZ", // কত
  "MZ", // গত
  "BZ", // ইত
  "DZ", // উত
  "AZ", // অত
]);

/**
 * Plain ASCII punctuation allow-list that should be safely preserved.
 */
export const PUNCTUATION_ALLOW_LIST = new Set(["-", ",", ".", "'", "\"", "/"]);

/**
 * Checks if enclosed content represents genuine Latin/English text that should pass through untouched.
 */
function isBracketedEnglish(inner: string): boolean {
  const trimmed = inner.trim();
  if (!trimmed) return false;

  // Single Bijoy bullet markers like (K)=(ক), (L)=(খ), (M)=(গ), (N)=(ঘ) or (1)=(১)
  if (trimmed.length === 1 && /[0-9KLMNOklmno]/.test(trimmed)) {
    return false;
  }

  // Must consist solely of printable ASCII characters
  if (!/^[\x20-\x7E]+$/.test(inner)) {
    return false;
  }

  // Must contain at least one Latin letter
  if (!/[A-Za-z]/.test(inner)) {
    return false;
  }

  return true;
}

// Private Use Area Unicode offset for safe token placeholders
const PUA_START = 0xE000;

/**
 * Pre-processing heuristic pass that protects genuine English content (bracketed phrases,
 * ALL-CAPS acronyms, common mixed English words) and plain punctuation before Bijoy conversion.
 */
function protectEnglishAndPunctuation(text: string): { protectedText: string; tokens: string[] } {
  const tokens: string[] = [];

  const saveToken = (str: string): string => {
    const placeholder = String.fromCharCode(PUA_START + tokens.length);
    tokens.push(str);
    return placeholder;
  };

  // 1. Bracketed or quoted Latin/English text: (...), [...], {...}, "...", '...'
  let current = text.replace(/(\([^\(\)]*\)|\[[^\[\]]*\]|\{[^\{\}]*\}|"[^"]*"|'[^']*')/g, (match) => {
    const open = match[0];
    const close = match[match.length - 1];
    const inner = match.slice(1, -1);

    if (isBracketedEnglish(inner)) {
      return saveToken(open + inner + close);
    }
    return match;
  });

  // 2. Web domains or emails (e.g. Utools.bd, info@utools.bd)
  current = current.replace(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g, (match) => {
    return saveToken(match);
  });
  current = current.replace(/\b([A-Za-z0-9-]+\.[A-Za-z]{2,})\b/g, (match) => {
    return saveToken(match);
  });

  // 3. Outside brackets: Match word-like tokens and check for:
  // - 3+ letter ALL CAPS acronyms (e.g. TSO, NID, CEO, BPSC, HSC)
  // - Verified 2-letter ALL CAPS acronyms (e.g. AM, PM, IT, HR)
  // - Known common English words (case-insensitively, e.g. project, total, price, rate)
  current = current.replace(/\b([A-Za-z][A-Za-z0-9\-_/.]*)\b/g, (match, word) => {
    // 3+ letters ALL CAPS (e.g. TSO, NID, CEO, BPSC, HSC) -> always English acronym
    if (/^[A-Z]{3,}$/.test(word)) {
      return saveToken(match);
    }

    // 2-letter ALL CAPS: check if it is a known English acronym and not a Bijoy word (like GB=এই, KZ=কত)
    if (/^[A-Z]{2}$/.test(word)) {
      if (COMMON_2_LETTER_ACRONYMS.has(word) && !BIJOY_2_LETTER_WORDS.has(word)) {
        return saveToken(match);
      }
      return match;
    }

    // Check against common English words list
    const cleanWord = word.toLowerCase();
    if (COMMON_ENGLISH_WORDS.has(cleanWord) && !BIJOY_2_LETTER_WORDS.has(word)) {
      return saveToken(match);
    }

    return match;
  });

  return { protectedText: current, tokens };
}

function restoreProtectedTokens(text: string, tokens: string[]): string {
  if (tokens.length === 0) return text;
  return text.replace(/[\uE000-\uF8FF]/g, (ch) => {
    const idx = ch.charCodeAt(0) - PUA_START;
    return tokens[idx] !== undefined ? tokens[idx] : ch;
  });
}

function replaceSymbol(m: string): string {
  return ALL_SYMBOLS[m] || "";
}

function mainConverter(
  _match: string,
  preKaar: string,
  mUnit: string,
  reff: string,
  postKaar: string,
  postPhala: string
): string {
  let core = mUnit.replace(SYMBOLS_CONVERSION_PATTERN, replaceSymbol);
  core = core.replace(HASAANT_PATTERN, () => "্");
  core = reff ? "র্" + core : core;
  core = postPhala ? core + (POST_SYMBOLS_MAP[postPhala] || "") : core;
  const kaarString = (preKaar ? (KAARS[preKaar] || "") : "") + (postKaar ? (KAARS[postKaar] || "") : "");
  core = core + (KAAR_POST_CONVERSION[kaarString] || kaarString);
  return core;
}

/**
 * Converts Bijoy / SutonnyMJ ANSI text to Bengali Unicode.
 */
export function bijoyToUnicode(str: string): string {
  if (!str) return "";

  // Pre-processing heuristic pass for English terms, acronyms, and bracketed content
  const { protectedText, tokens } = protectEnglishAndPunctuation(str);

  let t = protectedText.replace(PRE_CONVERSION_PATTERN, (m) => PRE_CONVERSION_MAP[m] || m);
  t = t.replace(MAIN_CONVERSION_PATTERN, mainConverter);
  t = t.replace(POST_CONVERSION_PATTERN, (m) => POST_CONVERSION_MAP[m] || m);

  // Restore protected tokens
  return restoreProtectedTokens(t, tokens);
}

// Reverse mapping dictionary (Unicode -> Bijoy ANSI)
const UNICODE_TO_BIJOY_MAP: Record<string, string> = {};

// Build reverse dictionary prioritizing conjuncts first then single chars
Object.entries(CONVERSION_MAP).forEach(([bijoy, unicode]) => {
  if (!UNICODE_TO_BIJOY_MAP[unicode]) {
    UNICODE_TO_BIJOY_MAP[unicode] = bijoy;
  }
});

// Explicit common conjunct/phala overrides
UNICODE_TO_BIJOY_MAP["্র"] = "Ö";
UNICODE_TO_BIJOY_MAP["্য"] = "¨";

// Pre-sort multi-character conjuncts by descending string length
const SORTED_CONJUNCTS = Object.keys(UNICODE_TO_BIJOY_MAP)
  .filter((k) => k.length > 1)
  .sort((a, b) => b.length - a.length);

const UNICODE_VOWELS: Record<string, string> = {
  "অ": "A", "আ": "Av", "ই": "B", "ঈ": "C", "উ": "D", "ঊ": "E",
  "ঋ": "F", "এ": "G", "ঐ": "H", "ও": "I", "ঔ": "J"
};

const UNICODE_CONSONANTS: Record<string, string> = {
  "ক": "K", "খ": "L", "গ": "M", "ঘ": "N", "ঙ": "O", "চ": "P",
  "ছ": "Q", "জ": "R", "ঝ": "S", "ঞ": "T", "ট": "U", "ঠ": "V",
  "ড": "W", "ঢ": "X", "ণ": "Y", "ত": "Z", "থ": "_", "দ": "`",
  "ধ": "a", "ন": "b", "প": "c", "ফ": "d", "ব": "e", "ভ": "f",
  "ম": "g", "য": "h", "র": "i", "ল": "j", "শ": "k", "ষ": "l",
  "স": "m", "হ": "n", "ড়": "o", "ঢ়": "p", "য়": "q", "ৎ": "r",
  "ং": "s", "ঃ": "t", "ঁ": "u"
};

const UNICODE_DIGITS: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9", "।": "|"
};

/**
 * High-accuracy reverse conversion (Unicode -> Bijoy ANSI / SutonnyMJ).
 * Accurately places pre-kaars (ি, ে, ৈ, ো, ৌ) before consonant clusters,
 * handles conjuncts, Reff (র্), and links hasanta (্) to SutonnyMJ '&'.
 */
export function unicodeToBijoy(str: string): string {
  if (!str) return "";

  let result = "";
  const chars = Array.from(str);
  let i = 0;

  while (i < chars.length) {
    // 1. Check for Reff (র্ = \u09B0\u09CD)
    let hasReph = false;
    if (chars[i] === "র" && chars[i + 1] === "্") {
      if (
        i + 2 < chars.length &&
        (UNICODE_CONSONANTS[chars[i + 2]] || UNICODE_TO_BIJOY_MAP[chars[i + 2]])
      ) {
        hasReph = true;
        i += 2;
      }
    }

    // 2. Consume consonant / conjunct cluster
    let cluster = "";
    let matchedCluster = false;

    // Check multi-character conjunct in SORTED_CONJUNCTS
    for (const conjKey of SORTED_CONJUNCTS) {
      const sub = chars.slice(i, i + conjKey.length).join("");
      if (sub === conjKey) {
        cluster = UNICODE_TO_BIJOY_MAP[conjKey];
        i += conjKey.length;
        matchedCluster = true;
        break;
      }
    }

    if (!matchedCluster) {
      const char = chars[i];
      if (UNICODE_CONSONANTS[char]) {
        cluster = UNICODE_CONSONANTS[char];
        i++;

        // Consume any following hasanta + consonant/phala
        while (i + 1 < chars.length && chars[i] === "্") {
          const next = chars[i + 1];
          if (next === "য") {
            cluster += "¨"; // ya-phala
            i += 2;
          } else if (next === "র") {
            cluster += "Ö"; // ra-phala
            i += 2;
          } else if (next === "ব") {
            cluster += "^"; // ba-phala
            i += 2;
          } else if (next === "ম") {
            cluster += "§"; // ma-phala
            i += 2;
          } else if (UNICODE_CONSONANTS[next]) {
            // Check if remainder matches a known conjunct
            let subConj = false;
            for (const conjKey of SORTED_CONJUNCTS) {
              const sub = chars.slice(i + 1, i + 1 + conjKey.length).join("");
              if (sub === conjKey) {
                cluster += "&" + UNICODE_TO_BIJOY_MAP[conjKey];
                i += 1 + conjKey.length;
                subConj = true;
                break;
              }
            }
            if (!subConj) {
              cluster += "&" + UNICODE_CONSONANTS[next];
              i += 2;
            }
          } else {
            break;
          }
        }
        matchedCluster = true;
      }
    }

    if (matchedCluster) {
      const rephPart = hasReph ? "©" : "";
      const nextChar = chars[i];

      // Handle pre-kaars (ি, ে, ৈ) and split-kaars (ো, ৌ)
      if (nextChar === "ি") {
        result += "w" + cluster + rephPart;
        i++;
      } else if (nextChar === "ে") {
        result += "†" + cluster + rephPart;
        i++;
      } else if (nextChar === "ৈ") {
        result += "ˆ" + cluster + rephPart;
        i++;
      } else if (nextChar === "ো") {
        result += "†" + cluster + rephPart + "v";
        i++;
      } else if (nextChar === "ৌ") {
        result += "†" + cluster + rephPart + "Š";
        i++;
      } else if (nextChar === "া") {
        result += cluster + rephPart + "v";
        i++;
      } else if (nextChar === "ী") {
        result += cluster + rephPart + "x";
        i++;
      } else if (nextChar === "ু") {
        result += cluster + rephPart + "y";
        i++;
      } else if (nextChar === "ূ") {
        result += cluster + rephPart + "~";
        i++;
      } else if (nextChar === "ৃ") {
        result += cluster + rephPart + "„";
        i++;
      } else {
        result += cluster + rephPart;
      }
      continue;
    }

    // Standalone reph without following cluster
    if (hasReph) {
      result += "i&";
    }

    const char = chars[i];
    if (UNICODE_VOWELS[char]) {
      result += UNICODE_VOWELS[char];
    } else if (UNICODE_DIGITS[char]) {
      result += UNICODE_DIGITS[char];
    } else if (char === "্") {
      result += "&";
    } else if (char === "া") {
      result += "v";
    } else if (char === "ী") {
      result += "x";
    } else if (char === "ু") {
      result += "y";
    } else if (char === "ূ") {
      result += "~";
    } else if (char === "ৃ") {
      result += "„";
    } else if (char === "ে") {
      result += "†";
    } else if (char === "ৈ") {
      result += "ˆ";
    } else if (char === "ো") {
      result += "†v";
    } else if (char === "ৌ") {
      result += "†Š";
    } else {
      result += char;
    }
    i++;
  }

  return result;
}

/** Sample text for quick testing and demonstrations */
export const SAMPLE_BIJOY_TEXT = "Avgvi †mvbvi evsjv, Avwg †Zvgvq fv‡jvevwm|";
export const SAMPLE_UNICODE_TEXT = "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।";
