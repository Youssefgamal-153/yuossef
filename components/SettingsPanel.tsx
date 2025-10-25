import React, { useState, useRef, useEffect } from 'react';
// FIX: Import the `SpeechRecognition` type.
import type { Settings, SpeechRecognitionEvent, SpeechRecognition } from '../types';
import { STYLES, IMAGE_SIZES, RESOLUTION_OPTIONS, LIGHTING_OPTIONS, CAMERA_ANGLES } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const defaultSettings = {
    prompt: '',
    style: STYLES[0].value,
    size: IMAGE_SIZES[0].value,
    resolution: RESOLUTION_OPTIONS[0].value,
    lighting: LIGHTING_OPTIONS[0].value,
    cameraAngle: CAMERA_ANGLES[0].value,
    pixarMode: false,
};

export const SettingsPanel: React.FC<{ onGenerate: (settings: Settings) => void; isLoading: boolean; }> = ({ onGenerate, isLoading }) => {
    const { t, language } = useLanguage();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isRecording, setIsRecording] = useState(false);
    const [isApiSupported, setIsApiSupported] = useState(true);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const promptBeforeRecording = useRef('');

    useEffect(() => {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            setIsApiSupported(false);
        }

        return () => {
            recognitionRef.current?.abort();
        };
    }, []);


    const handleSettingsChange = (field: keyof Settings, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setSettings(defaultSettings);
    }
    
    const handleToggleRecording = () => {
        if (isLoading) return;
        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setIsApiSupported(false);
            return;
        }
        
        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;

        recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false; 

        promptBeforeRecording.current = settings.prompt;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            handleSettingsChange('prompt', (promptBeforeRecording.current + ' ' + transcript).trim());
        };

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => {
            setIsRecording(false);
            recognitionRef.current = null;
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
            recognitionRef.current = null;
        };
        
        recognition.start();
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings.prompt.trim()) {
            alert(t('alert_enterPrompt'));
            return;
        }
        onGenerate(settings);
    };
    
    const baseInputClasses = "w-full custom-input py-2 px-3 text-gray-200 transition duration-200 text-start";

    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white text-start">{t('createYourImageTitle')}</h2>
                 <button onClick={handleReset} title={t('resetButtonTooltip')} className="text-sm text-gray-400 hover:text-white transition-colors hover:underline">
                    {t('resetButton')}
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2 text-start">📝 {t('promptLabel')}</label>
                    <textarea
                        id="prompt"
                        rows={5}
                        className={`${baseInputClasses} placeholder-gray-500 pr-12`}
                        placeholder={t('promptPlaceholder')}
                        value={settings.prompt}
                        onChange={(e) => handleSettingsChange('prompt', e.target.value)}
                    />
                    {isApiSupported && (
                        <button
                            type="button"
                            onClick={handleToggleRecording}
                            disabled={isLoading}
                            className={`mic-button ${isRecording ? 'mic-recording' : ''}`}
                            title={isRecording ? 'Stop recording' : 'Start voice input'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    )}
                </div>
                {!isApiSupported && (
                    <p className="text-xs text-yellow-500/80 -mt-4 text-center">
                        Voice input is not supported on your device. Please type your prompt instead.
                    </p>
                )}


                <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                    <label htmlFor="pixarMode" className="text-md font-medium text-gray-100 text-start">✨ {t('pixarModeLabel')}</label>
                    <label className="pixar-toggle">
                        <input
                            id="pixarMode"
                            type="checkbox"
                            checked={settings.pixarMode}
                            onChange={(e) => handleSettingsChange('pixarMode', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2 text-start">🎨 {t('styleLabel')}</label>
                        <select
                            id="style"
                            className={baseInputClasses}
                            value={settings.style}
                            onChange={(e) => handleSettingsChange('style', e.target.value)}
                        >
                            {STYLES.map(s => (
                                <option key={s.value} value={s.value}>{t(`style_${s.value.toLowerCase().replace(/\s/g, '')}` as any)}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-2 text-start">📐 {t('sizeLabel')}</label>
                        <select
                            id="size"
                            className={baseInputClasses}
                            value={settings.size}
                            onChange={(e) => handleSettingsChange('size', e.target.value)}
                        >
                            {IMAGE_SIZES.map(s => (
                                <option key={s.value} value={s.value}>{t(`size_${s.value}` as any)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="lighting" className="block text-sm font-medium text-gray-300 mb-2 text-start">💡 {t('lightingLabel')}</label>
                        <select
                            id="lighting"
                            className={baseInputClasses}
                            value={settings.lighting}
                            onChange={(e) => handleSettingsChange('lighting', e.target.value)}
                        >
                            {LIGHTING_OPTIONS.map(l => (
                                <option key={l.value} value={l.value}>{t(`lighting_${l.value}` as any)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="cameraAngle" className="block text-sm font-medium text-gray-300 mb-2 text-start">📷 {t('cameraAngleLabel')}</label>
                        <select
                            id="cameraAngle"
                            className={baseInputClasses}
                            value={settings.cameraAngle}
                            onChange={(e) => handleSettingsChange('cameraAngle', e.target.value)}
                        >
                            {CAMERA_ANGLES.map(c => (
                                <option key={c.value} value={c.value}>{t(`camera_${c.value}` as any)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="resolution" className="block text-sm font-medium text-gray-300 mb-2 text-start">💎 {t('resolutionLabel')}</label>
                    <select
                        id="resolution"
                        className={baseInputClasses}
                        value={settings.resolution}
                        onChange={(e) => handleSettingsChange('resolution', e.target.value)}
                    >
                        {RESOLUTION_OPTIONS.map(q => (
                            <option key={q.value} value={q.value}>{t(`resolution_${q.value}` as any)}</option>
                        ))}
                    </select>
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-on-hover"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('generatingButton')}
                        </>
                    ) : t('generateButton')}
                </button>
            </form>
        </>
    );
};