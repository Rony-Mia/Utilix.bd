import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { EducationItem } from '../../types.ts';

export const DEGREE_OPTIONS = [
  'এস.এস.সি / সমমান',
  'এইচ.এস.সি / সমমান',
  'এস.এস.সি (বিজ্ঞান)',
  'এস.এস.সি (ব্যবসায় শিক্ষা)',
  'এস.এস.সি (মানবিক)',
  'এইচ.এস.সি (বিজ্ঞান)',
  'এইচ.এস.সি (ব্যবসায় শিক্ষা)',
  'এইচ.এস.সি (মানবিক)',
  'দাখিল (মাদ্রাসা)',
  'আলিম (মাদ্রাসা)',
  'বি.এসসি (সম্মান)',
  'বি.এসসি ইঞ্জিনিয়ারিং',
  'বি.এ (সম্মান)',
  'বি.বি.এ (BBA)',
  'বি.এস.এস (সম্মান)',
  'বি.কম',
  'ডিপ্লোমা ইন ইঞ্জিনিয়ারিং',
  'এম.বি.এ (MBA)',
  'এম.এসসি',
  'এম.এ',
  'এম.এস.এস',
  'এলএল.বি (আইন)',
  'এম.বি.বি.এস',
  'ফাজিল / কামিল',
  'পিএইচ.ডি',
];

export const INSTITUTION_OPTIONS = [
  'ঢাকা বিশ্ববিদ্যালয়',
  'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)',
  'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়',
  'রাজশাহী বিশ্ববিদ্যালয়',
  'চট্টগ্রাম বিশ্ববিদ্যালয়',
  'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
  'খুলনা বিশ্ববিদ্যালয়',
  'বাংলাদেশ কৃষি বিশ্ববিদ্যালয়',
  'জগন্নাথ বিশ্ববিদ্যালয়',
  'জাতীয় বিশ্ববিদ্যালয়',
  'বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয়',
  'নর্থ সাউথ ইউনিভার্সিটি',
  'ব্র্যাক ইউনিভার্সিটি',
  'ইস্ট ওয়েস্ট ইউনিভার্সিটি',
  'আমেরিকান ইন্টারন্যাশনাল ইউনিভার্সিটি (AIUB)',
  'আহসানউল্লাহ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
  'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি',
  'ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)',
  'ঢাকা কলেজ',
  'সরকারি তিতুমীর কলেজ',
  'ইডেন মহিলা কলেজ',
  'সরকারি সিটি কলেজ',
  'ঢাকা সিটি কলেজ',
  'নটর ডেম কলেজ',
  'ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ',
  'রাজউক উত্তরা মডেল কলেজ',
  'ঢাকা রেসিডেনসিয়াল মডেল কলেজ',
  'চট্টগ্রাম কলেজ',
  'রাজশাহী কলেজ',
  'ময়মনসিংহ জিলা স্কুল',
  'সরকারি পলিটেকনিক ইনস্টিটিউট',
];

export const BOARD_MAJOR_OPTIONS = [
  'ঢাকা শিক্ষা বোর্ড',
  'চট্টগ্রাম শিক্ষা বোর্ড',
  'রাজশাহী শিক্ষা বোর্ড',
  'কুমিল্লা শিক্ষা বোর্ড',
  'যশোর শিক্ষা বোর্ড',
  'বরিশাল শিক্ষা বোর্ড',
  'সিলেট শিক্ষা বোর্ড',
  'দিনাজপুর শিক্ষা বোর্ড',
  'ময়মনসিংহ শিক্ষা বোর্ড',
  'মাদ্রাসা শিক্ষা বোর্ড',
  'কারিগরি শিক্ষা বোর্ড',
  'বিজ্ঞান বিভাগ',
  'ব্যবসায় শিক্ষা বিভাগ',
  'মানবিক বিভাগ',
  'কম্পিউটার সায়েন্স',
  'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)',
  'সফটওয়্যার ইঞ্জিনিয়ারিং',
  'ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং (EEE)',
  'মেকানিক্যাল ইঞ্জিনিয়ারিং',
  'সিভিল ইঞ্জিনিয়ারিং',
  'ব্যবসায় প্রশাসন (BBA)',
  'ফিন্যান্স অ্যান্ড ব্যাংকিং',
  'অ্যাকাউন্টিং অ্যান্ড ইনফরমেশন সিস্টেমস (AIS)',
  'মার্কেটিং',
  'ম্যানেজমেন্ট',
  'অর্থনীতি',
  'ইংরেজি',
  'বাংলা',
  'আইন ও বিচার',
  'পদার্থবিজ্ঞান',
  'রসায়ন',
  'গণিত',
  'পরিসংখ্যান',
];

export const PASSING_YEAR_OPTIONS = [
  '২০২৬',
  '২০২৫',
  '২০২৪',
  '২০২৩',
  '২০২২',
  '২০২১',
  '২০২০',
  '২০১৯',
  '২০১৮',
  '২০১৭',
  '২০১৬',
  '২০১৫',
  '২০১৪',
  '২০১৩',
  '২০১২',
  '২০১১',
  '২০১০',
  '২০০৯',
  '২০০৮',
  '২০০৭',
  '২০০৬',
  '২০০৫',
  '২০০০',
  '১৯৯৫',
  '১৯৯০',
  'অধ্যয়নরত / চলমান',
];

interface EducationItemEditorProps {
  edu: EducationItem;
  idx: number;
  onUpdate: (field: keyof EducationItem, value: string) => void;
  onRemove: () => void;
}

export const EducationItemEditor: React.FC<EducationItemEditorProps> = ({
  edu,
  idx,
  onUpdate,
  onRemove,
}) => {
  // Parse existing result into scale and score
  const parseResult = (text: string) => {
    const raw = (text || '').trim();
    if (!raw) return { scale: 'scale-4', score: '' };

    if (/৪\.০০|4\.00|সিজিপিএ|CGPA/i.test(raw)) {
      const match = raw.match(/([০-৯]+(?:\.[০-৯]+)?|[0-9]+(?:\.[0-9]+)?)/);
      return { scale: 'scale-4', score: match ? match[1] : '' };
    }
    if (/৫\.০০|5\.00|জিপিএ|GPA/i.test(raw)) {
      const match = raw.match(/([০-৯]+(?:\.[০-৯]+)?|[0-9]+(?:\.[0-9]+)?)/);
      return { scale: 'scale-5', score: match ? match[1] : '' };
    }
    if (/১ম\s*শ্রেণি|১ম\s*বিভাগ|1st/i.test(raw)) {
      return { scale: '1st-div', score: '১ম শ্রেণি / ১ম বিভাগ' };
    }
    if (/২য়\s*শ্রেণি|২য়\s*বিভাগ|2nd/i.test(raw)) {
      return { scale: '2nd-div', score: '২য় শ্রেণি / ২য় বিভাগ' };
    }
    if (/৩য়\s*শ্রেণি|৩য়\s*বিভাগ|3rd/i.test(raw)) {
      return { scale: '3rd-div', score: '৩য় শ্রেণি / ৩য় বিভাগ' };
    }
    if (/পাস|passed/i.test(raw)) {
      return { scale: 'passed', score: 'পাস' };
    }
    if (/ফলপ্রার্থী|অপেক্ষমাণ|appeared/i.test(raw)) {
      return { scale: 'awaited', score: 'ফলপ্রার্থী' };
    }
    return { scale: 'custom', score: raw };
  };

  const initialResult = parseResult(edu.result);
  const [scale, setScale] = useState<string>(initialResult.scale);
  const [score, setScore] = useState<string>(initialResult.score);

  useEffect(() => {
    const parsed = parseResult(edu.result);
    setScale(parsed.scale);
    setScore(parsed.score);
  }, [edu.id]);

  // Handle Scale change
  const handleScaleChange = (newScale: string) => {
    setScale(newScale);
    if (newScale === 'scale-4') {
      const currentScore = score && score !== '১ম শ্রেণি / ১ম বিভাগ' ? score : '';
      onUpdate('result', currentScore ? `সিজিপিএ ${currentScore} (স্কেল ৪.০০)` : '');
    } else if (newScale === 'scale-5') {
      const currentScore = score && score !== '১ম শ্রেণি / ১ম বিভাগ' ? score : '';
      onUpdate('result', currentScore ? `জিপিএ ${currentScore} (স্কেল ৫.০০)` : '');
    } else if (newScale === '1st-div') {
      setScore('১ম শ্রেণি / ১ম বিভাগ');
      onUpdate('result', '১ম শ্রেণি / ১ম বিভাগ');
    } else if (newScale === '2nd-div') {
      setScore('২য় শ্রেণি / ২য় বিভাগ');
      onUpdate('result', '২য় শ্রেণি / ২য় বিভাগ');
    } else if (newScale === '3rd-div') {
      setScore('৩য় শ্রেণি / ৩য় বিভাগ');
      onUpdate('result', '৩য় শ্রেণি / ৩য় বিভাগ');
    } else if (newScale === 'passed') {
      setScore('পাস');
      onUpdate('result', 'পাস');
    } else if (newScale === 'awaited') {
      setScore('ফলপ্রার্থী');
      onUpdate('result', 'ফলপ্রার্থী (অপেক্ষমাণ)');
    } else if (newScale === 'custom') {
      // keep current text
    }
  };

  // Handle Score change
  const handleScoreChange = (newScore: string) => {
    setScore(newScore);
    if (scale === 'scale-4') {
      onUpdate('result', newScore ? `সিজিপিএ ${newScore} (স্কেল ৪.০০)` : '');
    } else if (scale === 'scale-5') {
      onUpdate('result', newScore ? `জিপিএ ${newScore} (স্কেল ৫.০০)` : '');
    } else {
      onUpdate('result', newScore);
    }
  };

  // State to track if user chose custom mode for the 4 fields
  const isDegreePreset = DEGREE_OPTIONS.includes(edu.degree);
  const isDegreeCustom = !isDegreePreset && edu.degree !== '';
  const [degreeCustomMode, setDegreeCustomMode] = useState<boolean>(isDegreeCustom);

  const isInstPreset = INSTITUTION_OPTIONS.includes(edu.institution);
  const isInstCustom = !isInstPreset && edu.institution !== '';
  const [instCustomMode, setInstCustomMode] = useState<boolean>(isInstCustom);

  const isBoardPreset = BOARD_MAJOR_OPTIONS.includes(edu.boardOrMajor || '');
  const isBoardCustom = !isBoardPreset && (edu.boardOrMajor || '') !== '';
  const [boardCustomMode, setBoardCustomMode] = useState<boolean>(isBoardCustom);

  const isYearPreset = PASSING_YEAR_OPTIONS.includes(edu.passingYear);
  const isYearCustom = !isYearPreset && edu.passingYear !== '';
  const [yearCustomMode, setYearCustomMode] = useState<boolean>(isYearCustom);

  return (
    <div className="p-3.5 bg-white border border-[#D5E4DB] rounded-xl shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#E6F4EC] pb-2">
        <span className="font-bold text-[#084A2E] text-xs flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#0B5D3B]/10 text-[#0B5D3B] flex items-center justify-center text-[11px] font-mono">
            {idx + 1}
          </span>
          <span>{edu.degree || 'শিক্ষাগত যোগ্যতা'}</span>
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-[#c8342a] hover:text-red-800 hover:bg-red-50 p-1 rounded-md transition-colors cursor-pointer"
          title="মুছে ফেলুন"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Clean Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Field 1: পরীক্ষা / ডিগ্রি */}
        <div>
          <label className="block text-[#4A5A52] font-medium mb-1">পরীক্ষা / ডিগ্রি:</label>
          <select
            value={degreeCustomMode ? '__custom__' : edu.degree}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setDegreeCustomMode(true);
              } else {
                setDegreeCustomMode(false);
                onUpdate('degree', e.target.value);
              }
            }}
            className="w-full px-2.5 py-1.5 bg-[#F8FAF9] border border-[#D5E4DB] focus:border-[#0B5D3B] focus:outline-hidden rounded-lg cursor-pointer"
          >
            <option value="">-- ডিগ্রি নির্বাচন করুন --</option>
            {DEGREE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__custom__">✍️ অন্যান্য (নিজে লিখুন)</option>
          </select>

          {degreeCustomMode && (
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => onUpdate('degree', e.target.value)}
              placeholder="ডিগ্রির নাম লিখুন (যেমন: বি.এসসি সম্মান)"
              autoFocus
              className="w-full mt-1.5 px-2.5 py-1.5 bg-white border border-[#0B5D3B]/40 focus:border-[#0B5D3B] focus:outline-hidden rounded-lg"
            />
          )}
        </div>

        {/* Field 2: প্রতিষ্ঠান / বিশ্ববিদ্যালয় */}
        <div>
          <label className="block text-[#4A5A52] font-medium mb-1">
            প্রতিষ্ঠান / বিশ্ববিদ্যালয়:
          </label>
          <select
            value={instCustomMode ? '__custom__' : edu.institution}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setInstCustomMode(true);
              } else {
                setInstCustomMode(false);
                onUpdate('institution', e.target.value);
              }
            }}
            className="w-full px-2.5 py-1.5 bg-[#F8FAF9] border border-[#D5E4DB] focus:border-[#0B5D3B] focus:outline-hidden rounded-lg cursor-pointer"
          >
            <option value="">-- প্রতিষ্ঠান নির্বাচন করুন --</option>
            {INSTITUTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__custom__">✍️ অন্যান্য (নিজে লিখুন)</option>
          </select>

          {instCustomMode && (
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => onUpdate('institution', e.target.value)}
              placeholder="প্রতিষ্ঠানের নাম লিখুন"
              autoFocus
              className="w-full mt-1.5 px-2.5 py-1.5 bg-white border border-[#0B5D3B]/40 focus:border-[#0B5D3B] focus:outline-hidden rounded-lg"
            />
          )}
        </div>

        {/* Field 3: বোর্ড / বিভাগ / বিষয় */}
        <div>
          <label className="block text-[#4A5A52] font-medium mb-1">
            বোর্ড / বিভাগ / বিষয়:
          </label>
          <select
            value={boardCustomMode ? '__custom__' : edu.boardOrMajor || ''}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setBoardCustomMode(true);
              } else {
                setBoardCustomMode(false);
                onUpdate('boardOrMajor', e.target.value);
              }
            }}
            className="w-full px-2.5 py-1.5 bg-[#F8FAF9] border border-[#D5E4DB] focus:border-[#0B5D3B] focus:outline-hidden rounded-lg cursor-pointer"
          >
            <option value="">-- বোর্ড বা বিষয় নির্বাচন করুন --</option>
            {BOARD_MAJOR_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__custom__">✍️ অন্যান্য (নিজে লিখুন)</option>
          </select>

          {boardCustomMode && (
            <input
              type="text"
              value={edu.boardOrMajor || ''}
              onChange={(e) => onUpdate('boardOrMajor', e.target.value)}
              placeholder="বোর্ড বা বিষয়ের নাম লিখুন"
              autoFocus
              className="w-full mt-1.5 px-2.5 py-1.5 bg-white border border-[#0B5D3B]/40 focus:border-[#0B5D3B] focus:outline-hidden rounded-lg"
            />
          )}
        </div>

        {/* Field 4: পাসের বছর */}
        <div>
          <label className="block text-[#4A5A52] font-medium mb-1">পাসের বছর:</label>
          <select
            value={yearCustomMode ? '__custom__' : edu.passingYear}
            onChange={(e) => {
              if (e.target.value === '__custom__') {
                setYearCustomMode(true);
              } else {
                setYearCustomMode(false);
                onUpdate('passingYear', e.target.value);
              }
            }}
            className="w-full px-2.5 py-1.5 bg-[#F8FAF9] border border-[#D5E4DB] focus:border-[#0B5D3B] focus:outline-hidden rounded-lg cursor-pointer"
          >
            <option value="">-- পাসের বছর নির্বাচন করুন --</option>
            {PASSING_YEAR_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__custom__">✍️ অন্যান্য (নিজে লিখুন)</option>
          </select>

          {yearCustomMode && (
            <input
              type="text"
              value={edu.passingYear}
              onChange={(e) => onUpdate('passingYear', e.target.value)}
              placeholder="যেমন: ২০১৮"
              autoFocus
              className="w-full mt-1.5 px-2.5 py-1.5 bg-white border border-[#0B5D3B]/40 focus:border-[#0B5D3B] focus:outline-hidden rounded-lg"
            />
          )}
        </div>

        {/* Field 5: ফলাফলের স্কেল */}
        <div>
          <label className="block text-[#4A5A52] font-medium mb-1">
            ফলাফলের স্কেল / ধরন:
          </label>
          <select
            value={scale}
            onChange={(e) => handleScaleChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#F8FAF9] border border-[#D5E4DB] focus:border-[#0B5D3B] focus:outline-hidden rounded-lg cursor-pointer font-medium"
          >
            <option value="scale-4">সিজিপিএ (স্কেল ৪.০০) — বিশ্ববিদ্যালয় / অনার্স</option>
            <option value="scale-5">জিপিএ (স্কেল ৫.০০) — এসএসসি / এইচএসসি</option>
            <option value="1st-div">১ম শ্রেণি / ১ম বিভাগ (1st Class / Division)</option>
            <option value="2nd-div">২য় শ্রেণি / ২য় বিভাগ (2nd Class / Division)</option>
            <option value="3rd-div">৩য় শ্রেণি / ৩য় বিভাগ (3rd Class / Division)</option>
            <option value="passed">পাস (Passed)</option>
            <option value="awaited">ফলপ্রার্থী / অপেক্ষমাণ (Appeared)</option>
            <option value="custom">✍️ কাস্টম রেজাল্ট লিখুন</option>
          </select>
        </div>

        {/* Field 6: প্রাপ্ত ফলাফল / GPA পয়েন্ট */}
        <div>
          <label className="block text-[#4A5A52] font-medium mb-1">
            {scale === 'scale-4'
              ? 'প্রাপ্ত পয়েন্ট (আউট অব ৪.০০):'
              : scale === 'scale-5'
              ? 'প্রাপ্ত পয়েন্ট (আউট অব ৫.০০):'
              : 'ফলাফল বিবরণ:'}
          </label>
          <input
            type="text"
            value={scale === 'custom' ? edu.result : score}
            onChange={(e) => {
              if (scale === 'custom') {
                onUpdate('result', e.target.value);
              } else {
                handleScoreChange(e.target.value);
              }
            }}
            placeholder={
              scale === 'scale-4'
                ? 'যেমন: ৩.৬৫'
                : scale === 'scale-5'
                ? 'যেমন: ৫.০০'
                : 'ফলাফল লিখুন'
            }
            className="w-full px-2.5 py-1.5 bg-white border border-[#D5E4DB] focus:border-[#0B5D3B] focus:outline-hidden rounded-lg font-medium"
          />
        </div>
      </div>

      {/* Single clean status line showing how it will appear on the CV */}
      {(scale === 'scale-4' || scale === 'scale-5') && edu.result && (
        <div className="text-[11px] text-[#0B5D3B] bg-[#E6F4EC] px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5">
          <span>✓ সিভিতে যুক্ত হবে:</span>
          <span className="font-semibold">{edu.result}</span>
        </div>
      )}
    </div>
  );
};
