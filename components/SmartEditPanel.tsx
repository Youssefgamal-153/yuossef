import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SmartEditPanelProps {
    onEdit: (file: File, prompt: string) => void;
    isLoading: boolean;
    uploadedImage: File | null;
    onFileUpload: (file: File | null) => void;
}

export const SmartEditPanel: React.FC<SmartEditPanelProps> = ({ onEdit, isLoading, uploadedImage, onFileUpload }) => {
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileUpload(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, inZone: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoading) return;
        setIsDragging(inZone);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvent(e, false);
        const file = e.dataTransfer.files?.[0] || null;
        onFileUpload(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedImage) {
            alert(t('alert_uploadImage'));
            return;
        }
        if (!prompt.trim()) {
            alert(t('alert_enterEditPrompt'));
            return;
        }
        onEdit(uploadedImage, prompt);
    };

    const baseInputClasses = "w-full custom-input py-2 px-3 text-gray-200 transition duration-200 text-start";
    const uploadedImagePreview = uploadedImage ? URL.createObjectURL(uploadedImage) : null;

    return (
        <>
            <h2 className="text-2xl font-bold text-white text-start">{t('editYourImageTitle')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                    />
                    <div
                        onClick={handleUploadClick}
                        onDragEnter={(e) => handleDragEvent(e, true)}
                        onDragLeave={(e) => handleDragEvent(e, false)}
                        onDragOver={(e) => handleDragEvent(e, true)}
                        onDrop={handleDrop}
                        className={`relative flex justify-center items-center w-full h-32 px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${isDragging ? 'border-purple-400 bg-purple-900/30' : 'border-gray-600 hover:border-gray-500'}`}
                    >
                        {uploadedImagePreview ? (
                            <div className="flex items-center gap-4">
                                <img src={uploadedImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                                <div className="text-start">
                                    <p className="font-semibold text-white truncate max-w-xs">{uploadedImage?.name}</p>
                                    <p className="text-xs text-gray-400">Click to change image</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                <p className="mt-1 text-sm text-gray-300">
                                    <span className="font-semibold text-purple-400">{t('uploadButton')}</span> {t('orDragAndDrop')}
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2 text-start">🎨 {t('editPromptLabel')}</label>
                    <textarea
                        id="edit-prompt"
                        rows={3}
                        className={`${baseInputClasses} placeholder-gray-500`}
                        placeholder={t('editPromptPlaceholder')}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                     <p className="mt-2 text-xs text-gray-400 text-start">{t('editFeatureNote')}</p>
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-on-hover"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('applyingEditButton')}
                        </>
                    ) : t('applyEditButton')}
                </button>
            </form>
        </>
    );
};
