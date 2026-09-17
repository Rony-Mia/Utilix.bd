import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Languages,
  Users,
  Eye,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { CvData, CvLanguage } from '../types.ts';
import { SAMPLE_CV_DATA_BN, EMPTY_CV_DATA } from '../data/cvDefaults.ts';
import { ClassicTemplate } from '../components/cv-templates/ClassicTemplate.tsx';
import { ModernTemplate } from '../components/cv-templates/ModernTemplate.tsx';
import { CompactTemplate } from '../components/cv-templates/CompactTemplate.tsx';
import { GovtStandardTemplate } from '../components/cv-templates/GovtStandardTemplate.tsx';
import { CreativeTemplate } from '../components/cv-templates/CreativeTemplate.tsx';

type TemplateId = 'classic' | 'modern' | 'compact' | 'govt' | 'creative';

interface TemplateOption {
  id: TemplateId;
  name: string;
  nameEn: string;
  desc: string;
  tag: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'classic',
    name: 'ক্লাসিক (সরকারি জব)',
    nameEn: 'Classic Format',
    desc: 'প্রথাগত ফরমাল ফরম্যাট, ছবি কোণে',
    tag: 'জনপ্রিয়',
  },
  {
    id: 'modern',
    name: 'মডার্ন (২ কলাম)',
    nameEn: 'Modern 2-Column',
    desc: 'বেসরকারি ও কর্পোরেট পদের জন্য',
    tag: 'কর্পোরেট',
  },
  {
    id: 'compact',
    name: 'কমপ্যাক্ট (১ পাতা)',
    nameEn: 'Compact Single Page',
    desc: 'ফ্রেশারদের জন্য এক পাতায় সাজানো',
    tag: 'ফ্রেশার',
  },
  {
    id: 'govt',
    name: 'সরকারি জীবনবৃত্তান্ত',
    nameEn: 'Govt Standard Bio-Data',
    desc: '১, ২, ৩ ক্রমিক নং ছক ফরম্যাট',
    tag: 'সরকারি আবেদন',
  },
  {
    id: 'creative',
    name: 'ক্রিয়েটিভ ডিজাইন',
    nameEn: 'Creative Accent',
    desc: 'কালার হেডার ও স্টাইলিশ ফন্ট',
    tag: 'প্রাইভেট/আইটি',
  },
];

const LOCAL_STORAGE_KEY = 'utilix_cv_builder_data_v1';
const LOCAL_STORAGE_LANG_KEY = 'utilix_cv_builder_lang_v1';
const LOCAL_STORAGE_TEMPLATE_KEY = 'utilix_cv_builder_template_v1';

export const CvBuilderPage: React.FC = () => {
  const [cvData, setCvData] = useState<CvData>(SAMPLE_CV_DATA_BN);
  const [language, setLanguage] = useState<CvLanguage>('bn');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic');
  const [activeFormTab, setActiveFormTab] = useState<
    'personal' | 'education' | 'experience' | 'skills' | 'references'
  >('personal');
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved state on mount (Client-side only)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setCvData(JSON.parse(savedData));
      }
      const savedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      if (savedLang === 'bn' || savedLang === 'en') {
        setLanguage(savedLang);
      }
      const savedTpl = localStorage.getItem(LOCAL_STORAGE_TEMPLATE_KEY);
      if (savedTpl && TEMPLATES.some((t) => t.id === savedTpl)) {
        setSelectedTemplate(savedTpl as TemplateId);
      }
    } catch {
      // ignore localStorage parse error
    }
  }, []);

  // Auto-save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cvData));
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, language);
      localStorage.setItem(LOCAL_STORAGE_TEMPLATE_KEY, selectedTemplate);
      setIsSaved(true);
      const timer = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      // ignore quota error
    }
  }, [cvData, language, selectedTemplate]);

  // Handlers for Personal Info
  const updatePersonalInfo = (field: keyof CvData['personalInfo'], value: string) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Image Upload with Client-Side Canvas Resizer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updatePersonalInfo('photoUrl', dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonalInfo('photoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Education items dynamic management
  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: '',
          institution: '',
          passingYear: '',
          result: '',
          boardOrMajor: '',
        },
      ],
    }));
  };

  const updateEducation = (
    id: string,
    field: keyof CvData['education'][0],
    value: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  // Experience items dynamic management
  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          designation: '',
          company: '',
          duration: '',
          responsibilities: '',
        },
      ],
    }));
  };

  const updateExperience = (
    id: string,
    field: keyof CvData['experience'][0],
    value: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  // Skills dynamic tag management
  const addSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!cvData.skills.includes(newSkillInput.trim())) {
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkillInput.trim()],
      }));
    }
    setNewSkillInput('');
  };

  const removeSkill = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index),
    }));
  };

  // Language proficiency management
  const addLanguage = () => {
    setCvData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          id: `lang-${Date.now()}`,
          name: '',
          proficiency: '',
        },
      ],
    }));
  };

  const updateLanguage = (
    id: string,
    field: keyof CvData['languages'][0],
    value: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeLanguage = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.filter((item) => item.id !== id),
    }));
  };

  // References management
  const addReference = () => {
    setCvData((prev) => ({
      ...prev,
      references: [
        ...prev.references,
        {
          id: `ref-${Date.now()}`,
          name: '',
          designation: '',
          organization: '',
          phone: '',
          email: '',
        },
      ],
    }));
  };

  const updateReference = (
    id: string,
    field: keyof CvData['references'][0],
    value: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      references: prev.references.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeReference = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      references: prev.references.filter((item) => item.id !== id),
    }));
  };

  // Sample data & reset handlers
  const handleLoadSample = () => {
    setCvData(SAMPLE_CV_DATA_BN);
  };

  const handleResetForm = () => {
    if (
      window.confirm(
        'আপনি কি নিশ্চিত যে সকল তথ্য মুছে ফেলে নতুন ফর্ম শুরু করতে চান?'
      )
    ) {
      setCvData(EMPTY_CV_DATA);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Print/PDF export action
  const handlePrint = () => {
    window.print();
  };

  // Render chosen template
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={cvData} language={language} />;
      case 'compact':
        return <CompactTemplate data={cvData} language={language} />;
      case 'govt':
        return <GovtStandardTemplate data={cvData} language={language} />;
      case 'creative':
        return <CreativeTemplate data={cvData} language={language} />;
      case 'classic':
      default:
        return <ClassicTemplate data={cvData} language={language} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>ফ্রি সিভি মেকার — বাংলা ও ইংরেজি CV Builder | Utilix.bd</title>
        <meta
          name="description"
          content="বাংলাদেশি সরকারি চাকরি ও বেসরকারি পদের জন্য ১০০% ক্লায়েন্ট-সাইড ফ্রি জীবনবৃত্তান্ত (CV/Resume) মেকার। ৫টি প্রফেশনাল টেমপ্লেট, বাংলা ও ইংরেজি সাপোর্ট, ইনস্ট্যান্ট A4 PDF প্রিন্ট ও ডাউনলোড।"
        />
      </Helmet>

      {/* Print-only CSS rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-print-area, #cv-print-area * {
            visibility: visible;
          }
          #cv-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          header, footer, nav {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Header: Title, Actions & Language toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#d8cfb8] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#0c5c3d] text-white">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#083f2a]">
                সিভি ও জীবনবৃত্তান্ত মেকার
              </h1>
              <span className="text-[11px] px-2 py-0.5 bg-[#e8e0cc] text-[#083f2a] font-semibold border border-[#d8cfb8]">
                CV Builder
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6b6255] mt-1">
              বাংলাদেশি সরকারি ও কর্পোরেট চাকরির উপযোগী প্রফেশনাল সিভি তৈরি করুন। ১০০% ক্লায়েন্ট-সাইড ও সুরক্ষিত।
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <div className="flex items-center border border-[#d8cfb8] bg-[#fffdf7] p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  language === 'bn'
                    ? 'bg-[#0c5c3d] text-[#fffdf7] font-semibold'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#0c5c3d] text-[#fffdf7] font-semibold'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                English
              </button>
            </div>

            {/* Load Sample Data */}
            <button
              type="button"
              onClick={handleLoadSample}
              title="নমুনা ডেটা দিয়ে ফর্ম পূরণ করুন"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d8cfb8] bg-[#fffdf7] text-xs font-medium text-[#083f2a] hover:bg-[#e8e0cc] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0c5c3d]" />
              <span>নমুনা ডেটা</span>
            </button>

            {/* Reset Form */}
            <button
              type="button"
              onClick={handleResetForm}
              title="ফর্ম পরিষ্কার করুন"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d8cfb8] bg-[#fffdf7] text-xs font-medium text-[#c8342a] hover:bg-red-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>

            {/* Print / Save as PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#0c5c3d] text-[#fffdf7] text-xs sm:text-sm font-semibold hover:bg-[#083f2a] transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PDF / প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        {/* Template Selector Thumbnails */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#083f2a]">
              টেমপ্লেট নির্বাচন করুন ({TEMPLATES.length} টি স্টাইল):
            </span>
            {isSaved && (
              <span className="text-[11px] text-[#0c5c3d] flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> ব্রাউজারে সংরক্ষিত
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-3 text-left border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#fffdf7] border-[#0c5c3d] ring-2 ring-[#0c5c3d]/20 shadow-xs'
                      : 'bg-[#fffdf7] border-[#d8cfb8] hover:border-[#0c5c3d]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#083f2a]' : 'text-[#14231c]'
                      }`}
                    >
                      {tpl.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#0c5c3d]"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6b6255] line-clamp-1">{tpl.desc}</p>
                  <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.2 bg-[#f4efe4] text-[#083f2a] border border-[#d8cfb8]">
                    {tpl.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile View Toggle: Form vs Preview */}
        <div className="lg:hidden mb-4 flex border border-[#d8cfb8] bg-[#fffdf7] p-1 text-xs">
          <button
            type="button"
            onClick={() => setMobileView('form')}
            className={`flex-1 py-2 text-center font-medium flex items-center justify-center gap-1.5 ${
              mobileView === 'form'
                ? 'bg-[#0c5c3d] text-white font-semibold'
                : 'text-[#6b6255]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>তথ্য সম্পাদনা (Form)</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-2 text-center font-medium flex items-center justify-center gap-1.5 ${
              mobileView === 'preview'
                ? 'bg-[#0c5c3d] text-white font-semibold'
                : 'text-[#6b6255]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>লাইভ প্রিভিউ (Preview)</span>
          </button>
        </div>

        {/* Main Work Area: Side-by-Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor (5 cols on large screen) */}
          <div
            className={`lg:col-span-5 bg-[#fffdf7] border border-[#d8cfb8] shadow-xs ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Form Section Tabs */}
            <div className="flex border-b border-[#d8cfb8] bg-[#f4efe4] overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveFormTab('personal')}
                className={`px-3 py-2.5 font-medium whitespace-nowrap flex items-center gap-1.5 border-r border-[#d8cfb8] transition-colors cursor-pointer ${
                  activeFormTab === 'personal'
                    ? 'bg-[#fffdf7] text-[#083f2a] font-bold border-b-2 border-b-[#0c5c3d]'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>ব্যক্তিগত</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('education')}
                className={`px-3 py-2.5 font-medium whitespace-nowrap flex items-center gap-1.5 border-r border-[#d8cfb8] transition-colors cursor-pointer ${
                  activeFormTab === 'education'
                    ? 'bg-[#fffdf7] text-[#083f2a] font-bold border-b-2 border-b-[#0c5c3d]'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>শিক্ষা ({cvData.education.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('experience')}
                className={`px-3 py-2.5 font-medium whitespace-nowrap flex items-center gap-1.5 border-r border-[#d8cfb8] transition-colors cursor-pointer ${
                  activeFormTab === 'experience'
                    ? 'bg-[#fffdf7] text-[#083f2a] font-bold border-b-2 border-b-[#0c5c3d]'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>অভিজ্ঞতা ({cvData.experience.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('skills')}
                className={`px-3 py-2.5 font-medium whitespace-nowrap flex items-center gap-1.5 border-r border-[#d8cfb8] transition-colors cursor-pointer ${
                  activeFormTab === 'skills'
                    ? 'bg-[#fffdf7] text-[#083f2a] font-bold border-b-2 border-b-[#0c5c3d]'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>দক্ষতা</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('references')}
                className={`px-3 py-2.5 font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeFormTab === 'references'
                    ? 'bg-[#fffdf7] text-[#083f2a] font-bold border-b-2 border-b-[#0c5c3d]'
                    : 'text-[#6b6255] hover:text-[#083f2a]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>রেফারেন্স</span>
              </button>
            </div>

            {/* Form Tab Content */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[720px] overflow-y-auto">
              {/* TAB 1: Personal Info */}
              {activeFormTab === 'personal' && (
                <div className="space-y-4 text-xs">
                  {/* Photo Upload Row */}
                  <div className="p-3 bg-[#f4efe4] border border-[#d8cfb8] flex items-center gap-4">
                    {cvData.personalInfo.photoUrl ? (
                      <div className="w-16 h-20 border border-[#9ca3af] bg-white overflow-hidden flex-shrink-0">
                        <img
                          src={cvData.personalInfo.photoUrl}
                          alt="CV Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-20 border border-dashed border-[#9ca3af] bg-white flex items-center justify-center text-[10px] text-[#6b6255] text-center p-1 flex-shrink-0">
                        ছবি নেই
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <label className="block font-bold text-[#083f2a]">
                        প্রার্থীর পাসপোর্ট সাইজ ছবি:
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload-input"
                      />
                      <div className="flex gap-2">
                        <label
                          htmlFor="photo-upload-input"
                          className="px-3 py-1 bg-[#0c5c3d] text-white font-medium hover:bg-[#083f2a] transition-colors cursor-pointer flex items-center gap-1 text-xs"
                        >
                          <Upload className="w-3 h-3" />
                          <span>ছবি আপলোড</span>
                        </label>
                        {cvData.personalInfo.photoUrl && (
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-xs"
                          >
                            মুছুন
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-[#6b6255]">
                        ব্রাউজারেই স্বয়ংক্রিয়ভাবে পাসপোর্ট অনুপাতে রিসাইজ হবে।
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#14231c] mb-1">
                        পূর্ণ নাম (Full Name)*:
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        placeholder="যেমন: মো. আশরাফুল ইসলাম"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#14231c] mb-1">
                        কাঙ্ক্ষিত পদবি / টাইটেল (Title / Designation):
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.designationOrTitle || ''}
                        onChange={(e) => updatePersonalInfo('designationOrTitle', e.target.value)}
                        placeholder="যেমন: অফিসার (আইটি) / সহকারী শিক্ষক"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        পিতার নাম (Father's Name):
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.fatherName}
                        onChange={(e) => updatePersonalInfo('fatherName', e.target.value)}
                        placeholder="পিতার নাম"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        মাতার নাম (Mother's Name):
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.motherName}
                        onChange={(e) => updatePersonalInfo('motherName', e.target.value)}
                        placeholder="মাতার নাম"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        জন্ম তারিখ (Date of Birth):
                      </label>
                      <input
                        type="date"
                        value={cvData.personalInfo.dateOfBirth}
                        onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        লিঙ্গ (Gender):
                      </label>
                      <select
                        value={cvData.personalInfo.gender}
                        onChange={(e) => updatePersonalInfo('gender', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      >
                        <option value="পুরুষ">পুরুষ (Male)</option>
                        <option value="মহিলা">মহিলা (Female)</option>
                        <option value="অন্যান্য">অন্যান্য (Other)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        বৈবাহিক অবস্থা:
                      </label>
                      <select
                        value={cvData.personalInfo.maritalStatus}
                        onChange={(e) => updatePersonalInfo('maritalStatus', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      >
                        <option value="অবিবাহিত">অবিবাহিত (Single)</option>
                        <option value="বিবাহিত">বিবাহিত (Married)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        রক্তের গ্রুপ:
                      </label>
                      <select
                        value={cvData.personalInfo.bloodGroup || 'B+'}
                        onChange={(e) => updatePersonalInfo('bloodGroup', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        জাতীয়তা (Nationality):
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.nationality}
                        onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
                        placeholder="বাংলাদেশি"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        ধর্ম (Religion):
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.religion}
                        onChange={(e) => updatePersonalInfo('religion', e.target.value)}
                        placeholder="যেমন: ইসলাম, হিন্দু"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#14231c] mb-1">
                        জাতীয় পরিচয়পত্র নং (NID):
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.nationalId || ''}
                        onChange={(e) => updatePersonalInfo('nationalId', e.target.value)}
                        placeholder="১০, ১৩ বা ১৭ ডিজিটের NID"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        মোবাইল নম্বর*:
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        placeholder="০১৭১২-৩৪৫৬৭৮"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#14231c] mb-1">
                        ইমেইল ঠিকানা*:
                      </label>
                      <input
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#14231c] mb-1">
                        বর্তমান ঠিকানা (Present Address)*:
                      </label>
                      <textarea
                        rows={2}
                        value={cvData.personalInfo.presentAddress}
                        onChange={(e) => updatePersonalInfo('presentAddress', e.target.value)}
                        placeholder="বাসা, রোড, এলাকা, ডাকঘর, জেলা"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#14231c] mb-1">
                        স্থায়ী ঠিকানা (Permanent Address)*:
                      </label>
                      <textarea
                        rows={2}
                        value={cvData.personalInfo.permanentAddress}
                        onChange={(e) => updatePersonalInfo('permanentAddress', e.target.value)}
                        placeholder="গ্রাম/মহল্লা, ডাকঘর, থানা/উপজেলা, জেলা"
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#14231c] mb-1">
                        ক্যারিয়ার অবজেক্টিভ / উদ্দেশ্য (Career Objective):
                      </label>
                      <textarea
                        rows={3}
                        value={cvData.personalInfo.careerObjective || ''}
                        onChange={(e) => updatePersonalInfo('careerObjective', e.target.value)}
                        placeholder="প্রতিষ্ঠানের লক্ষ্য ও নিজের লক্ষ্য সংক্ষেপে লিখুন..."
                        className="w-full px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Education Dynamic List */}
              {activeFormTab === 'education' && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#083f2a]">
                      শিক্ষাগত যোগ্যতার তালিকা ({cvData.education.length} টি)
                    </span>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="px-2.5 py-1 bg-[#0c5c3d] text-white text-xs font-medium flex items-center gap-1 hover:bg-[#083f2a] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ডিগ্রি যোগ করুন</span>
                    </button>
                  </div>

                  {cvData.education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="p-3 bg-[#fcfaf5] border border-[#d8cfb8] relative space-y-2.5"
                    >
                      <div className="flex justify-between items-center border-b border-[#e8e0cc] pb-1.5">
                        <span className="font-bold text-[#083f2a]">
                          #{idx + 1}. {edu.degree || 'নতুন ডিগ্রি'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="text-[#c8342a] hover:text-red-800 p-1 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[#6b6255] mb-0.5">পরীক্ষা / ডিগ্রি:</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="যেমন: এস.এস.সি / বি.এসসি"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[#6b6255] mb-0.5">প্রতিষ্ঠান / বিশ্ববিদ্যালয়:</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[#6b6255] mb-0.5">বোর্ড / বিভাগ / বিষয়:</label>
                          <input
                            type="text"
                            value={edu.boardOrMajor || ''}
                            onChange={(e) => updateEducation(edu.id, 'boardOrMajor', e.target.value)}
                            placeholder="যেমন: বিজ্ঞান / কম্পিউটার সায়েন্স"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[#6b6255] mb-0.5">পাসের বছর:</label>
                            <input
                              type="text"
                              value={edu.passingYear}
                              onChange={(e) => updateEducation(edu.id, 'passingYear', e.target.value)}
                              placeholder="যেমন: ২০১৮"
                              className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-[#6b6255] mb-0.5">ফলাফল / GPA:</label>
                            <input
                              type="text"
                              value={edu.result}
                              onChange={(e) => updateEducation(edu.id, 'result', e.target.value)}
                              placeholder="GPA ৫.০০"
                              className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Experience Dynamic List */}
              {activeFormTab === 'experience' && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#083f2a]">
                      কর্ম অভিজ্ঞতার বিবরণী ({cvData.experience.length} টি)
                    </span>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="px-2.5 py-1 bg-[#0c5c3d] text-white text-xs font-medium flex items-center gap-1 hover:bg-[#083f2a] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>অভিজ্ঞতা যোগ করুন</span>
                    </button>
                  </div>

                  {cvData.experience.length === 0 && (
                    <div className="p-4 text-center text-[#6b6255] border border-dashed border-[#d8cfb8] bg-[#fcfaf5]">
                      কোনো কর্ম অভিজ্ঞতা যোগ করা হয়নি (ফ্রেশার হলে এটি খালি রাখতে পারেন)।
                    </div>
                  )}

                  {cvData.experience.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-3 bg-[#fcfaf5] border border-[#d8cfb8] space-y-2.5"
                    >
                      <div className="flex justify-between items-center border-b border-[#e8e0cc] pb-1.5">
                        <span className="font-bold text-[#083f2a]">
                          #{idx + 1}. {exp.designation || 'পদবি লিখুন'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="text-[#c8342a] hover:text-red-800 p-1 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[#6b6255] mb-0.5">পদবি (Designation):</label>
                          <input
                            type="text"
                            value={exp.designation}
                            onChange={(e) => updateExperience(exp.id, 'designation', e.target.value)}
                            placeholder="যেমন: সিনিয়র এক্সিকিউটিভ"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[#6b6255] mb-0.5">প্রতিষ্ঠান (Company):</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="যেমন: এবিসি লিমিটেড, ঢাকা"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#6b6255] mb-0.5">সময়কাল (Duration):</label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                            placeholder="যেমন: ২০২১ - বর্তমান অথবা জানুয়ারি ২০২০ - মার্চ ২০২২"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#6b6255] mb-0.5">দায়িত্বসমূহ (Responsibilities):</label>
                          <textarea
                            rows={2}
                            value={exp.responsibilities}
                            onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)}
                            placeholder="কাজের সংক্ষিপ্ত বিবরণ বা পয়েন্ট..."
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: Skills & Languages */}
              {activeFormTab === 'skills' && (
                <div className="space-y-5 text-xs">
                  {/* Skills Section */}
                  <div>
                    <label className="block font-bold text-[#083f2a] mb-1.5">
                      দক্ষতাসমূহ (Skills & Competencies):
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="যেমন: এমএস এক্সেল, দ্রুত টাইপিং..."
                        className="flex-1 px-3 py-1.5 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-1.5 bg-[#0c5c3d] text-white font-medium hover:bg-[#083f2a] transition-colors cursor-pointer"
                      >
                        যোগ করুন
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 p-2 bg-[#fcfaf5] border border-[#d8cfb8] min-h-[48px]">
                      {cvData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-[#083f2a] px-2 py-1 border border-[#d8cfb8] flex items-center gap-1.5"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(idx)}
                            className="text-[#c8342a] hover:text-red-800 cursor-pointer text-xs font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-bold text-[#083f2a]">
                        ভাষাগত দক্ষতা (Languages):
                      </label>
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="text-[11px] text-[#0c5c3d] font-bold hover:underline cursor-pointer"
                      >
                        + ভাষা যোগ করুন
                      </button>
                    </div>

                    <div className="space-y-2">
                      {cvData.languages.map((lang) => (
                        <div
                          key={lang.id}
                          className="flex gap-2 items-center bg-[#fcfaf5] p-2 border border-[#d8cfb8]"
                        >
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                            placeholder="ভাষার নাম (বাংলা/ইংরেজি)"
                            className="w-1/2 px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                          <input
                            type="text"
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                            placeholder="দক্ষতার মাত্রা (সাবলীল/মাতৃভাষা)"
                            className="flex-1 px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => removeLanguage(lang.id)}
                            className="text-[#c8342a] hover:text-red-800 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: References */}
              {activeFormTab === 'references' && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#083f2a]">
                      রেফারেন্স ও প্রত্যয়নকারী ({cvData.references.length} টি)
                    </span>
                    <button
                      type="button"
                      onClick={addReference}
                      className="px-2.5 py-1 bg-[#0c5c3d] text-white text-xs font-medium flex items-center gap-1 hover:bg-[#083f2a] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>রেফারেন্স যোগ করুন</span>
                    </button>
                  </div>

                  {cvData.references.map((ref, idx) => (
                    <div
                      key={ref.id}
                      className="p-3 bg-[#fcfaf5] border border-[#d8cfb8] space-y-2.5"
                    >
                      <div className="flex justify-between items-center border-b border-[#e8e0cc] pb-1.5">
                        <span className="font-bold text-[#083f2a]">
                          #{idx + 1}. {ref.name || 'নতুন রেফারেন্স'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeReference(ref.id)}
                          className="text-[#c8342a] hover:text-red-800 p-1 cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[#6b6255] mb-0.5">নাম:</label>
                          <input
                            type="text"
                            value={ref.name}
                            onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                            placeholder="রেফারেন্স ব্যক্তির নাম"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[#6b6255] mb-0.5">পদবি:</label>
                          <input
                            type="text"
                            value={ref.designation}
                            onChange={(e) => updateReference(ref.id, 'designation', e.target.value)}
                            placeholder="যেমন: অধ্যাপক / ম্যানেজার"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[#6b6255] mb-0.5">প্রতিষ্ঠান:</label>
                          <input
                            type="text"
                            value={ref.organization}
                            onChange={(e) => updateReference(ref.id, 'organization', e.target.value)}
                            placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[#6b6255] mb-0.5">মোবাইল:</label>
                          <input
                            type="text"
                            value={ref.phone}
                            onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                            placeholder="০১৭১১-০০০০০০"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[#6b6255] mb-0.5">ইমেইল:</label>
                          <input
                            type="email"
                            value={ref.email}
                            onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                            placeholder="person@example.com"
                            className="w-full px-2.5 py-1 bg-white border border-[#d8cfb8] focus:border-[#0c5c3d] focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live A4 Preview (7 cols on large screen) */}
          <div
            className={`lg:col-span-7 ${
              mobileView === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Live Preview Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#f4efe4] border border-[#d8cfb8] mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0c5c3d]"></span>
                <span className="font-bold text-[#083f2a]">লাইভ A4 প্রিভিউ</span>
                <span className="text-[#6b6255]">
                  ({language === 'bn' ? 'বাংলা সংস্করণ' : 'English Edition'})
                </span>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="px-2.5 py-1 bg-[#0c5c3d] text-white hover:bg-[#083f2a] transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF সেভ করুন</span>
              </button>
            </div>

            {/* A4 Document Container */}
            <div className="overflow-x-auto bg-[#e5e0d3] p-2 sm:p-4 border border-[#d8cfb8] flex justify-center">
              <div
                id="cv-print-area"
                className="w-full max-w-[210mm] bg-white shadow-md border border-[#d1d5db]"
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights & Guidelines */}
        <div className="mt-12 pt-6 border-t border-[#d8cfb8] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#6b6255]">
          <div className="bg-[#fffdf7] p-4 border border-[#d8cfb8]">
            <h3 className="font-bold text-sm text-[#083f2a] font-serif mb-1">
              ১০০% ক্লায়েন্ট-সাইড প্রাইভেসি
            </h3>
            <p className="leading-relaxed">
              আপনার ছবি, জন্মতারিখ, এনআইডি নম্বর বা কোনো তথ্যই সার্ভারে পাঠানো হয় না। সবকিছু তাৎক্ষণিকভাবে আপনার ব্রাউজারের মেমোরিতেই প্রক্রিয়াজাত ও সংরক্ষিত হয়।
            </p>
          </div>
          <div className="bg-[#fffdf7] p-4 border border-[#d8cfb8]">
            <h3 className="font-bold text-sm text-[#083f2a] font-serif mb-1">
              প্রিন্ট ও PDF নির্দেশিকা
            </h3>
            <p className="leading-relaxed">
              "PDF / প্রিন্ট করুন" বাটনে ক্লিক করে প্রিন্ট ডায়ালগ থেকে 'Destination' অপশনে <strong>"Save as PDF"</strong> এবং পেপার সাইজে <strong>"A4"</strong> সিলেক্ট করুন।
            </p>
          </div>
          <div className="bg-[#fffdf7] p-4 border border-[#d8cfb8]">
            <h3 className="font-bold text-sm text-[#083f2a] font-serif mb-1">
              বাংলাদেশি চাকরির প্রমিত ফরম্যাট
            </h3>
            <p className="leading-relaxed">
              সরকারি চাকুরির সার্কুলার অনুযায়ী ক্রমিক নং ফরম্যাট, সাধারণ ফরমাল ফরম্যাট এবং বেসরকারি কর্পোরেট পদের জন্য আধুনিক দুই কলাম লেআউট অন্তর্ভুক্ত।
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
