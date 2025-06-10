// Code Complete Review: 20240815120000
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlan } from '../types';
import { geminiService, isGeminiClientInitialized } from '../services/geminiService';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { APP_ROUTES } from '../constants';
import AppLogo from '../components/Common/AppLogo';

// --- Icons ---
const PaintBrushIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Generate Image</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a15.995 15.995 0 00-4.764 4.648l-3.876 5.814a1.151 1.151 0 001.597 1.597l5.814-3.875a15.995 15.995 0 004.648-4.763z" />
    </svg>
);
const SparklesIcon = ({ className = "w-5 h-5 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Generate</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l-2.846-.813a4.5 4.5 0 00-3.09-3.09L9 1.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 9l-2.846.813a4.5 4.5 0 00-3.09 3.09L9 15.75l.813-2.846a4.5 4.5 0 003.09-3.09L15.75 7.5z" />
    </svg>
);
const DownloadIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Download</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
const ExclamationTriangleIcon = ({ className = "w-6 h-6 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Warning</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const ImageGeneratorPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [geminiAvailable, setGeminiAvailable] = useState(isGeminiClientInitialized());

    React.useEffect(() => {
        setGeminiAvailable(isGeminiClientInitialized());
    }, []);

    if (!user || (user.plan !== UserPlan.PREMIUM && user.plan !== UserPlan.PREMIUM_ULTRA2)) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 p-8 text-center">
                <ExclamationTriangleIcon className="text-yellow-500 dark:text-yellow-400 w-16 h-16 mb-6" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Premium Feature</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                    The AI Image Generator is available for Premium and Premium Ultra2 users.
                </p>
                <Button onClick={() => navigate(APP_ROUTES.PRICING)} variant="primary" size="lg">
                    Upgrade Your Plan
                </Button>
                <Link to={APP_ROUTES.CHAT} className="mt-4 text-sm text-primary hover:underline dark:text-blue-400">
                    Back to Chat
                </Link>
            </div>
        );
    }

    if (!geminiAvailable) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 p-8 text-center">
                <ExclamationTriangleIcon className="text-red-500 dark:text-red-400 w-16 h-16 mb-6" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">AI Service Unavailable</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                    The Image Generation service cannot be initialized. This might be due to a missing API key or network issues.
                </p>
                <Link to={APP_ROUTES.CHAT} className="text-sm text-primary hover:underline dark:text-blue-400">
                    Back to Chat
                </Link>
            </div>
        );
    }

    const handleGenerateImage = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate an image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        try {
            const response = await geminiService.generateImageFromPrompt(prompt);
            if (response && response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                setGeneratedImageUrl(`data:image/jpeg;base64,${base64ImageBytes}`);
            } else {
                setError('No image was generated. The AI might not have understood the prompt or encountered an issue.');
            }
        } catch (err: any) {
            console.error("Error generating image:", err);
            setGeneratedImageUrl(null); // Clear previous image on new error
            setError(`Failed to generate image: ${err.message || 'An unknown error occurred.'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadImage = () => {
        if (generatedImageUrl) {
            const link = document.createElement('a');
            link.href = generatedImageUrl;
            link.download = `ai-generated-${prompt.substring(0,20).replace(/\s+/g, '_') || 'image'}-${Date.now()}.jpeg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const imageAltText = prompt 
        ? `AI generated image for prompt: ${prompt.substring(0, 70)}${prompt.length > 70 ? '...' : ''}` 
        : "AI Generated Image";

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="w-full max-w-3xl">
                <header className="text-center mb-10">
                    <PaintBrushIcon className="mx-auto mb-4 w-16 h-16 text-primary dark:text-blue-400" />
                    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                        AI Image Generator
                    </h1>
                    <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                        Transform your ideas into stunning visuals. Powered by Imagen 3.
                    </p>
                </header>

                <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/60 rounded-xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
                    <div className="mb-6">
                        <label htmlFor="image-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Describe the image you want to create:
                        </label>
                        <textarea
                            id="image-prompt"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A futuristic cityscape at sunset with flying cars, photorealistic"
                            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:border-primary outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        onClick={handleGenerateImage}
                        isLoading={isLoading}
                        disabled={isLoading || !prompt.trim()}
                        className="w-full text-lg py-3"
                        variant="primary"
                        leftIcon={<SparklesIcon />}
                    >
                        {isLoading ? 'Generating Your Masterpiece...' : 'Generate Image'}
                    </Button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-md text-sm text-red-700 dark:text-red-300" role="alert">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="text-red-500 dark:text-red-400 h-5 w-5" />
                                <span className="ml-2">{error}</span>
                            </div>
                        </div>
                    )}
                </div>

                {isLoading && (
                    <div className="mt-10 text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-3 text-slate-500 dark:text-slate-400">Generating image, please wait...</p>
                    </div>
                )}

                {generatedImageUrl && !isLoading && (
                    <div className="mt-10 bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/60 rounded-xl p-4 md:p-6 border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 text-center">Your Generated Image</h2>
                        <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg aspect-square flex items-center justify-center">
                            <img
                                src={generatedImageUrl}
                                alt={imageAltText}
                                className="max-w-full max-h-full object-contain rounded-md shadow-md"
                                style={{ maxHeight: '60vh' }}
                            />
                        </div>
                        <div className="mt-5 flex justify-center">
                            <Button
                                onClick={handleDownloadImage}
                                variant="outline"
                                size="md"
                                leftIcon={<DownloadIcon />}
                            >
                                Download Image
                            </Button>
                        </div>
                    </div>
                )}

                {!generatedImageUrl && !isLoading && !error && (
                     <div className="mt-10 text-center p-6 bg-slate-200/50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-400 dark:border-slate-600">
                        <AppLogo className="w-32 h-auto mx-auto opacity-50 mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">
                            Your generated image will appear here.
                        </p>
                    </div>
                )}
                
                <div className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
                    <p>Image generation by AI. Results may vary. Please ensure your prompts are appropriate and adhere to usage guidelines.</p>
                    <p className="mt-1">This feature uses the <strong>Imagen 3</strong> model. API usage limits may apply in a real-world scenario.</p>
                </div>

                <div className="mt-8 text-center">
                    <Link to={APP_ROUTES.CHAT} className="text-sm font-medium text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    &larr; Back to Chat
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ImageGeneratorPage;
