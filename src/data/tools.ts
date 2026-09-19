import { ToolItem } from '../types.ts';

export const TOOLS: ToolItem[] = [
  {
    id: 'bijoy-converter',
    refCode: 'TXT-CONV-01',
    title: 'বিজয় ↔ ইউনিকোড টেক্সট কনভার্টার',
    description: 'পুরনো বিজয় ANSI এনকোডিংয়ের ফন্ট (SutonnyMJ) থেকে আধুনিক ইউনিকোড এবং ইউনিকোড থেকে বিজয়ে তাৎক্ষণিক লাইভ রূপান্তর।',
    feature: 'লাইভ টাইপিং • .txt ফাইল সাপোর্ট • অফলাইন প্রস্তুত',
    category: 'text',
    status: 'active',
    version: 'v2.4',
    link: '/converter'
  },
  {
    id: 'photo-resizer',
    refCode: 'IMG-GOV-02',
    title: 'সরকারি ও পাসপোর্ট ছবি রিসাইজার',
    description: 'বাংলাদেশি সরকারি চাকরি (Teletalk/BPSC), বিসিএস ও পাসপোর্ট আবেদনের নির্ধারিত ৩০০×৩০০ পিক্সেল এবং ১০০KB মাপে ক্রপ, রিসাইজ ও কম্প্রেশন।',
    feature: '৩০০×৩০০ ছবি • ৩০০×৮০ স্বাক্ষর • ক্লায়েন্ট-সাইড অপ্টিমাইজার',
    category: 'image',
    status: 'active',
    version: 'v1.0',
    link: '/photo-resizer'
  },
  {
    id: 'age-calculator',
    refCode: 'CALC-AGE-01',
    title: 'সরকারি চাকরির বয়স ক্যালকুলেটর',
    description: 'জন্ম তারিখ ও সার্কুলারের হিসাবের তারিখ অনুযায়ী নির্ভুল বছর, মাস ও দিন গণনা, মোট দিন-সপ্তাহ এবং সাধারণ ও কোটাভিত্তিক সরকারি চাকরির বয়সসীমা যাচাই।',
    feature: 'বছর-মাস-দিন হিসাব • ৩০/৩২ বছর কোটা চেকার • কাস্টম লিমিট',
    category: 'calculator',
    status: 'active',
    version: 'v1.0',
    link: '/age-calculator'
  },
  {
    id: 'amount-in-words',
    refCode: 'FIN-WRD-01',
    title: 'টাকা → কথায় কনভার্টার (Amount in Words)',
    description: 'ব্যাংক চেক, জমির দলিল, ভাউচার ও রসিদে লেখার জন্য যেকোনো টাকার অংক (হাজার, লক্ষ, কোটি ও পয়সাসহ) তাৎক্ষণিক নির্ভুল বাংলা কথায় রূপান্তর।',
    feature: 'লাইভ কনভার্ট • পয়সা সাপোর্ট • ব্যাংক ও দলিল প্রমিত রূপ',
    category: 'calculator',
    status: 'active',
    version: 'v1.0',
    link: '/amount-in-words'
  },
  {
    id: 'gpa-calculator',
    refCode: 'CALC-GPA-01',
    title: 'জিপিএ ও সিজিপিএ ক্যালকুলেটর (GPA & CGPA Calculator)',
    description: 'বাংলাদেশি শিক্ষা বোর্ডের এসএসসি/এইচএসসি (৫.০০ স্কেল, ৪র্থ বিষয়সহ) এবং বিশ্ববিদ্যালয়ের সেমিস্টার ও সামগ্রিক সিজিপিএ (৪.০০ স্কেল) দ্রুত ও নির্ভুল হিসাব।',
    feature: '৫.০০ ও ৪.০০ স্কেল • ৪র্থ বিষয়ের বোনাস • ক্রেডিট আওয়ার ওয়েটেড CGPA',
    category: 'calculator',
    status: 'active',
    version: 'v1.0',
    link: '/gpa-calculator'
  },
  {
    id: 'cv-builder',
    refCode: 'DOC-CV-01',
    title: 'সিভি ও জীবনবৃত্তান্ত মেকার (CV Builder)',
    description: 'বাংলাদেশি সরকারি ও বেসরকারি চাকরির উপযোগী প্রফেশনাল কারিকুলাম ভিটা (CV/Resume)। ৫টি রেডিমেড টেমপ্লেট, বাংলা ও ইংরেজি ভাষা সাপোর্ট ও এক ক্লিকে A4 PDF ডাউনলোড।',
    feature: '৫টি টেমপ্লেট • বাংলা ও ইংরেজি • ১০০% ক্লায়েন্ট-সাইড PDF',
    category: 'document',
    status: 'active',
    version: 'v1.0',
    link: '/cv-builder'
  },
  {
    id: 'pdf-merger',
    refCode: 'DOC-PDF-01',
    title: 'পিডিএফ মার্জার (PDF Merger)',
    description: 'একাধিক পিডিএফ ফাইলকে একটি ফাইলে রূপান্তর ও একত্রীকরণ। ফাইল রি-অর্ডার, আনলিমিটেড পেজ এবং সম্পূর্ণ ব্রাউজারেই ১০০% নিরাপদ প্রসেসিং।',
    feature: 'আনলিমিটেড মার্জ • ড্র্যাগ-রিঅর্ডার • নো সার্ভার আপলোড',
    category: 'document',
    status: 'active',
    version: 'v1.0',
    link: '/pdf-merger'
  },
  {
    id: 'pdf-split',
    refCode: 'DOC-PDF-02',
    title: 'পিডিএফ স্প্লিটার (PDF Splitter)',
    description: 'বড় পিডিএফ ফাইল থেকে নির্দিষ্ট পেজ রেঞ্জ আলাদা করুন অথবা প্রতি পেজকে পৃথক ফাইলে ভাগ করে এক ক্লিকে জিপ (ZIP) ডাউনলোড করুন।',
    feature: 'পেজ রেঞ্জ স্প্লিট • প্রতি পেজ আলাদা • ZIP ডাউনলোড',
    category: 'document',
    status: 'active',
    version: 'v1.0',
    link: '/pdf-split'
  },
  {
    id: 'pdf-delete-pages',
    refCode: 'DOC-PDF-03',
    title: 'পিডিএফ পেজ ডিলিট (Delete Pages)',
    description: 'পিডিএফ ফাইল থেকে অপ্রয়োজনীয় বা অতিরিক্ত ফাঁকা পৃষ্ঠা নির্বাচন করে এক ক্লিকে মুছে ফেলুন। সম্পূর্ণ অফলাইন ও কোয়ালিটি অক্ষুণ্ণ।',
    feature: 'ভিজ্যুয়াল সিলেকশন • জোড়/বিজোড় সিলেক্টর • দ্রুত ছাঁটাই',
    category: 'document',
    status: 'active',
    version: 'v1.0',
    link: '/pdf-delete-pages'
  },
  {
    id: 'pdf-rotate',
    refCode: 'DOC-PDF-04',
    title: 'পিডিএফ রোটেট (PDF Rotate)',
    description: 'স্ক্যান করা উল্টো বা বাঁকা পিডিএফ পৃষ্ঠাসমূহ ৯০°, ১৮০° বা ২৭০° ঘুরিয়ে সোজা করুন। একক পেজ বা সকল পেজ একসাথে রোটেশনের সুবিধা।',
    feature: 'একক বা অল-পেজ • ৯০°/১৮০° রোটেশন • নিখুঁত সোজা ওরিয়েন্টেশন',
    category: 'document',
    status: 'active',
    version: 'v1.0',
    link: '/pdf-rotate'
  },
  {
    id: 'pdf-watermark-page-number',
    refCode: 'DOC-PDF-05',
    title: 'পিডিএফ ওয়াটারমার্ক ও পেজ নম্বর',
    description: 'পিডিএফ নথিতে কাস্টম টেক্সট বা লোগো ওয়াটারমার্ক এবং পৃষ্ঠা নম্বর (বাংলা/ইংরেজি) বসিয়ে ফাইলকে নিরাপদ ও আনুষ্ঠানিক করুন।',
    feature: 'টেক্সট/লোগো স্ট্যাম্প • ৬ পজিশনে পেজ নম্বর • বাংলা সংখ্যা • টাইল্ড সিকিউরিটি',
    category: 'document',
    status: 'active',
    version: 'v1.0',
    link: '/pdf-watermark-page-number'
  }
];
