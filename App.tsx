import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { SmartEditPanel } from './components/SmartEditPanel';
import { ImagePreview } from './components/ImagePreview';
import { EditingSuite } from './components/EditingSuite';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { TabSwitcher } from './components/TabSwitcher';
import { Footer } from './components/Footer';
import { translateTextIfNeeded, generateImage, editImage } from './services/geminiService';
import type { Settings, ImageSizeOption, ImageStyleOption, ResolutionOption, LightingOption, CameraAngleOption } from './types';
import { STYLES, IMAGE_SIZES, RESOLUTION_OPTIONS, LIGHTING_OPTIONS, CAMERA_ANGLES } from './constants';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const AppContent: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
    const { t, language } = useLanguage();

    useEffect(() => {
        let objectUrl: string | null = null;
        if (uploadedImage) {
            objectUrl = URL.createObjectURL(uploadedImage);
            setUploadedImagePreview(objectUrl);
        } else {
            setUploadedImagePreview(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [uploadedImage]);

    const handleTabChange = (tab: 'generate' | 'edit') => {
        setActiveTab(tab);
        // Reset states when switching tabs for a clean slate
        setError(null);
        setGeneratedImage(null);
        setUploadedImage(null);
        setEditedImage(null);
        setBeforeImage(null);
    }

    const handleGenerate = useCallback(async (settings: Settings) => {
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const basePrompt = settings.prompt;
            const translatedPrompt = await translateTextIfNeeded(basePrompt, language);

            const styleOption = STYLES.find(s => s.value === settings.style) as ImageStyleOption;
            const sizeOption = IMAGE_SIZES.find(s => s.value === settings.size) as ImageSizeOption;
            const resolutionOption = RESOLUTION_OPTIONS.find(q => q.value === settings.resolution) as ResolutionOption;
            const lightingOption = LIGHTING_OPTIONS.find(l => l.value === settings.lighting) as LightingOption;
            const cameraAngleOption = CAMERA_ANGLES.find(c => c.value === settings.cameraAngle) as CameraAngleOption;

            let styleDescription = styleOption.description;
            if (settings.pixarMode) {
                styleDescription = 'Pixar movie style, cinematic lens depth, rich warm color tones, stylized depth of field, expressive characters';
            }

            const finalPrompt = `${translatedPrompt}. Style: ${styleDescription}. Lighting: ${lightingOption.promptFragment}. Camera Angle: ${cameraAngleOption.promptFragment}${resolutionOption.promptSuffix}.`;
            
            const imageBase64 = await generateImage(finalPrompt, sizeOption.aspectRatio);
            setGeneratedImage(`data:image/jpeg;base64,${imageBase64}`);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Generation failed: ${errorMessage}. Please try adjusting your prompt or settings.`);
        } finally {
            setIsLoading(false);
        }
    }, [language]);
    
    const handleEdit = useCallback(async (file: File, prompt: string) => {
        setIsEditing(true);
        setEditedImage(null);
        setError(null);
        const dataUrl = await fileToDataUrl(file);
        setBeforeImage(dataUrl);

        try {
            const translatedPrompt = await translateTextIfNeeded(prompt, language);
            const resultDataUrl = await editImage(dataUrl, translatedPrompt);
            setEditedImage(resultDataUrl);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Edit failed: ${errorMessage}. Please try adjusting your prompt or try another image.`);
        } finally {
            setIsEditing(false);
        }
    }, [language]);
    
    const currentLoadingState = isLoading || isEditing;
    const finalImage = activeTab === 'generate' ? generatedImage : editedImage;

    return (
        <div className="min-h-screen font-sans flex flex-col">
            <div className="relative isolate flex-grow p-4 md:p-8">
                <Header />
                
                <main className="container mx-auto mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2">
                            <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />
                            <div className="glassmorphism p-6 space-y-6 rounded-b-2xl">
                                {activeTab === 'generate' ? (
                                    <SettingsPanel onGenerate={handleGenerate} isLoading={isLoading} />
                                ) : (
                                    <SmartEditPanel 
                                        onEdit={handleEdit} 
                                        isLoading={isEditing} 
                                        uploadedImage={uploadedImage}
                                        onFileUpload={setUploadedImage}
                                    />
                                )}
                            </div>
                             {error && (
                                <div className="mt-4 glassmorphism border-red-500/50 text-red-200 px-4 py-3" role="alert">
                                    <strong className="font-bold">{t('errorTitle')} </strong>
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-3 space-y-8">
                            {editedImage && beforeImage ? (
                                <BeforeAfterSlider before={beforeImage} after={editedImage} />
                            ) : (
                                <ImagePreview 
                                    image={activeTab === 'generate' ? generatedImage : uploadedImagePreview} 
                                    isLoading={currentLoadingState}
                                    activeTab={activeTab}
                                />
                            )}
                           {finalImage && !currentLoadingState && (
                               <div className="animate-fade-in-up">
                                   <EditingSuite 
                                        imageSrc={finalImage}
                                   />
                               </div>
                           )}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}


const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
};

export default App;
