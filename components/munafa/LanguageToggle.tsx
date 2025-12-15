/**
 * LanguageToggle Component - Munafa OS
 * Cycles through available languages on click
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { useLanguage, type Language } from '@/lib/contexts/LanguageContext';

export interface LanguageToggleProps {
  /** Size of the toggle button */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
}

const languageLabels: Record<Language, string> = {
  en: 'EN',
  hi: 'हिं',
  hinglish: 'HG',
};

export function LanguageToggle({ size = 'md', className }: LanguageToggleProps) {
  const { language, setLanguage, languages } = useLanguage();

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  return (
    <button
      onClick={cycleLanguage}
      className={cn(
        // Size
        sizeStyles[size],
        // Shape
        'rounded-full',
        // Background
        'bg-input-bg hover:bg-input-bg-hover',
        // Layout
        'flex items-center justify-center',
        // Text
        'font-semibold text-text-secondary',
        // Transition
        'transition-all duration-200',
        // Focus
        'focus:outline-none focus:ring-2 focus:ring-brand-primary/50',
        // Active
        'active:scale-95',
        className
      )}
      aria-label={`Current language: ${language}. Click to change.`}
    >
      {languageLabels[language]}
    </button>
  );
}

export default LanguageToggle;
