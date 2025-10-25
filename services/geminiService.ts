import { GoogleGenAI, Modality } from "@google/genai";
import type { AspectRatio } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateTextIfNeeded = async (text: string, language: string): Promise<string> => {
    if (language === 'en' || !text.trim()) {
        return text;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following text to English: "${text}"`,
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error translating text:', error);
        // Fallback to original text if translation fails
        return text;
    }
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error('No image was generated.');
        }
    } catch (error) {
        console.error('Error generating image:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error('Failed to generate image. Please check the prompt or try again later.');
    }
};

export const editImage = async (base64DataUrl: string, prompt: string): Promise<string> => {
    const match = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        throw new Error('Invalid data URL');
    }
    const mimeType = match[1];
    const data = match[2];

    try {
        const imagePart = {
            inlineData: { data, mimeType },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        
        throw new Error('No image was generated in the edit response.');

    } catch (error) {
        console.error('Error editing image:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to edit image: ${error.message}`);
        }
        throw new Error('Failed to edit image. Please check your prompt or try again later.');
    }
};
