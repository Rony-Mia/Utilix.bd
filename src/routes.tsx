import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { ConverterPage } from './pages/ConverterPage.tsx';
import { PhotoResizerPage } from './pages/PhotoResizerPage.tsx';
import { AgeCalculatorPage } from './pages/AgeCalculatorPage.tsx';
import { AmountInWordsPage } from './pages/AmountInWordsPage.tsx';
import { CvBuilderPage } from './pages/CvBuilderPage.tsx';
import { GpaCalculatorPage } from './pages/GpaCalculatorPage.tsx';
import { PdfMergerPage } from './pages/PdfMergerPage.tsx';
import { PdfSplitPage } from './pages/PdfSplitPage.tsx';
import { PdfDeletePagesPage } from './pages/PdfDeletePagesPage.tsx';
import { PdfRotatePage } from './pages/PdfRotatePage.tsx';
import { PdfWatermarkPage } from './pages/PdfWatermarkPage.tsx';
import { ImageMergerPage } from './pages/ImageMergerPage.tsx';
import { BackgroundRemoverPage } from './pages/BackgroundRemoverPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';

export const PRERENDER_ROUTES = [
  '/',
  '/converter',
  '/photo-resizer',
  '/background-remover',
  '/image-merger',
  '/age-calculator',
  '/amount-in-words',
  '/cv-builder',
  '/gpa-calculator',
  '/pdf-merger',
  '/pdf-split',
  '/pdf-delete-pages',
  '/pdf-rotate',
  '/pdf-watermark-page-number',
  '/about',
  '/contact',
  '/privacy-policy',
] as const;

export interface AppRoutesProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenTerms?: () => void;
}

export function AppRoutes({
  selectedCategory = 'all',
  onSelectCategory = () => {},
  onOpenTerms = () => {},
}: AppRoutesProps) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            onOpenTerms={onOpenTerms}
          />
        }
      />
      <Route path="/converter" element={<ConverterPage />} />
      <Route path="/photo-resizer" element={<PhotoResizerPage />} />
      <Route path="/background-remover" element={<BackgroundRemoverPage />} />
      <Route path="/image-merger" element={<ImageMergerPage />} />
      <Route path="/age-calculator" element={<AgeCalculatorPage />} />
      <Route path="/amount-in-words" element={<AmountInWordsPage />} />
      <Route path="/cv-builder" element={<CvBuilderPage />} />
      <Route path="/gpa-calculator" element={<GpaCalculatorPage />} />
      <Route path="/pdf-merger" element={<PdfMergerPage />} />
      <Route path="/pdf-split" element={<PdfSplitPage />} />
      <Route path="/pdf-delete-pages" element={<PdfDeletePagesPage />} />
      <Route path="/pdf-rotate" element={<PdfRotatePage />} />
      <Route path="/pdf-watermark-page-number" element={<PdfWatermarkPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

