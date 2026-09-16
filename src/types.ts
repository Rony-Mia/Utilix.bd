export type ToolCategory = 'all' | 'text' | 'image';

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
