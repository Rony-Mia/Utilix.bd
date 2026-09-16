import { PresetProfile } from '../types.ts';

export const GOVERNMENT_PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'bcs_govt_photo',
    name: 'বিসিএস ও সরকারি চাকরি (ছবি)',
    org: 'Teletalk / BPSC / Ministry',
    width: 300,
    height: 300,
    maxSizeKb: 100,
    format: 'jpeg',
    aspectRatio: '1:1',
    description: 'টেলিটক ও সরকারি চাকরি আবেদনের অফিশিয়াল ৩০০×৩০০ পিক্সেল মাপ (অনূর্ধ্ব ১০০ KB)'
  },
  {
    id: 'govt_signature',
    name: 'চাকরি ও বিসিএস স্বাক্ষর (Signature)',
    org: 'Teletalk / BPSC',
    width: 300,
    height: 80,
    maxSizeKb: 60,
    format: 'jpeg',
    aspectRatio: '300:80',
    description: 'অনলাইন আবেদনের জন্য অফিশিয়াল ৩০০×৮০ পিক্সেল মাপ (অনূর্ধ্ব ৬০ KB)'
  },
  {
    id: 'bd_passport',
    name: 'বাংলাদেশ ই-পাসপোর্ট / পাসপোর্ট ছবি',
    org: 'DIP Bangladesh',
    width: 413,
    height: 531,
    maxSizeKb: 300,
    format: 'jpeg',
    aspectRatio: '413:531',
    description: '৪৫মিমি × ৫৫মিমি মাপের মানসম্মত আন্তর্জাতিক ও বাংলাদেশ পাসপোর্ট ছবি (সাদা ব্যাকগ্রাউন্ড)'
  },
  {
    id: 'primary_teacher',
    name: 'প্রাইমারি সহকারী শিক্ষক নিয়োগ ছবি',
    org: 'DPE Teletalk',
    width: 300,
    height: 300,
    maxSizeKb: 100,
    format: 'jpeg',
    aspectRatio: '1:1',
    description: 'ডিপিই প্রাথমিক শিক্ষক নিয়োগ পরীক্ষার নির্ধারিত ৩০০×৩০০ পিক্সেল'
  },
  {
    id: 'nid_portal',
    name: 'স্মার্ট এনআইডি অনলাইন পোর্টাল',
    org: 'Election Commission',
    width: 300,
    height: 300,
    maxSizeKb: 100,
    format: 'jpeg',
    aspectRatio: '1:1',
    description: 'নির্বাচন কমিশন এনআইডি সেবা ও ড্রাইভিং লাইসেন্স পোর্টাল'
  }
];
