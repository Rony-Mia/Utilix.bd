export interface SiteUpdate {
  id: string;
  date: string;
  version: string;
  badge: string;
  badgeType: 'new' | 'update' | 'enhancement';
  title: string;
  description: string;
  toolLink?: string;
  toolName?: string;
}

export const SITE_UPDATES: SiteUpdate[] = [
  {
    id: 'update-gpa-calc',
    date: 'মার্চ ২০২৫',
    version: 'v1.0',
    badge: 'নতুন টুল',
    badgeType: 'new',
    title: 'জিপিএ ও সিজিপিএ ক্যালকুলেটর সংযোজন',
    description: 'বাংলাদেশি শিক্ষা বোর্ডের এসএসসি/এইচএসসি (৫.০০ স্কেল, ৪র্থ বিষয় বোনাস সহ) এবং বিশ্ববিদ্যালয়ের ক্রেডিট-ওয়েটেড সেমিস্টার ও সামগ্রিক সিজিপিএ (৪.০০ স্কেল) নির্ভুল গণনার সুবিধা।',
    toolLink: '/gpa-calculator',
    toolName: 'জিপিএ ক্যালকুলেটর চালু করুন'
  },
  {
    id: 'update-cv-builder',
    date: 'মার্চ ২০২৫',
    version: 'v1.0',
    badge: 'নতুন টুল',
    badgeType: 'new',
    title: 'প্রফেশনাল সিভি ও জীবনবৃত্তান্ত মেকার প্রকাশ',
    description: 'সরকারি ও কর্পোরেট চাকরির উপযোগী ৫টি নান্দনিক টেমপ্লেট, বাংলা ও ইংরেজি উভয় ভাষা সাপোর্ট এবং এক ক্লিকে ব্রাউজার থেকেই প্রিন্ট-রেডি A4 PDF ডাউনলোড।',
    toolLink: '/cv-builder',
    toolName: 'সিভি মেকার দেখুন'
  },
  {
    id: 'update-amount-in-words',
    date: 'ফেব্রুয়ারি ২০২৫',
    version: 'v1.0',
    badge: 'নতুন টুল',
    badgeType: 'new',
    title: 'টাকা → কথায় কনভার্টার (Amount in Words) উন্মোচন',
    description: 'ব্যাংক চেক, জমির বায়না দলিল, ভাউচার ও রসিদে লেখার জন্য সংখ্যা বা পয়সা ইনপুট দিলেই শতভাগ প্রমিত ব্যাকরণিক বাংলা কথায় রূপান্তর।',
    toolLink: '/amount-in-words',
    toolName: 'টাকা কথায় কনভার্টার'
  },
  {
    id: 'update-age-calculator',
    date: 'ফেব্রুয়ারি ২০২৫',
    version: 'v1.0',
    badge: 'নতুন টুল',
    badgeType: 'new',
    title: 'সরকারি চাকরির বয়স ক্যালকুলেটর ও কোটা পরীক্ষক',
    description: 'সার্কুলারের নির্দিষ্ট তারিখে আবেদনকারীর প্রকৃত বছর-মাস-দিন হিসাব, মোট দিন ও সপ্তাহ গণনা এবং সাধারণ প্রার্থী (৩০ বছর) ও কোটাভুক্ত প্রার্থীদের (৩২ বছর) বয়সসীমা যাচাই।',
    toolLink: '/age-calculator',
    toolName: 'বয়স ক্যালকুলেটর'
  },
  {
    id: 'update-photo-resizer',
    date: 'জানুয়ারি ২০২৫',
    version: 'v1.0',
    badge: 'ফিচার আপডেট',
    badgeType: 'update',
    title: 'সরকারি চাকরি ও পাসপোর্ট ছবি রিসাইজার ইঞ্জিন',
    description: 'Teletalk, BPSC ও পাসপোর্ট আবেদনের ৩০০×৩০০ পিক্সেল (১০০KB) ছবি এবং ৩০০×৮০ পিক্সেল (৬০KB) স্বাক্ষর স্বয়ংক্রিয় অনুপাত ঠিক রেখে ব্রাউজারেই রিসাইজ ও অপ্টিমাইজেশন।',
    toolLink: '/photo-resizer',
    toolName: 'ছবি রিসাইজার'
  },
  {
    id: 'update-bijoy-converter',
    date: 'জানুয়ারি ২০২৫',
    version: 'v2.4',
    badge: 'উন্নতি',
    badgeType: 'enhancement',
    title: 'বিজয় ↔ ইউনিকোড ইঞ্জিন ২.৪ অপ্টিমাইজেশন',
    description: 'যুক্তবর্ণ ম্যাপিং ও রিভার্স ইউনিকোড-টু-বিজয় অ্যালগরিদম পরিমার্জন, টেক্সট ফাইল (.txt) আমদানি-রপ্তানি ও লাইভ ডুয়াল প্রিভিউ পারফরম্যান্স বৃদ্ধি।',
    toolLink: '/converter',
    toolName: 'বিজয় কনভার্টার'
  }
];
