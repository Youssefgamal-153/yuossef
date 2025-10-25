import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface TabSwitcherProps {
    activeTab: 'generate' | 'edit';
    onTabChange: (tab: 'generate' | 'edit') => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
    const { t } = useLanguage();
    
    const getButtonClasses = (tab: 'generate' | 'edit') => {
        const base = 'flex-1 py-3 px-4 text-center font-bold transition-all duration-300 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500';
        if (activeTab === tab) {
            return `${base} bg-white/5 text-white`;
        }
        return `${base} bg-black/20 text-gray-400 hover:bg-white/5`;
    };

    return (
        <div className="flex bg-black/20 rounded-t-lg overflow-hidden border-b border-white/10">
            <button className={getButtonClasses('generate')} onClick={() => onTabChange('generate')}>
                ✨ {t('createTabTitle')}
            </button>
            <button className={getButtonClasses('edit')} onClick={() => onTabChange('edit')}>
                🖌️ {t('editTabTitle')}
            </button>
        </div>
    );
};
