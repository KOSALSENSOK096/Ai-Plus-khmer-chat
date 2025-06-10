// Code Complete Review: 20240816100000
import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useAuth } from '../hooks/useAuth';
import { UserPlan } from '../types';
import { GEMINI_CHAT_MODEL, APP_ROUTES } from '../constants';
import { isGeminiClientInitialized as isGlobalGeminiClientInitialized } from '../services/geminiService';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import AppLogo from '../components/Common/AppLogo';
import { fileToGenerativePart } from '../utils/fileUtils';

// --- Icons ---
const DocumentArrowDownIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>File Conversion</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 9.75-7.5 9.75S4.5 17.642 4.5 10.5C4.5 6.211 7.815 3 12 3s7.5 3.211 7.5 7.5z" /> {/* Simplified document shape */}
    </svg>
);

const SparklesIcon = ({ className = "w-5 h-5 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Process/Convert</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 7.5l-2.846-.813a4.5 4.5 0 00-3.09-3.09L9 1.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 9l-2.846.813a4.5 4.5 0 00-3.09 3.09L9 15.75l.813-2.846a4.5 4.5 0 003.09-3.09L15.75 7.5z" />
    </svg>
);
const ExclamationTriangleIcon = ({ className = "w-6 h-6 mr-2" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Warning</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
const InformationCircleIcon = ({ className = "w-5 h-5 mr-1.5 flex-shrink-0" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <title>Information</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);


const FileConverterPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [aiInstance, setAiInstance] = useState<GoogleGenAI | null>(null);
    const [isAiInitialized, setIsAiInitialized] = useState(false);
    const [initializationError, setInitializationError] = useState<string | null>(null);

    // PDF to Word State
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isConvertingPdf, setIsConvertingPdf] = useState(false);
    const [pdfResult, setPdfResult] = useState<string | null>(null);

    // Image to Text State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isExtractingImageText, setIsExtractingImageText] = useState(false);
    const [imageTextResult, setImageTextResult] = useState<string | null>(null);

    // Text Refiner State
    const [textToRefine, setTextToRefine] = useState('');
    const [isRefiningText, setIsRefiningText] = useState(false);
    const [refinedTextResult, setRefinedTextResult] = useState<string | null>(null);

    const [generalError, setGeneralError] = useState<string | null>(null);

    useEffect(() => {
        if (isGlobalGeminiClientInitialized()) {
            try {
                const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
                if (!apiKey) {
                    throw new Error("API_KEY environment variable is not set. File conversion AI features will be unavailable.");
                }
                const instance = new GoogleGenAI({ apiKey });
                setAiInstance(instance);
                setIsAiInitialized(true);
                setInitializationError(null);
            } catch (e: any) {
                console.error("Failed to initialize GoogleGenAI for File Converter:", e);
                const errorMsg = `Failed to initialize AI service: ${e.message || 'Unknown Error'}. AI-powered features on this page will be unavailable.`;
                setInitializationError(errorMsg);
                setGeneralError(errorMsg); 
                setIsAiInitialized(false);
            }
        } else {
            const errorMsg = "Gemini AI Service is not globally initialized. AI-powered features on this page will be unavailable.";
            setInitializationError(errorMsg);
            setGeneralError(errorMsg);
            setIsAiInitialized(false);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'pdf') {
            if (file.type !== 'application/pdf') {
                setGeneralError('Please select a PDF file.');
                return;
            }
            setPdfFile(file);
            setPdfResult(null);
        } else if (type === 'image') {
            if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
                setGeneralError('Please select a JPG, PNG, WEBP, or GIF image file.');
                return;
            }
            setImageFile(file);
            setImageTextResult(null);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
        setGeneralError(null);
    };

    const handlePdfToWord = () => {
        if (!pdfFile) {
            setGeneralError('Please select a PDF file first.');
            return;
        }
        setIsConvertingPdf(true);
        setPdfResult(null);
        setGeneralError(null);

        setTimeout(() => {
            const mockContent = `[SIMULATED WORD DOCUMENT OUTPUT FOR: ${pdfFile.name}]

[TITLE]Mock Document Converted from ${pdfFile.name}[/TITLE]

[H1]Main Heading (Simulated)[/H1]
[P]This is a simulated paragraph in English. It represents text that would be extracted from your PDF and formatted into a paragraph. The goal of this simulation is to show how the 'original form' might be conceptually retained, including aspects like language and basic structure.[/P]

[P_KM]នេះគឺជាកថាខណ្ឌក្លែងក្លាយជាភាសាខ្មែរ។ វាតំណាងឱ្យអត្ថបទដែលនឹងត្រូវបានដកស្រង់ចេញពី PDF របស់អ្នក ហើយរៀបចំជាកថាខណ្ឌ។ គោលបំណងនៃការក្លែងក្លាយនេះគឺដើម្បីបង្ហាញពីរបៀបដែល 'ទម្រង់ដើម' អាចត្រូវបានរក្សាទុកតាមលក្ខណៈគោលគំនិត រួមទាំងទិដ្ឋភាពដូចជាភាសា និងរចនាសម្ព័ន្ធមូលដ្ឋាន។[/P_KM]

[H2]Sub-heading (Simulated)[/H2]
[LIST_UL]
  [LI]Simulated unordered list item 1.[/LI]
  [LI_KM]ចំណុចបញ្ជីគ្មានលំដាប់ក្លែងក្លាយទី២ ជាភាសាខ្មែរ។[/LI_KM]
  [LI]Simulated item with [B]bold text[/B] and [I]italic text[/I].[/LI]
[/LIST_UL]

[TABLE_START]
  [CAPTION]Simulated Table Caption[/CAPTION]
  [TR_HEADER][TH]Header 1 (EN)[/TH][TH_KM]បឋមបទ ២ (ខ្មែរ)[/TH][TH]Header 3[/TH][/TR_HEADER]
  [TR][TD]Data A1[/TD][TD_KM]ទិន្នន័យ ក២[/TD_KM][TD]Data A3[/TD][/TR]
  [TR_KM][TD_KM]ទិន្នន័យ ខ១[/TD_KM][TD]Data B2 (EN)[/TD][TD_KM]ទិន្នន័យ ខ៣[/TD_KM][/TR_KM]
[/TABLE_START]

[HR_SEPARATOR]

[DISCLAIMER]
IMPORTANT: This is a SIMULATED conversion.
The content above uses pseudo-tags (e.g., [P], [H1], [TABLE_START]) to represent structural elements from a PDF.
This tool demonstrates the concept of converting a PDF, particularly one with Khmer and/or English text,
to a Word-like format with an emphasis on retaining the original structure and text without loss.
This frontend demonstration generates a placeholder text (.txt) file to illustrate the user flow and intended outcome.
It does NOT contain the actual converted content from your PDF.
For AI assistance with text *copied* from a PDF (e.g., for cleaning up OCR errors), please use the 'Khmer Text Refiner' tool.
[/DISCLAIMER]

[FOOTER_INFO]Simulated conversion timestamp: ${new Date().toLocaleString()}[/FOOTER_INFO]
`;
            setPdfResult(mockContent);
            setIsConvertingPdf(false);
        }, 1500);
    };
    
    const downloadTxtFile = (filename: string, content: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
    };

    const handleImageToText = async () => {
        if (!imageFile || !aiInstance || !isAiInitialized) {
            setGeneralError(!imageFile ? 'Please select an image file.' : 'AI service not available for Image to Text.');
            return;
        }
        setIsExtractingImageText(true);
        setImageTextResult(null);
        setGeneralError(null);

        try {
            const imagePart = await fileToGenerativePart(imageFile);
            const textPart = { text: "Extract all text from this image, paying special attention to any Khmer script. If no text is found, state that clearly. If Khmer text is found, prioritize its accurate extraction." };
            
            const response: GenerateContentResponse = await aiInstance.models.generateContent({
                model: GEMINI_CHAT_MODEL, 
                contents: { parts: [imagePart, textPart] },
                config: GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17' ? { thinkingConfig: { thinkingBudget: 0 } } : undefined,
            });

            setImageTextResult(response.text || "No text could be extracted from the image, or the AI returned an empty response.");
        } catch (err: any) {
            console.error("Error extracting text from image:", err);
            setGeneralError(`Failed to extract text: ${err.message || 'An unknown error occurred.'}`);
            setImageTextResult(null);
        } finally {
            setIsExtractingImageText(false);
        }
    };

    const handleRefineText = async () => {
        if (!textToRefine.trim() || !aiInstance || !isAiInitialized) {
            setGeneralError(!textToRefine.trim() ? 'Please paste some Khmer text to refine.' : 'AI service not available for Text Refiner.');
            return;
        }
        setIsRefiningText(true);
        setRefinedTextResult(null);
        setGeneralError(null);

        const prompt = `The following Khmer text was likely copied from a PDF and might have formatting issues, OCR errors, or awkward phrasing. Please analyze it, correct any obvious errors, improve its structure for readability, and reformat it into clean paragraphs if possible. Return only the refined Khmer text. If the input text is not primarily Khmer or is too short to refine meaningfully, indicate that. Input text: """${textToRefine}""" Refined text:`;

        try {
            const response: GenerateContentResponse = await aiInstance.models.generateContent({
                model: GEMINI_CHAT_MODEL,
                contents: prompt,
                config: GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17' ? { thinkingConfig: { thinkingBudget: 0 } } : undefined,
            });
            setRefinedTextResult(response.text || "AI could not refine the text or returned an empty response.");
        } catch (err: any) {
            console.error("Error refining text:", err);
            setGeneralError(`Failed to refine text: ${err.message || 'An unknown error occurred.'}`);
            setRefinedTextResult(null);
        } finally {
            setIsRefiningText(false);
        }
    };

    const actionButtonTextPdf = "Start Mock Conversion to Word"; 

    const renderSection = (
        sectionTitle: string, 
        inputType: 'pdf' | 'image' | 'textarea',
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        fileName: string | null,
        onAction: () => void,
        isLoading: boolean,
        actionButtonText: string, 
        result: string | null,
        downloadFileName?: string,
        acceptType?: string,
        textareaValue?: string,
        onTextareaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
        inputPlaceholder?: string,
        disclaimer?: string,
        children?: React.ReactNode,
        isAiDependentFeature: boolean = true,
        userPlan?: UserPlan, 
        isPremiumFeature?: boolean 
    ) => {
        const isFreeUserOnPremiumFeature = isAiDependentFeature && isPremiumFeature && userPlan === UserPlan.FREE;
        const isInputDisabled = isLoading || (isAiDependentFeature && !isAiInitialized) || isFreeUserOnPremiumFeature;
        const isActionButtonReallyDisabled = isLoading || 
                                     (inputType !== 'textarea' && !fileName && !children) || 
                                     (inputType === 'textarea' && !textareaValue?.trim()) ||
                                     (isAiDependentFeature && !isAiInitialized) ||
                                     isFreeUserOnPremiumFeature;
        
        let dynamicActionButtonTitle = actionButtonText;
        if (isAiDependentFeature && !isAiInitialized) {
            dynamicActionButtonTitle = "AI Service Unavailable";
        } else if (isFreeUserOnPremiumFeature) {
            dynamicActionButtonTitle = "This is a Premium feature. Please upgrade.";
        } else if (isLoading) {
            dynamicActionButtonTitle = "Processing...";
        } else if (inputType !== 'textarea' && !fileName && !children) {
            dynamicActionButtonTitle = "Please select a file first.";
        } else if (inputType === 'textarea' && !textareaValue?.trim()) {
            dynamicActionButtonTitle = "Please enter some text.";
        }


        return (
            <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2 flex items-center">
                    {inputType === 'pdf' ? '📄' : inputType === 'image' ? '🖼️' : '✏️'} <span className="ml-2">{sectionTitle}</span>
                </h2>
                {disclaimer && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md text-sm text-blue-700 dark:text-blue-300 flex items-start">
                        <InformationCircleIcon className="text-blue-500 dark:text-blue-400 mt-0.5" />
                        <p dangerouslySetInnerHTML={{ __html: disclaimer }}></p>
                    </div>
                )}
                
                {inputType === 'textarea' ? (
                    <textarea
                        rows={6}
                        value={textareaValue}
                        onChange={onTextareaChange}
                        placeholder={inputPlaceholder || "Paste Khmer text here..."}
                        className="w-full p-3 mb-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:border-primary outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-y font-khmer"
                        disabled={isInputDisabled}
                        aria-label="Text input for refinement"
                    />
                ) : (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Select {inputType === 'pdf' ? 'PDF' : 'Image (JPG/PNG/WEBP/GIF)'} file:
                        </label>
                        <input
                            type="file"
                            accept={acceptType}
                            onChange={onFileChange}
                            className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 dark:file:bg-blue-600/30 file:text-primary dark:file:text-blue-300 hover:file:bg-primary/20 dark:hover:file:bg-blue-500/40 disabled:opacity-50"
                            disabled={isInputDisabled}
                        />
                        {fileName && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Selected: {fileName}</p>}
                    </div>
                )}

                {children} 

                {(isAiDependentFeature && !isAiInitialized) && (
                   <div className="mt-3 p-2.5 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600 rounded-md text-xs text-amber-700 dark:text-amber-300 flex items-center">
                       <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                       <span>AI Service Unavailable. This tool requires AI to function.</span>
                   </div>
                )}

                {isFreeUserOnPremiumFeature && (
                    <div className="mt-3 p-2.5 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-md text-xs text-yellow-700 dark:text-yellow-300 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                        <div>
                            This is a Premium feature. Please{' '}
                            <Link to={APP_ROUTES.PRICING} className="font-semibold hover:underline">upgrade your plan</Link>
                            {' '}to use this tool.
                        </div>
                    </div>
                )}


                <Button
                    onClick={onAction}
                    isLoading={isLoading}
                    disabled={isActionButtonReallyDisabled}
                    className="w-full text-md py-2.5 mt-2"
                    variant="primary"
                    leftIcon={<SparklesIcon />}
                    title={isActionButtonReallyDisabled ? dynamicActionButtonTitle : actionButtonText}
                >
                    {actionButtonText}
                </Button>

                {isLoading && isAiDependentFeature && (
                    <div className="mt-3 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                        <LoadingSpinner size="sm" className="mr-2" />
                        AI is processing... Please wait.
                    </div>
                )}


                {result && (
                    <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-600">
                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">Result:</h3>
                        <pre className={`p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto ${inputType === 'image' || inputType === 'textarea' ? 'font-khmer' : ''}`}>{result}</pre>
                        {downloadFileName && (
                            <Button onClick={() => downloadTxtFile(downloadFileName, result)} variant="outline" size="sm" className="mt-3">
                                Download as .txt
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    };


    if (!user) { 
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 p-8 text-center">
                <ExclamationTriangleIcon className="text-yellow-500 dark:text-yellow-400 w-16 h-16 mb-6" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Access Denied</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                    You need to be logged in to access File Conversion Tools.
                </p>
                <Button onClick={() => navigate(APP_ROUTES.LOGIN)} variant="primary" size="lg">
                    Login
                </Button>
            </div>
        );
    }
    
    if (initializationError && !isAiInitialized && generalError === initializationError) { 
         return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 p-8 text-center">
                <ExclamationTriangleIcon className="text-red-500 dark:text-red-400 w-16 h-16 mb-6" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">AI Service Unavailable</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                    {initializationError}
                </p>
                <Link to={APP_ROUTES.CHAT} className="text-sm text-primary hover:underline dark:text-blue-400">
                    Back to Chat
                </Link>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
                <DocumentArrowDownIcon className="mx-auto mb-4 w-16 h-16 text-primary dark:text-blue-400" />
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                    File Conversion Tools
                </h1>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Utilities for document and image processing. Some features are simulated or use AI for text extraction/refinement.
                </p>
            </header>

            {generalError && generalError !== initializationError && ( 
                <div className="mb-6 max-w-3xl mx-auto p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-md text-sm text-red-700 dark:text-red-300 flex items-center" role="alert">
                    <ExclamationTriangleIcon className="text-red-500 dark:text-red-400 h-5 w-5 mr-2 flex-shrink-0" />
                    {generalError}
                </div>
            )}

            <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-3xl mx-auto">
                {renderSection(
                    "PDF to Word (Khmer/English - Simulated Format Retention)",
                    "pdf",
                    (e) => handleFileChange(e, 'pdf'),
                    pdfFile?.name || null,
                    handlePdfToWord,
                    isConvertingPdf,
                    actionButtonTextPdf,
                    pdfResult,
                    pdfFile ? `mock_word_from_${pdfFile.name.split('.')[0]}.txt` : 'mock_word_file.txt',
                    ".pdf",
                    undefined,
                    undefined,
                    undefined,
                    "This is a <strong>simulated</strong> PDF to Word conversion. It aims to demonstrate the concept of converting PDF files (especially those with Khmer or English text) while <em>attempting to retain the original format and text without loss</em>. However, due to browser limitations, it <strong>does not produce an actual DOCX file with perfect formatting</strong>. It generates a mock text (.txt) file with placeholder text to illustrate the flow. For AI assistance with text <em>copied</em> from a PDF (e.g., cleaning up OCR errors), please use the 'Khmer Text Refiner' tool below.",
                    undefined,
                    false, // isAiDependentFeature
                    user?.plan,
                    false // isPremiumFeature
                )}

                {renderSection(
                    "Image (JPG/PNG/WEBP/GIF) to Text (Khmer Focus)",
                    "image",
                    (e) => handleFileChange(e, 'image'),
                    imageFile?.name || null,
                    handleImageToText,
                    isExtractingImageText,
                    "Extract Text from Image (AI)",
                    imageTextResult,
                    imageFile ? `text_from_${imageFile.name.split('.')[0]}.txt` : 'extracted_image_text.txt',
                    "image/jpeg, image/png, image/webp, image/gif",
                    undefined,
                    undefined,
                    undefined,
                    "Upload an image. The AI will attempt to extract text, with a focus on Khmer script. The result is plain text, not a formatted Word document. This tool extracts text content. For a full 'Image to Word' conversion with formatting, specialized OCR and document reconstruction software (often backend) would be needed.",
                    imagePreview ? <img src={imagePreview} alt="Preview" className="my-3 max-h-48 w-auto mx-auto rounded-md border border-slate-300 dark:border-slate-600" /> : null,
                    true, // isAiDependentFeature
                    user?.plan,
                    true // isPremiumFeature
                )}
                
                {renderSection(
                    "Khmer Text Refiner (e.g., from PDF copy-paste)",
                    "textarea",
                    () => {}, 
                    null, 
                    handleRefineText,
                    isRefiningText,
                    "Refine Khmer Text with AI",
                    refinedTextResult,
                    'refined_khmer_text.txt',
                    undefined, 
                    textToRefine,
                    (e) => setTextToRefine(e.target.value),
                    "Paste Khmer text copied from a PDF here. The AI will try to analyze, correct, and reformat it.",
                    "Paste Khmer text (e.g., copied from a PDF that didn't convert well) into the area below. The AI will attempt to analyze, correct common OCR errors, and reformat it for better readability. This can help 'solve problems' with difficult Khmer text from PDFs by making it more usable.",
                    undefined, 
                    true, // isAiDependentFeature
                    user?.plan,
                    true // isPremiumFeature
                )}
            </div>
            
             <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
                <p>Note: True file format conversion (e.g., PDF to DOCX with perfect layout for Khmer and English, retaining original form without missing anything) is complex and typically requires dedicated backend services or specialized software, which are beyond the scope of this frontend demonstration.</p>
                <p className="mt-1">These tools use AI for text-based tasks or simulate conversion flows.</p>
            </div>

            <div className="mt-10 text-center">
                <Link to={APP_ROUTES.CHAT} className="text-sm font-medium text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    &larr; Back to Chat
                </Link>
            </div>
        </div>
    );
};

export default FileConverterPage;