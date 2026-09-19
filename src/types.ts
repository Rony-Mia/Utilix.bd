export type ToolCategory = 'all' | 'text' | 'image' | 'calculator' | 'document';

export interface ToolItem {
  id: string;
  refCode: string;
  title: string;
  description: string;
  feature: string;
  category: ToolCategory;
  status: 'active' | 'coming_soon';
  version?: string;
  link?: string;
}

export type ConversionMode = 'bijoy_to_unicode' | 'unicode_to_bijoy';

export interface PresetProfile {
  id: string;
  name: string;
  org: string;
  width: number;
  height: number;
  maxSizeKb: number;
  format: 'jpeg' | 'png' | 'webp';
  aspectRatio: string;
  description: string;
}

export type CvLanguage = 'bn' | 'en';

export type CvSectionId =
  | 'header'
  | 'objective'
  | 'education'
  | 'experience'
  | 'skills'
  | 'personalDetails'
  | 'languages'
  | 'references'
  | 'declaration';

export interface PersonalInfo {
  fullName: string;
  designationOrTitle?: string;
  photoUrl?: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  nationalId?: string;
  bloodGroup?: string;
  phone: string;
  email: string;
  presentAddress: string;
  permanentAddress: string;
  linkedinOrWebsite?: string;
  careerObjective?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  passingYear: string;
  result: string;
  boardOrMajor?: string;
}

export interface ExperienceItem {
  id: string;
  designation: string;
  company: string;
  duration: string;
  responsibilities: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  designation: string;
  organization: string;
  phone: string;
  email: string;
}

export interface CvData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  languages: LanguageItem[];
  references: ReferenceItem[];
}

