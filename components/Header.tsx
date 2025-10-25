import React from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

export const Header: React.FC = () => {
    const { t, language, changeLanguage } = useLanguage();

    const handleLanguageToggle = () => {
        const nextLang = language === 'en' ? 'ar' : 'en';
        changeLanguage(nextLang);
    };

    const otherLanguage = LANGUAGES.find(lang => lang.code !== language);

    return (
        <header className="text-center py-4 px-4 relative">
             <div className="absolute top-4 end-4">
                <button
                    onClick={handleLanguageToggle}
                    title={t('languageSwitcherTooltip')}
                    className="flex items-center gap-2 px-3 py-2 glassmorphism transition-all rounded-lg lang-toggle-button"
                >
                    <span>{otherLanguage?.flag}</span>
                    <span className="hidden sm:inline text-gray-300 font-semibold">{otherLanguage?.name}</span>
                </button>
            </div>

            <div className="relative text-6xl md:text-7xl font-extrabold tracking-tighter text-center inline-block">
                <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    YG
                </h1>
                <div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{
                        animation: 'shimmer 4s infinite',
                        backgroundSize: '200% 100%',
                    }}
                ></div>
            </div>

            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                {t('appSubtitle')}
            </p>
        </header>
    );
};