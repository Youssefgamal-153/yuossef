import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations, TranslationKeys } from '../lib/translations';

type LanguageCode = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface Language {
    code: LanguageCode;
    name: string;
    flag: string;
    dir: Direction;
}

export const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

interface LanguageContextType {
    language: LanguageCode;
    changeLanguage: (lang: LanguageCode) => void;
    t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): LanguageCode => {
    if (typeof window !== 'undefined') {
        const storedLang = localStorage.getItem('language') as LanguageCode;
        if (storedLang && LANGUAGES.some(l => l.code === storedLang)) {
            return storedLang;
        }

        const browserLang = navigator.language.split('-')[0] as LanguageCode;
        if (LANGUAGES.some(l => l.code === browserLang)) {
            return browserLang;
        }
    }
    return 'en';
};


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);

    useEffect(() => {
        const selectedLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
        document.documentElement.lang = selectedLang.code;
        document.documentElement.dir = selectedLang.dir;
        localStorage.setItem('language', selectedLang.code);
    }, [language]);

    const changeLanguage = (lang: LanguageCode) => {
        setLanguage(lang);
    };

    const t = useCallback((key: TranslationKeys): string => {
        // FIX: The type of `key` can be inferred as `string | number`, causing a type error. Explicitly converting the result to a string ensures the function's return type is always `string`.
        return String(translations[language]?.[key] || translations['en'][key] || key);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};