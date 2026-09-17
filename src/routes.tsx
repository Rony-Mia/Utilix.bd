import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { ConverterPage } from './pages/ConverterPage.tsx';
import { PhotoResizerPage } from './pages/PhotoResizerPage.tsx';
import { AgeCalculatorPage } from './pages/AgeCalculatorPage.tsx';
import { AmountInWordsPage } from './pages/AmountInWordsPage.tsx';
import { CvBuilderPage } from './pages/CvBuilderPage.tsx';

export const PRERENDER_ROUTES = [
  '/',
  '/converter',
  '/photo-resizer',
  '/age-calculator',
  '/amount-in-words',
  '/cv-builder',
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

