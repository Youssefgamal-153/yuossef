import React from 'react';
import { Spinner } from './Spinner';
import { useLanguage } from '../context/LanguageContext';

interface ImagePreviewProps {
    image: string | null;
    isLoading: boolean;
    activeTab: 'generate' | 'edit';
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ image, isLoading, activeTab }) => {
    const { t } = useLanguage();

    const placeholderTitle = activeTab === 'generate' ? t('imagePreviewTitle') : t('imageEditPreviewTitle');
    const placeholderSubtitle = activeTab === 'generate' ? t('imagePreviewSubtitle') : t('imageEditPreviewSubtitle');

    return (
        <div className="relative aspect-video w-full glassmorphism flex items-center justify-center p-2">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-xl z-10">
                    <Spinner />
                    <p className="mt-4 text-lg text-gray-300 animate-pulse">{t('generatingStatus')}</p>
                </div>
            )}
            {!isLoading && !image && (
                 <div className="text-center text-gray-500">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <h3 className="mt-2 text-md font-medium text-gray-400">{placeholderTitle}</h3>
                    <p className="mt-1 text-sm text-gray-500">{placeholderSubtitle}</p>
                </div>
            )}
            {image && !isLoading && (
                 <div className="relative w-full h-full">
                    <img src={image} alt={t('generatedImageAlt')} className="object-contain w-full h-full rounded-lg" />
                 </div>
            )}
        </div>
    );
};
