import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface EditingSuiteProps {
    imageSrc: string;
}

export const EditingSuite: React.FC<EditingSuiteProps> = ({ imageSrc }) => {
    const { t } = useLanguage();
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = 'yg-generated-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
    };

    const handleShare = async () => {
        if (!navigator.share) {
            alert('Web Share API is not supported in your browser.');
            return;
        }

        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            const file = new File([blob], 'yg-generated-image.jpg', { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'YG AI Generated Image',
                    text: 'Check out this image I created with YG AI Image Generator!',
                    files: [file],
                });
                setShareSuccess(true);
                setTimeout(() => setShareSuccess(false), 2000);
            } else {
                 alert("Your browser doesn't support sharing this file type.");
            }
        } catch (error) {
            console.error('Error sharing image:', error);
        }
    };
    
    const baseButtonClasses = "flex items-center justify-center gap-2 w-40 px-4 py-3 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-on-hover";

    return (
        <div className="flex items-center justify-center gap-4 pt-4">
             <button 
                onClick={handleDownload}
                className={`${baseButtonClasses} bg-gray-600/50 hover:bg-gray-700/70 ${downloadSuccess ? 'animate-success-pulse' : ''}`}
                title={t('downloadButtonTooltip')}
            >
                {downloadSuccess ? (
                    <>
                        <span className="text-xl">✔️</span>
                        <span>Downloaded</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <span>Download</span>
                    </>
                )}
            </button>
             <button 
                onClick={handleShare}
                disabled={!navigator.share}
                className={`${baseButtonClasses} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 ${shareSuccess ? 'animate-success-pulse' : ''}`}
                title={t('shareButtonTooltip')}
            >
                 {shareSuccess ? (
                     <>
                        <span className="text-xl">✔️</span>
                        <span>Shared</span>
                    </>
                 ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>
                        <span>Share</span>
                    </>
                 )}
            </button>
        </div>
    );
};
