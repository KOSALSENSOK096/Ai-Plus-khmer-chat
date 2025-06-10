// Code Complete Review: 20240815120000
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useLocation, useNavigate } from 'react-router-dom'; 
import { GEMINI_CHAT_MODEL, APP_ROUTES } from '@/constants'; 
import { isGeminiClientInitialized as isGlobalGeminiClientInitialized } from '@/services/geminiService'; 
import Button from '@/components/Common/Button';
import Modal from '@/components/Common/Modal'; 
import AppLogo from '@/components/Common/AppLogo'; 

// --- Icons ---
const CodeBracketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>;
const ArrowPathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChatBubbleOvalLeftEllipsisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M18.683 8.942S17.414 7.5 15.004 7.5c-2.41 0-3.682 1.442-3.682 1.442m2.844 5.986S17.414 17.5 15.004 17.5c-2.41 0-3.682-1.442-3.682-1.442m0-9.152a5.625 5.625 0 00-5.625 5.625v3.375c0 .907.487 1.714 1.288 2.146 1.055.568 2.37.854 3.837.854 1.467 0 2.782-.286 3.837-.854.801-.432 1.288-1.239 1.288-2.146V12a5.625 5.625 0 00-5.625-5.625H12M4.5 12H3m18 0h-1.5" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;

const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Copy</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
  </svg>
);

const CopiedIcon = ({ className = "w-4 h-4 text-accent" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <title>Copied</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ClearOutputIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <title>Clear Output</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XMarkIcon = ({ className = "w-4 h-4" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <title>Clear</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const SUPPORTED_LANGUAGES = [
  { id: 'bash', name: 'Bash/Shell' },
  { id: 'csharp', name: 'C#' },
  { id: 'cpp', name: 'C++' },
  { id: 'css', name: 'CSS' },
  { id: 'dart', name: 'Dart (Flutter)' },
  { id: 'go', name: 'Go' },
  { id: 'html', name: 'HTML' },
  { id: 'java', name: 'Java (Android)' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'json', name: 'JSON' },
  { id: 'jsx', name: 'JSX (React)' },
  { id: 'kotlin', name: 'Kotlin (Android)' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'php', name: 'PHP' },
  { id: 'python', name: 'Python' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'rust', name: 'Rust' },
  { id: 'scala', name: 'Scala' },
  { id: 'sql', name: 'SQL' },
  { id: 'swift', name: 'Swift (iOS)' },
  { id: 'tsx', name: 'TSX (React)' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'xml', name: 'XML' },
  { id: 'yaml', name: 'YAML' },
  { id: 'text', name: 'Plain Text' },
].sort((a, b) => {
  if (a.name === 'Plain Text') return 1; 
  if (b.name === 'Plain Text') return -1;
  return a.name.localeCompare(b.name);
});

const defaultLanguageId = SUPPORTED_LANGUAGES.find(l => l.id === 'javascript')?.id || SUPPORTED_LANGUAGES[0].id;

interface CodeBotResponse {
    action: "generated" | "analyzed" | "clarification";
    generatedCode?: string | null;
    correctedCode?: string | null;
    explanation: string;
}

const CodePlaygroundPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguageId);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [lineNumbers, setLineNumbers] = useState('1');
  
  const [aiInstance, setAiInstance] = useState<GoogleGenAI | null>(null);
  const [isAiInitialized, setIsAiInitialized] = useState(false);

  const [isPredictingOutput, setIsPredictingOutput] = useState(false);
  const [predictedOutputContent, setPredictedOutputContent] = useState<string | null>(null);
  const [isPredictedOutputModalOpen, setIsPredictedOutputModalOpen] = useState(false);
  const [predictOutputError, setPredictOutputError] = useState<string | null>(null);

  const [isResultModalOpen, setIsResultModalOpen] = useState(false); 
  const [resultModalContent, setResultModalContent] = useState('');
  const [resultModalTitle, setResultModalTitle] = useState('');
  const [isAutoRunLoading, setIsAutoRunLoading] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showResetConfirmationModal, setShowResetConfirmationModal] = useState(false);


  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (isGlobalGeminiClientInitialized()) {
      try {
        const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;
        if (!apiKey) {
            throw new Error("API_KEY environment variable is not set or 'process' object is unavailable. Playground AI features will be unavailable.");
        }
        const instance = new GoogleGenAI({ apiKey });
        setAiInstance(instance);
        setIsAiInitialized(true);
        setInitializationError(null); 
      } catch (e: any) {
        console.error("Failed to initialize GoogleGenAI for Playground:", e);
        const errorMsg = `Failed to initialize AI service for Playground: ${e.message || 'Unknown Error'}. Please check API Key configuration and console. Code execution and CodeBot features will be unavailable.`;
        setInitializationError(errorMsg);
        setOutput(errorMsg); 
        setIsAiInitialized(false);
      }
    } else {
      const errorMsg = "Gemini AI Service is not globally initialized. Playground AI features will be unavailable. Check API Key configuration and console for details.";
      setInitializationError(errorMsg);
      setOutput(errorMsg); 
      setIsAiInitialized(false);
    }
  }, []);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 100)}px`; 
      syncScroll();
    }
  }, [syncScroll]);

  const updateLineNumbers = useCallback((codeContent: string) => {
    const lines = codeContent.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1).join('\n'));
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  useEffect(() => {
    updateLineNumbers(code);
  }, [code, updateLineNumbers]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
  };

  const performAutoRunFromChat = useCallback(async (codeToRun: string, langToRun?: string) => {
    if (!aiInstance || !isAiInitialized) {
      setResultModalTitle("AI Service Error");
      setResultModalContent("AI service not available. Cannot run code from chat.");
      setIsResultModalOpen(true);
      return;
    }

    setIsAutoRunLoading(true);
    setCode(codeToRun); 
    const effectiveLang = langToRun || SUPPORTED_LANGUAGES.find(l => l.id === 'text')?.id || 'text';
    setSelectedLanguage(effectiveLang); 
    setResultModalTitle("Execution Result from Chat");

    const prompt = `You are a code execution simulator.
Given the following ${SUPPORTED_LANGUAGES.find(l => l.id === effectiveLang)?.name || effectiveLang} code, please provide the standard output as if it were run in a terminal.
If the code is incomplete, produces no direct output (e.g., UI rendering), or is not executable, please explain what the code does or would do.
If the code has syntax errors, point them out.

Code:
\`\`\`${effectiveLang}
${codeToRun}
\`\`\`

Simulated Output or Explanation:`;

    try {
      const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: GEMINI_CHAT_MODEL,
        contents: prompt,
        config: GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17' ? { thinkingConfig: { thinkingBudget: 0 } } : undefined,
      });
      setResultModalContent(response.text);
    } catch (e: any) {
      console.error("Error auto-running code from chat:", e);
      setResultModalContent(`Failed to get execution response from AI: ${e.message || 'Unknown error'}`);
    } finally {
      setIsAutoRunLoading(false);
      setIsResultModalOpen(true);
    }
  }, [aiInstance, isAiInitialized]); 
  
  useEffect(() => {
    const navState = location.state as { initialCode?: string; initialLanguage?: string; autoRunFromChat?: boolean } | undefined;
    if (navState?.autoRunFromChat && navState.initialCode && aiInstance && isAiInitialized) {
      performAutoRunFromChat(navState.initialCode, navState.initialLanguage);
      navigate('.', { replace: true, state: {} }); 
    }
  }, [location.state, navigate, aiInstance, isAiInitialized, performAutoRunFromChat]);


  const handleRunCode = async () => {
    if (!aiInstance || !isAiInitialized) {
      setError("AI service not available for Playground. Cannot run code.");
      return;
    }
    if (!code.trim()) {
      setOutput("Nothing to run. Editor is empty.");
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput('');

    const prompt = `You are a code execution simulator.
Given the following ${SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage)?.name || selectedLanguage} code, please provide the standard output as if it were run in a terminal.
If the code is incomplete, produces no direct output (e.g., UI rendering), or is not executable, please explain what the code does or would do.
If the code has syntax errors, point them out.

Code:
\`\`\`${selectedLanguage}
${code}
\`\`\`

Simulated Output or Explanation:`;

    try {
      const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: GEMINI_CHAT_MODEL,
        contents: prompt,
        config: GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17' ? { thinkingConfig: { thinkingBudget: 0 } } : undefined,
      });
      setOutput(response.text);
    } catch (e: any) {
      console.error("Error running code via AI:", e);
      setError(`Failed to get execution response from AI. ${e.message || ''}`);
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowExpectedOutput = async () => {
    if (!aiInstance || !isAiInitialized) {
      setPredictOutputError("AI service not available. Cannot predict output.");
      setIsPredictedOutputModalOpen(true);
      return;
    }
    if (!code.trim()) {
      setPredictedOutputContent("Editor is empty. Enter some code to predict its output.");
      setPredictOutputError(null);
      setIsPredictedOutputModalOpen(true);
      return;
    }

    setIsPredictingOutput(true);
    setPredictOutputError(null);
    setPredictedOutputContent(null);

    const prompt = `You are an expert code execution predictor.
Given the following ${SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage)?.name || selectedLanguage} code, predict its standard output or primary outcome if it were executed.
If the code would result in an error, describe the error.
If the code has no direct textual output (e.g., UI rendering, library definition), briefly explain its purpose or what it would achieve.

Code:
\`\`\`${selectedLanguage}
${code}
\`\`\`

Predicted Output or Explanation:`;

    try {
      const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: GEMINI_CHAT_MODEL,
        contents: prompt,
        config: GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17' ? { thinkingConfig: { thinkingBudget: 0 } } : undefined,
      });
      setPredictedOutputContent(response.text);
    } catch (e: any) {
      console.error("Error predicting code output:", e);
      setPredictOutputError(`Failed to get prediction from AI: ${e.message || 'Unknown error'}`);
    } finally {
      setIsPredictingOutput(false);
      setIsPredictedOutputModalOpen(true);
    }
  };
  
  const handleCodeBot = async () => {
    if (!aiInstance || !isAiInitialized) {
      setError("AI service not available for Playground. Cannot use CodeBot.");
      return;
    }
    if (!code.trim()) {
      setOutput("CodeBot: Editor is empty. Please provide some code for analysis or describe what code you need.");
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput('');

    const languageName = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage)?.name || selectedLanguage;
    const prompt = `You are CodeBot, an expert coding assistant. The user has provided input in the editor for the language: ${languageName}.
Your goal is to be as helpful as possible. Analyze the user's input and determine the best course of action:

1.  If the input appears to be a description, a question, or a request to generate code:
    *   Generate the requested code in ${languageName}.
    *   Respond with a JSON object:
        {
          "action": "generated",
          "generatedCode": "THE_GENERATED_CODE_STRING_HERE (ensure it's just the code, no markdown backticks unless the language is markdown itself)",
          "explanation": "A brief explanation of the generated code, or any clarifications if needed."
        }
    *   If you cannot generate code (e.g., request is unclear, too broad, not a coding task), respond with:
        {
          "action": "clarification",
          "generatedCode": null,
          "explanation": "Your explanation or clarifying questions for the user."
        }

2.  If the input appears to be existing code that needs analysis, correction, or explanation:
    *   Analyze the code. Identify errors, suggest improvements, or explain it.
    *   Provide a corrected version if applicable.
    *   Respond with a JSON object:
        {
          "action": "analyzed",
          "correctedCode": "THE_CORRECTED_CODE_STRING_HERE_OR_ORIGINAL_IF_NO_CHANGES (ensure it's just the code, no markdown backticks unless the language is markdown itself)",
          "explanation": "Your detailed analysis of the code, errors found, and corrections made. When detailing errors or suggestions, if applicable, refer to line numbers or specific code segments to help the user easily find them in their editor."
        }

User's Input:
\`\`\`${selectedLanguage}
${code}
\`\`\`

Respond with ONLY the JSON object based on your chosen action. Ensure the JSON is well-formed.
The 'generatedCode' and 'correctedCode' fields should contain ONLY the code itself, without any surrounding markdown backticks or language specifiers, unless the language itself is markdown.`;

    const modelConfig: {
        responseMimeType: string;
        thinkingConfig?: { thinkingBudget: number };
    } = {
        responseMimeType: "application/json",
    };

    if (GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17') {
        modelConfig.thinkingConfig = { thinkingBudget: 0 };
    }

    try {
      const response: GenerateContentResponse = await aiInstance.models.generateContent({
        model: GEMINI_CHAT_MODEL,
        contents: prompt,
        config: modelConfig
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^\`\`\`(\w*)?\s*\n?(.*?)\n?\s*\`\`\`$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      try {
        const parsedData = JSON.parse(jsonStr) as CodeBotResponse;
        
        if (!parsedData.action || !parsedData.explanation) {
            throw new Error("AI response missing 'action' or 'explanation' field.");
        }

        let botOutputPrefix = "";
        if (parsedData.action === "generated" && typeof parsedData.generatedCode === 'string') {
            setCode(parsedData.generatedCode); 
            botOutputPrefix = "CodeBot: Code generated and placed in editor.\n\n";
        } else if (parsedData.action === "analyzed" && typeof parsedData.correctedCode === 'string') {
            if (parsedData.correctedCode.trim() !== code.trim()) {
                setCode(parsedData.correctedCode); 
                botOutputPrefix = "CodeBot: Code corrected and updated in editor.\n\n";
            } else {
                 botOutputPrefix = "CodeBot: Code analyzed. No corrections needed or applied to the editor.\n\n";
            }
        } else if (parsedData.action === "clarification") {
            botOutputPrefix = "CodeBot: Clarification needed.\n\n";
        } else if (parsedData.action === "generated" && (parsedData.generatedCode === null || typeof parsedData.generatedCode === 'undefined')) {
            botOutputPrefix = "CodeBot: Could not generate code directly, see explanation.\n\n";
        } else if (parsedData.action === "analyzed" && (parsedData.correctedCode === null || typeof parsedData.correctedCode === 'undefined')) {
             botOutputPrefix = "CodeBot: Code analyzed. Original code remains in editor.\n\n";
        }
        setOutput(botOutputPrefix + parsedData.explanation);

      } catch (jsonParseError: any) {
        console.error("Failed to parse JSON response from CodeBot:", jsonParseError);
        console.error("Raw response from CodeBot:", response.text);
        setError(`CodeBot returned an invalid JSON response. Details: ${jsonParseError.message}`);
        setOutput(`CodeBot Raw Response (JSON parse failed):\n${response.text}`);
      }

    } catch (e: any) {
      console.error("Error with CodeBot analysis:", e);
      setError(`Failed to get analysis from CodeBot. ${e.message || ''}`);
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualReset = () => {
    setCode('');
    setSelectedLanguage(defaultLanguageId); 
    setError(null);
    if (!initializationError) {
        setOutput('');
    } else {
        setOutput(initializationError); 
    }
    setShowResetConfirmationModal(false);
  };

  const handleRequestReset = () => {
    setShowResetConfirmationModal(true);
  };

  const handleClearOutput = () => {
    setOutput('');
    setError(null); 
  };
  
  const handleClearCode = () => {
    setCode('');
    // updateLineNumbers(''); // This will be handled by useEffect on code change
  };


  const handleCopyOutput = () => {
    if (!output || !output.trim() || (initializationError && output === initializationError)) return;
    navigator.clipboard.writeText(output).then(() => {
      setOutputCopied(true);
      setTimeout(() => setOutputCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy output: ', err);
      setError('Failed to copy output. See console for details.');
    });
  };
  
  const handleCopyCode = () => {
    if (!code || !code.trim()) return;
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy code: ', err);
      setError('Failed to copy code. See console for details.');
    });
  };

  const runCodeButtonTitle = !isAiInitialized ? "AI Service Unavailable for Run Code" : isLoading ? "Running..." : "Run Code";
  const codeBotButtonTitle = !isAiInitialized ? "AI Service Unavailable for CodeBot" : isLoading ? "CodeBot is Busy..." : !code.trim() ? "Enter code or describe what to generate" : "CodeBot: Generate / Analyze / Correct";
  const showExpectedOutputButtonTitle = !isAiInitialized ? "AI Service Unavailable for Prediction" : isPredictingOutput ? "Predicting..." : !code.trim() ? "Enter code to predict output" : "Show Expected Output";
  
  const editorPlaceholder = 
    !isAiInitialized && initializationError 
    ? "AI Service unavailable. CodeBot & Run features disabled. Check console for API Key errors." 
    : "Enter your code, or ask CodeBot (e.g., 'Python function for quicksort', 'Explain this JS code', 'Fix errors in my C++ code')...";

  const isOutputEmpty = !output.trim() && !error && !initializationError;
  const clearOutputButtonTitle = isOutputEmpty ? "Output is already empty" : "Clear Output";
  const copyOutputButtonTitle = outputCopied ? "Output Copied!" : "Copy Output";
  const copyCodeButtonTitle = codeCopied ? "Code Copied!" : "Copy Code";
  
  const isClearCodeDisabled = isLoading || !code.trim();
  const clearCodeButtonTitle = isClearCodeDisabled ? (isLoading ? "Cannot clear: AI is busy" : "Editor is already empty") : "Clear code from editor";


  const isClearOutputDisabled = isOutputEmpty || isLoading;
  const isCopyOutputDisabled = isLoading || !output.trim() || (!!initializationError && output === initializationError);
  const isCopyCodeDisabled = isLoading || !code.trim();

  const editorHeaderStyles = "text-lg font-semibold flex items-center justify-between px-3 py-1.5 bg-slate-700/80 dark:bg-slate-700/80 border-b border-slate-600 dark:border-slate-600 rounded-t-md h-12 flex-shrink-0";
  const outputHeaderStyles = "text-lg font-semibold flex items-center justify-between px-3 py-1.5 bg-slate-700/80 dark:bg-slate-700/80 border-b border-slate-600 dark:border-slate-600 rounded-t-md h-12 flex-shrink-0";
  const paneFooterStyles = "p-3 bg-slate-800 border-t border-slate-700 h-16 flex items-center flex-shrink-0 rounded-b-md";

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-sans">
      <header className="flex items-center justify-between p-2.5 bg-slate-800 border-b border-slate-700 h-14 flex-shrink-0">
        <div className="flex items-center">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(APP_ROUTES.CHAT)} 
                className="!px-2 !py-1.5 mr-2"
                title="Back to Chat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Chat
            </Button>
            <span className="text-slate-500 mx-1">|</span>
            <h1 className="text-xl font-semibold text-slate-100 ml-2 flex items-center">
                <CodeBracketIcon /> Code Playground
            </h1>
        </div>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(APP_ROUTES.HOME)}
            leftIcon={<HomeIcon/>}
            title="Go to Homepage"
        >
            Home
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden p-2 space-x-2">
        {/* Editor Pane */}
        <div className="w-1/2 flex flex-col border border-slate-700 rounded-md shadow-lg bg-slate-800">
          <div className={editorHeaderStyles}>
            <h2 className="text-slate-100">Editor</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-slate-600 border border-slate-500 rounded-md pl-3 pr-8 py-1 text-sm text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-slate-500 transition-colors"
                  aria-label="Select language"
                  disabled={!isAiInitialized && !!initializationError}
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                title={copyCodeButtonTitle}
                aria-label={copyCodeButtonTitle}
                disabled={isCopyCodeDisabled}
                className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-600 rounded-md ${isCopyCodeDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {codeCopied ? <CopiedIcon /> : <CopyIcon />}
              </button>
              <button
                onClick={handleClearCode}
                title={clearCodeButtonTitle}
                aria-label="Clear code from editor"
                disabled={isClearCodeDisabled}
                className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-600 rounded-md ${isClearCodeDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <XMarkIcon />
              </button>
              <button
                onClick={handleRequestReset}
                title="Reset Editor, Output & Language"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-600 rounded-md"
              >
                <ArrowPathIcon />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden relative bg-slate-800"> 
            <div 
                ref={lineNumbersRef}
                className="p-3 text-right text-slate-500 select-none bg-slate-800/50 overflow-y-auto no-scrollbar w-12 text-sm flex-shrink-0 border-r border-slate-700"
                aria-hidden="true" 
                style={{lineHeight: '1.625rem'}} 
            >
              <pre className="font-mono whitespace-pre">{lineNumbers}</pre>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onScroll={syncScroll}
              className="flex-1 p-3 bg-transparent text-slate-100 font-mono text-sm resize-none outline-none leading-relaxed placeholder-slate-500"
              placeholder={editorPlaceholder}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              wrap="off" 
              style={{ caretColor: '#60A5FA', minHeight: '100px' }} 
              aria-label="Code input area"
              disabled={!isAiInitialized && !!initializationError}
            />
          </div>
          
          <div className={paneFooterStyles}>
            <Button 
                onClick={handleRunCode} 
                isLoading={isLoading && !isPredictingOutput}
                disabled={isLoading || !isAiInitialized || isPredictingOutput || !code.trim()} 
                variant="primary" 
                size="md" 
                leftIcon={<PlayIcon/>}
                title={runCodeButtonTitle}
            >
              Run Code
            </Button>
          </div>
        </div>

        {/* Output Pane */}
        <div className="w-1/2 flex flex-col border border-slate-700 rounded-md shadow-lg bg-slate-800">
          <div className={outputHeaderStyles}>
             <div className="flex items-center">
              <span className="text-blue-400 font-semibold mr-1.5">&gt;_</span>
              <h2 className="text-slate-100">Output</h2>
            </div>
            <div className="flex items-center space-x-1 ml-auto">
               <div className="flex space-x-1.5 mr-2">
                <span className="w-3 h-3 bg-red-500 rounded-full cursor-default" title="Decorative Close"></span>
                <span className="w-3 h-3 bg-yellow-400 rounded-full cursor-default" title="Decorative Minimize"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full cursor-default" title="Decorative Maximize"></span>
              </div>
              <span className="text-xs text-slate-500 uppercase mr-1">TERMINAL</span>
              <button
                onClick={handleClearOutput}
                title={clearOutputButtonTitle}
                aria-label="Clear Output"
                disabled={isClearOutputDisabled}
                className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-600 rounded-md ${isClearOutputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ClearOutputIcon />
              </button>
               <button
                onClick={handleCopyOutput}
                title={copyOutputButtonTitle}
                aria-label={copyOutputButtonTitle}
                disabled={isCopyOutputDisabled}
                className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-600 rounded-md ${isCopyOutputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {outputCopied ? <CopiedIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-800">
            {isLoading && !isPredictingOutput && ( 
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <AppLogo className="w-24 h-24 mb-4 text-primary dark:text-blue-400 opacity-75 animate-pulse" />
                <p className="text-md font-semibold text-slate-400 dark:text-slate-500">AI is working its magic...</p>
                <p className="text-sm text-slate-500 dark:text-slate-600">Please wait a moment.</p>
              </div>
            )}
            {!isLoading && error && ( 
              <div className="text-red-400 text-sm whitespace-pre-wrap font-mono p-3 bg-red-900/30 border border-red-700 rounded-md">
                <div className="flex items-center mb-2">
                    <ExclamationTriangleIcon />
                    <strong className="font-semibold">Error:</strong>
                </div>
                {error}
              </div>
            )}
             {!isLoading && !error && output && (
                 initializationError && output === initializationError ? ( 
                    <div className="text-red-400 text-sm whitespace-pre-wrap font-mono p-3 bg-red-900/30 border border-red-700 rounded-md">
                        <div className="flex items-center mb-2">
                            <ExclamationTriangleIcon />
                            <strong className="font-semibold">AI Service Initialization Error:</strong>
                        </div>
                        {initializationError}
                    </div>
                 ) : (
                    <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono">{output}</pre>
                 )
            )}
            {!isLoading && !error && !output && !initializationError && (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <AppLogo className="w-32 h-auto opacity-30 mb-4" />
                  <p className="text-sm italic">
                    Output will appear here. Enter code and click "Run Code" or use "CodeBot".
                  </p>
              </div>
            )}
          </div>

          <div className={paneFooterStyles + " space-x-3"}>
             <Button 
                onClick={handleShowExpectedOutput} 
                isLoading={isPredictingOutput}
                disabled={isPredictingOutput || isLoading || !isAiInitialized || !code.trim()} 
                variant="outline" 
                size="sm" 
                leftIcon={<EyeIcon/>}
                title={showExpectedOutputButtonTitle}
              >
              Show Expected Output
            </Button>
            <Button 
                onClick={handleCodeBot}
                isLoading={isLoading && !isPredictingOutput} 
                disabled={isLoading || !isAiInitialized || !code.trim() || isPredictingOutput} 
                variant="outline" 
                size="sm" 
                leftIcon={<ChatBubbleOvalLeftEllipsisIcon/>} 
                className={` ${(!isLoading && isAiInitialized && code.trim() && !isPredictingOutput) ? '!text-blue-400 !border-blue-400/50 hover:!bg-blue-900/30 hover:!border-blue-400' : ''}`}
                title={codeBotButtonTitle}
            >
              CodeBot
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title={resultModalTitle || "Result"}
        size="lg"
      >
        {isAutoRunLoading ? (
          <div className="flex flex-col items-center justify-center p-4 min-h-[150px] text-center">
            <AppLogo className="w-20 h-20 mb-3 text-primary dark:text-blue-400 opacity-75 animate-pulse" />
            <p className="text-md font-semibold text-slate-600 dark:text-slate-300">Fetching Result...</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <pre className="text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 p-3 rounded-md whitespace-pre-wrap font-mono">
              {resultModalContent}
            </pre>
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setIsResultModalOpen(false)} variant="primary">
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isPredictedOutputModalOpen}
        onClose={() => setIsPredictedOutputModalOpen(false)}
        title="Predicted Output / Outcome"
        size="lg"
      >
        {isPredictingOutput ? (
          <div className="flex flex-col items-center justify-center p-4 min-h-[150px] text-center">
            <AppLogo className="w-20 h-20 mb-3 text-primary dark:text-blue-400 opacity-75 animate-pulse" />
            <p className="text-md font-semibold text-slate-600 dark:text-slate-300">Predicting Output...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">The AI is analyzing the code.</p>
          </div>
        ) : predictOutputError ? (
            <div className="text-red-500 dark:text-red-400 text-sm whitespace-pre-wrap p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded-md">
                <p className="font-semibold mb-1">Error Predicting Output:</p>
                {predictOutputError}
            </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <pre className="text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 p-3 rounded-md whitespace-pre-wrap font-mono">
              {predictedOutputContent || "No prediction available."}
            </pre>
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setIsPredictedOutputModalOpen(false)} variant="primary">
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showResetConfirmationModal}
        onClose={() => setShowResetConfirmationModal(false)}
        title="Confirm Reset Playground"
        size="md"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Are you sure you want to reset the editor, output, and selected language? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowResetConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleActualReset}>
            Reset Playground
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default CodePlaygroundPage;