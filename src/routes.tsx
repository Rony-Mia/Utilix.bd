import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { ConverterPage } from './pages/ConverterPage.tsx';
import { PhotoResizerPage } from './pages/PhotoResizerPage.tsx';
import { AgeCalculatorPage } from './pages/AgeCalculatorPage.tsx';
import { AmountInWordsPage } from './pages/AmountInWordsPage.tsx';
import { CvBuilderPage } from './pages/CvBuilderPage.tsx';
import { GpaCalculatorPage } from './pages/GpaCalculatorPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';

export const PRERENDER_ROUTES = [
  '/',
  '/converter',
  '/photo-resizer',
  '/age-calculator',
  '/amount-in-words',
  '/cv-builder',
  '/gpa-calculator',
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
      <Route path="/age-calculator" element={<AgeCalculatorPage />} />
      <Route path="/amount-in-words" element={<AmountInWordsPage />} />
      <Route path="/cv-builder" element={<CvBuilderPage />} />
      <Route path="/gpa-calculator" element={<GpaCalculatorPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

