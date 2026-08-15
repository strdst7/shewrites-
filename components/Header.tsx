import React from 'react';
import { Sparkles } from './Icons';
import ThemeSwitcher from './common/ThemeSwitcher';
import LanguageSwitcher from './common/LanguageSwitcher';
import { useLanguage } from '../LanguageContext';

const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="py-6 md:py-8 text-center relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-pink-500" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                {t.title}
            </h1>
            <Sparkles className="w-8 h-8 text-brand-pink-500" />
        </div>
        <p className="mt-2 text-md md:text-lg text-gray-600 dark:text-gray-400">
          {t.subtitle}
        </p>
      </div>
    </header>
  );
};

export default Header;