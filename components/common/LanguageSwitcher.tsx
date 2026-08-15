import React from 'react';
import { useLanguage } from '../../LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/10 dark:bg-slate-800/50 p-1 rounded-full border border-pink-100 dark:border-slate-700">
      <button
        onClick={() => setLanguage('ms')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
          language === 'ms'
            ? 'bg-brand-pink-500 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-brand-pink-500 dark:hover:text-brand-pink-400'
        }`}
      >
        MS
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
          language === 'en'
            ? 'bg-brand-pink-500 text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-brand-pink-500 dark:hover:text-brand-pink-400'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
