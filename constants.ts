import type { ImageSizeOption, ImageStyleOption, ResolutionOption, LightingOption, CameraAngleOption } from './types';

export const STYLES: ImageStyleOption[] = [
    { value: 'Cinematic', description: 'A cinematic shot with dramatic lighting and high detail' },
    { value: 'Photorealistic', description: 'A photorealistic image, indistinguishable from a real photo' },
    { value: 'Anime', description: 'Japanese anime style, vibrant and detailed, like a frame from a modern anime film' },
    { value: 'Fantasy', description: 'Epic fantasy concept art, detailed, imaginative, with magical elements' },
    { value: 'Cartoon', description: 'A stylized cartoon look, fun and expressive' },
    { value: 'Drawing', description: 'A beautiful pencil or ink drawing with fine lines' },
    { value: 'Dramatic', description: 'A dramatic, high-contrast image with deep shadows' },
    { value: 'Vintage', description: 'A vintage photo look, like an old film photograph' },
    { value: 'Pixar', description: 'Pixar movie style, friendly and expressive 3D characters' },
];

export const IMAGE_SIZES: ImageSizeOption[] = [
    { value: 'square', aspectRatio: '1:1' },
    { value: 'widescreen', aspectRatio: '16:9' },
    { value: 'portrait', aspectRatio: '9:16' },
    { value: 'standard', aspectRatio: '4:3' },
    { value: 'wide', aspectRatio: '3:4' },
    { value: 'cinema', aspectRatio: '21:9' },
];

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
    { value: 'hd', promptSuffix: ', HD, high detail' },
    { value: '2k', promptSuffix: ', 2K resolution, highly detailed' },
    { value: '4k', promptSuffix: ', 4K resolution, ultra-detailed, sharp focus' },
    { value: '8k', promptSuffix: ', 8K resolution, masterpiece, photorealistic, ultra-high-resolution' },
];

export const LIGHTING_OPTIONS: LightingOption[] = [
    { value: 'cinematic', promptFragment: 'cinematic lighting' },
    { value: 'dramatic', promptFragment: 'dramatic lighting, high contrast' },
    { value: 'golden_hour', promptFragment: 'warm golden hour lighting' },
    { value: 'studio', promptFragment: 'professional studio lighting' },
    { value: 'neon', promptFragment: 'cyberpunk neon lighting' },
];

export const CAMERA_ANGLES: CameraAngleOption[] = [
    { value: 'eye_level', promptFragment: 'eye-level shot' },
    { value: 'high_angle', promptFragment: 'high-angle shot' },
    { value: 'low_angle', promptFragment: 'low-angle shot from below' },
    { value: 'dutch_angle', promptFragment: 'dutch angle, tilted frame' },
    { value: 'wide_shot', promptFragment: 'epic wide shot' },
];
