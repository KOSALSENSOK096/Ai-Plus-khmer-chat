// Code Complete Review: 20240815120000
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Part as GenAiPart } from '@google/genai'; // Renamed Part
import { ChatMessage, UserPlan, User, UserSettings, ConversationSettingsSnapshot, SpeechRecognition, InteractionStyle } from '../../types'; // Imported SpeechRecognition & InteractionStyle
import MessageBubble from './MessageBubble'; // Changed to relative path
import Button from '../Common/Button';
import { USER_SETTINGS_KEY, MAX_IMAGE_UPLOADS_PREMIUM, MAX_TOTAL_IMAGE_SIZE_MB_PREMIUM, MAX_IMAGE_UPLOADS_ULTRA2, MAX_TOTAL_IMAGE_SIZE_MB_ULTRA2, MAX_IMAGE_UPLOADS_FREE, MAX_TOTAL_IMAGE_SIZE_MB_FREE, GEMINI_CHAT_MODEL } from '../../constants';
import Input from '../Common/Input'; // Added Input
import { fileToGenerativePart } from '../../utils/fileUtils'; // Import the utility function
import AppLogo from '../Common/AppLogo'; // Import AppLogo for the thinking bubble
import { useTranslation } from '../../hooks/useTranslation'; // Import useTranslation

// --- SVG Icons ---
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <title>Send Message</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        <title>Attach File</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const WrenchScrewdriverIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
      <title>Tools</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.528-1.036.94-2.176 1.027-3.312A5.04 5.04 0 0012 3c-1.312 0-2.533.408-3.525 1.103M11.42 15.17L4.877 21m7.597-2.071L11.42 15.17M3 3h.008v.008H3V3z" />
    </svg>
);

const MicrophoneIcon = ({ className, isListening }: { className?: string, isListening?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className} ${isListening ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`}>
    <title>Microphone</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5h0v-6A6 6 0 0112 6v0a6 6 0 016 6v1.5m-6 7.5h0v-6a6 6 0 00-6-6v0a6 6 0 006 6v6zm0-13.5v-1.5A2.25 2.25 0 0114.25 3h1.5A2.25 2.25 0 0118 5.25v1.5m-6 0h0m-6 0H6A2.25 2.25 0 003.75 7.5H3A2.25 2.25 0 00.75 9.75v1.5A2.25 2.25 0 003 13.5h.75A2.25 2.25 0 006 11.25v-1.5A2.25 2.25 0 003.75 7.5H3v0" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <title>Close</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AIPlusKhmerChatLogoChatPlaceholderSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" className={className} aria-labelledby="chatLogoTitle" aria-describedby="chatLogoDesc">
    <title id="chatLogoTitle">AI Plus Khmer Chat Logo</title>
    <desc id="chatLogoDesc">Logo for AI Plus Khmer Chat: A dark chat bubble with 'AI+' in gradient blue, connected by lines to two colored circles. To the right, 'ខ្មែរ' in light text and 'CHAT' in light blue.</desc>
    <defs>
      <linearGradient id="aiPlusChatLogoGradientBubble" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'rgb(37, 99, 235)', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: 'rgb(96, 165, 250)', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path d="M50 40 C30 40 20 55 20 75 C20 95 30 110 50 110 H90 L100 125 V110 H140 C160 110 170 95 170 75 C170 55 160 40 140 40 Z" fill="#334155"/>
    <text x="95" y="82" fontFamily="Inter, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" fontSize="40" fontWeight="900" fill="url(#aiPlusChatLogoGradientBubble)" textAnchor="middle">AI+</text>
    <line x1="175" y1="75" x2="210" y2="55" stroke="#475569" strokeWidth="2.5"/>
    <line x1="175" y1="78" x2="210" y2="100" stroke="#475569" strokeWidth="2.5"/>
    <circle cx="220" cy="45" r="9" fill="#F97316"/>
    <circle cx="220" cy="110" r="9" fill="#10B981"/>
    <text x="270" y="65" fontFamily="'Kantumruy Pro', Inter, sans-serif" fontSize="26" fontWeight="700" fill="#E2E8F0" textAnchor="middle">ខ្មែរ</text>
    <text x="270" y="100" fontFamily="Inter, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif" fontSize="28" fontWeight="bold" fill="#60A5FA" textAnchor="middle">CHAT</text>
  </svg>
);

const ToggleSwitch: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
    disabled?: boolean;
  }> = ({ label, checked, onChange, description, disabled }) => (
    <div>
        <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${disabled ? 'text-slate-500 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
            <button
                type="button"
                onClick={() => !disabled && onChange(!checked)}
                className={`${
                checked ? 'bg-primary' : 'bg-slate-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-800 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                role="switch"
                aria-checked={checked}
                disabled={disabled}
            >
                <span
                className={`${
                    checked ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
        {description && <p className={`text-xs mt-1 ${disabled ? 'text-slate-600 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>}
    </div>
);

const RadioGroup: React.FC<{
  label: string;
  name: string;
  options: { value: string; label: string; description?: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal'; // Added layout option
  itemClassName?: string; // Class for individual radio items
}> = ({ label, name, options, selectedValue, onChange, disabled, layout = 'vertical', itemClassName = '' }) => (
  <fieldset className="space-y-2">
    <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</legend>
    <div className={`${layout === 'horizontal' ? 'flex flex-wrap gap-2' : 'space-y-2'}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-start p-2.5 rounded-md border transition-colors cursor-pointer ${
            selectedValue === option.value
              ? 'bg-blue-50 dark:bg-blue-900/40 border-primary dark:border-blue-500 ring-1 ring-primary dark:ring-blue-500'
              : `bg-slate-50 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`
          } ${itemClassName}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className="h-4 w-4 mt-0.5 text-primary border-slate-400 dark:border-slate-500 focus:ring-primary dark:focus:ring-offset-slate-800"
          />
          <div className="ml-2.5">
            <span className={`text-sm font-medium ${selectedValue === option.value ? 'text-primary dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>{option.label}</span>
            {option.description && <p className="text-xs text-slate-500 dark:text-slate-400">{option.description}</p>}
          </div>
        </label>
      ))}
    </div>
  </fieldset>
);


interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (parts: GenAiPart[], textPrompt: string, imageDetails?: { names: string[], urls: string[] }) => Promise<void>;
  onRegenerateResponse: (userPromptId: string) => Promise<void>;
  onEditUserMessage: (messageId: string, newParts: GenAiPart[], newText: string, newImageDetails?: { names: string[]; urls: string[] }) => Promise<void>;
  isLoading: boolean;
  chatError: string | null;
  setChatError: (error: string | null) => void;
  user: User | null;
  currentChatSettings: ConversationSettingsSnapshot | null;
  onSettingsChangeRequiresNewChat?: (settingsChange: {isGoogleSearchEnabled?: boolean, useTechnicalVocabulary?: boolean, interactionStyle?: InteractionStyle, prioritizeFastResponse?: boolean}) => void;
  onRunCode: (code: string, language?: string) => void; 
}


const INTERACTION_STYLE_OPTIONS = [
  { value: InteractionStyle.DEFAULT, label: "Default Assistant", description: "Standard helpful AI persona." },
  { value: InteractionStyle.AGENT, label: "Agent (Proactive)", description: "AI anticipates needs and offers suggestions." },
  { value: InteractionStyle.ASK_ASK, label: "Ask Ask (Inquisitive)", description: "AI asks more clarifying questions." },
  { value: InteractionStyle.MANUAL, label: "Manual (Step-by-step)", description: "AI provides detailed, step-by-step guidance." },
  { value: InteractionStyle.SC_ARCHITECT, label: "SCArchitect (Solution Architect)", description: "AI focuses on high-level designs." },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    onRegenerateResponse,
    onEditUserMessage,
    isLoading,
    chatError,
    setChatError,
    user,
    currentChatSettings,
    onSettingsChangeRequiresNewChat,
    onRunCode,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isEditingMessageId, setIsEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);

  const [isGoogleSearchEnabled, setIsGoogleSearchEnabled] = useState(false);
  const [useTechnicalVocabulary, setUseTechnicalVocabulary] = useState(false);
  const [interactionStyle, setInteractionStyle] = useState<InteractionStyle>(InteractionStyle.DEFAULT);
  const [prioritizeFastResponse, setPrioritizeFastResponse] = useState(false);

  const { t } = useTranslation(); // i18n hook
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const toolsPanelRef = useRef<HTMLDivElement>(null);
  const toolsToggleButtonRef = useRef<HTMLButtonElement>(null);

  const userPlan = user?.plan || UserPlan.FREE;
  
  const getMaxImageUploads = () => {
    switch (userPlan) {
      case UserPlan.PREMIUM_ULTRA2:
        return MAX_IMAGE_UPLOADS_ULTRA2;
      case UserPlan.PREMIUM:
        return MAX_IMAGE_UPLOADS_PREMIUM;
      default:
        return MAX_IMAGE_UPLOADS_FREE;
    }
  };

  const getMaxTotalImageSizeMB = () => {
    switch (userPlan) {
      case UserPlan.PREMIUM_ULTRA2:
        return MAX_TOTAL_IMAGE_SIZE_MB_ULTRA2;
      case UserPlan.PREMIUM:
        return MAX_TOTAL_IMAGE_SIZE_MB_PREMIUM;
      default:
        return MAX_TOTAL_IMAGE_SIZE_MB_FREE;
    }
  };

  const currentMaxUploads = getMaxImageUploads();
  const currentMaxTotalSizeMB = getMaxTotalImageSizeMB();
  const canUserUploadImages = userPlan === UserPlan.PREMIUM || userPlan === UserPlan.PREMIUM_ULTRA2;


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const userSettingsRaw = localStorage.getItem(USER_SETTINGS_KEY);
    let globalDefaultTechVocab = false;
    let globalDefaultGoogleSearch = false;
    let globalDefaultInteractionStyle = InteractionStyle.DEFAULT;
    let globalDefaultFastResponse = false;


    if (userSettingsRaw) {
        try {
            const parsedSettings = JSON.parse(userSettingsRaw) as UserSettings;
            globalDefaultTechVocab = parsedSettings.useTechnicalVocabulary || false;
            globalDefaultGoogleSearch = parsedSettings.isGoogleSearchEnabled || false;
            globalDefaultInteractionStyle = parsedSettings.interactionStyle || InteractionStyle.DEFAULT;
            globalDefaultFastResponse = parsedSettings.prioritizeFastResponse || false;
        } catch(e) {console.error("Error parsing user settings for chat interface default tool states.", e)}
    }

    // Prioritize current chat settings, then global, then default
    const newGoogleSearchEnabled = currentChatSettings?.isGoogleSearchEnabled ?? globalDefaultGoogleSearch;
    const newUseTechnicalVocabulary = currentChatSettings?.useTechnicalVocabulary ?? globalDefaultTechVocab;
    const newInteractionStyle = currentChatSettings?.interactionStyle ?? globalDefaultInteractionStyle;
    const newPrioritizeFastResponse = currentChatSettings?.prioritizeFastResponse ?? globalDefaultFastResponse;


    setIsGoogleSearchEnabled(newGoogleSearchEnabled);
    setUseTechnicalVocabulary(newUseTechnicalVocabulary);
    setInteractionStyle(newInteractionStyle);
    setPrioritizeFastResponse(newPrioritizeFastResponse);


  }, [currentChatSettings]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      isToolsPanelOpen &&
      toolsPanelRef.current &&
      !toolsPanelRef.current.contains(event.target as Node) &&
      toolsToggleButtonRef.current &&
      !toolsToggleButtonRef.current.contains(event.target as Node)
    ) {
      setIsToolsPanelOpen(false);
    }
  }, [isToolsPanelOpen]);


  useEffect(() => {
    if (isToolsPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToolsPanelOpen, handleClickOutside]);


  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasUnsavedContent =
        !isLoading && 
        (
          (inputText.trim() !== '' && !isEditingMessageId) ||
          (editText.trim() !== '' && isEditingMessageId) ||
          attachedFiles.length > 0
        );

      if (hasUnsavedContent) {
        event.preventDefault(); 
        event.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [inputText, editText, attachedFiles, isEditingMessageId, isLoading]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const currentTotalSize = attachedFiles.reduce((acc, file) => acc + file.size, 0);
      const newFilesTotalSize = newFiles.reduce((acc, file) => acc + file.size, 0);

      if (currentTotalSize + newFilesTotalSize > currentMaxTotalSizeMB * 1024 * 1024) {
        setChatError(`Total image size exceeds ${currentMaxTotalSizeMB}MB. Please upload smaller files or fewer files.`);
        return;
      }
      if (attachedFiles.length + newFiles.length > currentMaxUploads) {
         setChatError(`Cannot attach more than ${currentMaxUploads} images at a time.`);
         return;
      }
      setAttachedFiles(prev => [...prev, ...newFiles]);
      setChatError(null);
    }
  };

  const removeImage = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmedInput = (isEditingMessageId ? editText : inputText).trim();
    if (!trimmedInput && attachedFiles.length === 0) return;
    if (isLoading) return;

    setChatError(null);
    if (isListening) {
        speechRecognitionRef.current?.stop();
        setIsListening(false);
        setInterimTranscript('');
    }

    const parts: GenAiPart[] = [];
    if (trimmedInput) {
      parts.push({ text: trimmedInput });
    }

    const imageDetails = {
      names: attachedFiles.map(f => f.name),
      urls: attachedFiles.map(f => URL.createObjectURL(f))
    };

    try {
      for (const file of attachedFiles) {
        parts.push(await fileToGenerativePart(file));
      }

      if (isEditingMessageId) {
        await onEditUserMessage(isEditingMessageId, parts, trimmedInput, attachedFiles.length > 0 ? imageDetails : undefined);
        setIsEditingMessageId(null);
        setEditText('');
      } else {
        await onSendMessage(parts, trimmedInput, attachedFiles.length > 0 ? imageDetails : undefined);
      }

      setInputText('');
      setAttachedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      imageDetails.urls.forEach(url => URL.revokeObjectURL(url));

    } catch (error) {
      console.error("Error processing files for sending:", error);
      setChatError("Failed to process images. Please try again.");
      imageDetails.urls.forEach(url => URL.revokeObjectURL(url));
    }
  };

  const handleEditRequest = (messageId: string, currentText: string) => {
    if (isListening) {
        speechRecognitionRef.current?.stop();
        setIsListening(false);
        setInterimTranscript('');
    }
    setIsEditingMessageId(messageId);
    setEditText(currentText);
    setInputText(currentText); // Also set inputText to reflect editing in textarea
    textareaRef.current?.focus();
    setAttachedFiles([]); // Clear any attached files when starting an edit
  };

  const cancelEdit = () => {
    setIsEditingMessageId(null);
    setEditText('');
    setInputText(''); 
    setAttachedFiles([]);
  };

  const handleToggleListening = () => {
    if (!canUserUploadImages) { // Voice input is typically a premium feature, tied with image uploads here
        setChatError("Voice input is a Premium feature. Please upgrade your plan.");
        return;
    }
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setChatError("Speech recognition is not supported by your browser.");
        return;
      }

      setChatError(null);
      setInterimTranscript('');
      speechRecognitionRef.current = new SpeechRecognitionAPI();
      const recognition = speechRecognitionRef.current;

      const userSettingsRaw = localStorage.getItem(USER_SETTINGS_KEY);
      let lang = 'en-US';
      if (userSettingsRaw) {
          try {
              const parsedSettings: Partial<UserSettings> = JSON.parse(userSettingsRaw);
              lang = parsedSettings.defaultSpeechLanguage || 'en-US';
          } catch (e) {console.error("Error parsing user settings for speech lang");}
      }
      recognition.lang = lang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('Listening...');
      };

      recognition.onresult = (event) => {
        let finalTranscript = isEditingMessageId ? editText : inputText;
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        if (isEditingMessageId) {
            setEditText(finalTranscript.trim());
        } else {
            setInputText(finalTranscript.trim());
        }
        setInterimTranscript(currentInterim || 'Listening...');
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        let errorMsg = "Speech recognition error.";
        if (event.error === 'no-speech') errorMsg = "No speech detected. Please try again.";
        else if (event.error === 'audio-capture') errorMsg = "Microphone error. Please check your microphone.";
        else if (event.error === 'not-allowed') errorMsg = "Microphone access denied. Please enable it in your browser settings.";
        else if (event.error === 'network') errorMsg = "Network error during speech recognition.";
        setChatError(errorMsg);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        textareaRef.current?.focus();
      };

      try {
        recognition.start();
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        setChatError("Could not start voice input. Please ensure microphone access is allowed.");
        setIsListening(false);
      }
    }
  };

  const handleToolSettingChange = (setting: 'googleSearch' | 'technicalVocabulary' | 'interactionStyle' | 'prioritizeFastResponse', value: boolean | InteractionStyle) => {
    const changes: {isGoogleSearchEnabled?: boolean, useTechnicalVocabulary?: boolean, interactionStyle?: InteractionStyle, prioritizeFastResponse?: boolean} = {};
    let actualChangeMade = false;

    const userSettingsRaw = localStorage.getItem(USER_SETTINGS_KEY);
    let globalDefaults: Partial<UserSettings> = {
        useTechnicalVocabulary: false,
        isGoogleSearchEnabled: false,
        interactionStyle: InteractionStyle.DEFAULT,
        prioritizeFastResponse: false,
    };
    if (userSettingsRaw) {
        try {
            const parsedSettings = JSON.parse(userSettingsRaw) as UserSettings;
            globalDefaults.useTechnicalVocabulary = parsedSettings.useTechnicalVocabulary || false;
            globalDefaults.isGoogleSearchEnabled = parsedSettings.isGoogleSearchEnabled || false;
            globalDefaults.interactionStyle = parsedSettings.interactionStyle || InteractionStyle.DEFAULT;
            globalDefaults.prioritizeFastResponse = parsedSettings.prioritizeFastResponse || false;
        } catch(e) { console.warn("Could not parse global user settings for tool change comparison.")}
    }

    if (setting === 'googleSearch' && typeof value === 'boolean') {
        const currentActualValue = currentChatSettings?.isGoogleSearchEnabled ?? globalDefaults.isGoogleSearchEnabled;
        if (currentActualValue !== value) {
            changes.isGoogleSearchEnabled = value;
            setIsGoogleSearchEnabled(value); 
            actualChangeMade = true;
        }
    } else if (setting === 'technicalVocabulary' && typeof value === 'boolean') {
        const currentActualValue = currentChatSettings?.useTechnicalVocabulary ?? globalDefaults.useTechnicalVocabulary;
        if (currentActualValue !== value) {
            changes.useTechnicalVocabulary = value;
            setUseTechnicalVocabulary(value); 
            actualChangeMade = true;
        }
    } else if (setting === 'interactionStyle' && typeof value === 'string') { 
        const currentActualValue = currentChatSettings?.interactionStyle ?? globalDefaults.interactionStyle;
        if (currentActualValue !== value) {
            changes.interactionStyle = value as InteractionStyle;
            setInteractionStyle(value as InteractionStyle); 
            actualChangeMade = true;
        }
    } else if (setting === 'prioritizeFastResponse' && typeof value === 'boolean') {
        const currentActualValue = currentChatSettings?.prioritizeFastResponse ?? globalDefaults.prioritizeFastResponse;
        if (currentActualValue !== value) {
            changes.prioritizeFastResponse = value;
            setPrioritizeFastResponse(value);
            actualChangeMade = true;
        }
    }


    if (actualChangeMade && onSettingsChangeRequiresNewChat) {
        onSettingsChangeRequiresNewChat(changes);
    }
    
    if (isToolsPanelOpen) setIsToolsPanelOpen(false);
  };


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = parseInt(getComputedStyle(textareaRef.current).maxHeight, 10) || 128; // 128px is roughly 5 lines for default text size
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [inputText, editText, isEditingMessageId]);

  useEffect(() => {
    return () => {
      // Cleanup speech recognition on unmount
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
    };
  }, []);

  let attachImageTitle = t('chatInterface.attachImageTitle.premium', { maxUploads: currentMaxUploads, maxSizeMB: currentMaxTotalSizeMB });
  if (!canUserUploadImages) {
    attachImageTitle = t('chatInterface.attachImageTitle.free');
  } else if (isLoading) {
    attachImageTitle = t('chatInterface.attachImageTitle.loading');
  } else if (isEditingMessageId) {
    attachImageTitle = t('chatInterface.attachImageTitle.editing');
  } else if (attachedFiles.length >= currentMaxUploads) {
    attachImageTitle = t('chatInterface.attachImageTitle.maxReached', {maxUploads: currentMaxUploads});
  }

  const textareaPlaceholder = isEditingMessageId
    ? t('chatInterface.inputPlaceholderEditing')
    : t('chatInterface.inputPlaceholder');
  
  const isFlashModel = currentChatSettings?.model === GEMINI_CHAT_MODEL; // GEMINI_CHAT_MODEL is 'gemini-2.5-flash-preview-04-17'
  
  let fastResponseDescription = "Faster, potentially less detailed replies.";
  if (!isFlashModel) {
      fastResponseDescription = "This setting only applies to the Flash model.";
  } else if (isGoogleSearchEnabled) { // Check the session's Google Search status
      fastResponseDescription = "Not applicable when Google Search is enabled for this session.";
  } else {
      fastResponseDescription = "Faster, potentially less detailed replies. (Applies to Flash model)";
  }

  const toolsButtonTitle = isLoading ? t('chatInterface.toolsButtonTitleLoading') : t('chatInterface.toolsButtonTitle');
  const sendButtonDisabled = isLoading || ((!(isEditingMessageId ? editText : inputText).trim() && attachedFiles.length === 0));
  let sendButtonTitle = t('chatInterface.sendButtonTitle.send');
  if (isLoading) {
      sendButtonTitle = t('chatInterface.sendButtonTitle.loading');
  } else if ((!(isEditingMessageId ? editText : inputText).trim() && attachedFiles.length === 0)) {
      sendButtonTitle = t('chatInterface.sendButtonTitle.empty');
  }
  
  const microphoneButtonTitle = canUserUploadImages 
    ? (isListening ? t('chatInterface.microphone.stop') : t('chatInterface.microphone.start.premium')) 
    : t('chatInterface.microphone.start.free');


  return (
    <div className="flex-1 flex flex-col bg-lightgray dark:bg-slate-800 overflow-hidden">
      <div
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scroll-smooth"
        aria-busy={isLoading && messages.length > 0 && messages[messages.length -1].sender === 'user'}
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AIPlusKhmerChatLogoChatPlaceholderSVG className="w-64 h-auto mb-6 opacity-80 dark:opacity-60" />
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-400">
              {t('app.name')}
            </h2>
            <p className="text-slate-500 dark:text-slate-500">
              Start a conversation, ask a question, or upload an image!
            </p>
          </div>
        )}
        {messages.map((msg) => {
            let referencedUserAttachment: { parts: GenAiPart[], names: string[] } | undefined = undefined;
            if (msg.sender === 'ai' && msg.promptId) {
              const userPrompt = messages.find(m => m.id === msg.promptId);
              if (userPrompt && userPrompt.originalParts && userPrompt.imageFileNames) {
                const imageParts = userPrompt.originalParts.filter(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));
                if (imageParts.length > 0) {
                  const relevantNames = userPrompt.imageFileNames.slice(0, imageParts.length);
                  referencedUserAttachment = { parts: imageParts, names: relevantNames };
                }
              }
            }
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                onRegenerateResponse={onRegenerateResponse}
                onEditUserMessageRequest={handleEditRequest}
                isEditable={msg.sender === 'user' && messages[messages.length -1].id === msg.id && !isEditingMessageId && !isLoading}
                referencedUserAttachment={referencedUserAttachment}
                onRunCode={onRunCode} 
                isSendingMessage={isLoading} 
              />
            );
        })}
        <div ref={messagesEndRef} />
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
            <div className="flex justify-start">
                <div
                  className="flex flex-col items-center p-3 bg-slate-600 dark:bg-slate-700 text-white rounded-2xl shadow-md max-w-[240px] self-start rounded-bl-none"
                  aria-label="AI is thinking"
                  role="status"
                >
                  <AppLogo className="w-12 h-12 opacity-80 animate-pulse mb-1.5 text-blue-300 dark:text-blue-400" />
                  <div
                    className="text-center text-sm font-medium text-slate-200 dark:text-slate-300"
                    lang="km" 
                  >
                    កំពុងគិត
                    <span className="thinking-dot">.</span>
                    <span className="thinking-dot">.</span>
                    <span className="thinking-dot">.</span>
                  </div>
                </div>
            </div>
        )}
      </div>

      {chatError && (
        <div
            className="p-3 bg-red-100 dark:bg-red-900/40 border-t border-red-300 dark:border-red-700 text-center"
            role="alert"
            aria-live="assertive"
        >
          <p className="text-sm text-red-700 dark:text-red-300">
            Error: {chatError}
          </p>
        </div>
      )}

      {attachedFiles.length > 0 && (
        <div className="p-2 bg-slate-100 dark:bg-slate-700 border-t border-slate-300 dark:border-slate-600">
          <div className="flex space-x-2 overflow-x-auto">
            {attachedFiles.map((file, index) => (
              <div key={index} className="relative flex-shrink-0 group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded-md border border-slate-400 dark:border-slate-500"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${file.name}`}
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
           <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
            {attachedFiles.length}/{currentMaxUploads} images selected. Max total size: {currentMaxTotalSizeMB}MB.
          </p>
        </div>
      )}

      {isListening && interimTranscript && (
        <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border-t border-slate-300 dark:border-slate-600">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic animate-pulse" aria-live="polite">
                {interimTranscript}
            </p>
        </div>
      )}


      <div className="p-3 md:p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600 flex-shrink-0">
         {isEditingMessageId && (
            <div className="flex items-center justify-between mb-1.5 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Editing message... (Original images will be removed. Only text can be edited.)
                </p>
                <Button variant="ghost" size="sm" onClick={cancelEdit} className="!text-xs !py-0.5 !px-1.5">Cancel Edit</Button>
            </div>
        )}
        <div className="flex items-end space-x-2">
          {/* Tools Panel Button */}
          <div className="relative">
            <Button
              ref={toolsToggleButtonRef}
              variant="outline"
              size="sm"
              onClick={() => setIsToolsPanelOpen(prev => !prev)}
              className="!p-2.5"
              aria-label={toolsButtonTitle}
              title={toolsButtonTitle}
              disabled={isLoading}
              aria-expanded={isToolsPanelOpen}
              aria-controls="chat-tools-panel"
            >
              <WrenchScrewdriverIcon className="w-5 h-5" />
            </Button>
            {isToolsPanelOpen && (
              <div
                id="chat-tools-panel"
                ref={toolsPanelRef}
                className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-slate-700 rounded-lg shadow-xl border border-slate-200 dark:border-slate-600 p-3 space-y-3 z-10"
              >
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-1.5 mb-2.5">Chat Settings</h4>
                    <div className="space-y-3">
                        <ToggleSwitch
                            label="Google Search"
                            checked={isGoogleSearchEnabled}
                            onChange={(val) => handleToolSettingChange('googleSearch', val)}
                            description="Enable web search for up-to-date info. (Premium)"
                            disabled={userPlan === UserPlan.FREE || isLoading}
                        />
                        <ToggleSwitch
                            label="Technical Vocabulary"
                            checked={useTechnicalVocabulary}
                            onChange={(val) => handleToolSettingChange('technicalVocabulary', val)}
                            description="Prefer formal, domain-specific language."
                            disabled={isLoading}
                        />
                         <ToggleSwitch
                            label="Prioritize Fast Response"
                            checked={prioritizeFastResponse}
                            onChange={(val) => handleToolSettingChange('prioritizeFastResponse', val)}
                            description={fastResponseDescription}
                            disabled={isLoading || (isFlashModel && isGoogleSearchEnabled) || !isFlashModel}
                        />
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                    <RadioGroup
                        label="AI Interaction Style"
                        name="interactionStyleTools"
                        options={INTERACTION_STYLE_OPTIONS}
                        selectedValue={interactionStyle}
                        onChange={(val) => handleToolSettingChange('interactionStyle', val as InteractionStyle)}
                        disabled={isLoading}
                    />
                </div>
                 <p className="text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-200 dark:border-slate-600">Changes to these settings will start a new chat session.</p>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="!p-2.5"
            aria-label={attachImageTitle}
            title={attachImageTitle}
            disabled={!canUserUploadImages || isLoading || attachedFiles.length >= currentMaxUploads || !!isEditingMessageId}
          >
            <PlusIcon />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/png, image/jpeg, image/gif, image/webp"
            onChange={handleImageChange}
            className="hidden"
            disabled={!canUserUploadImages || isLoading || attachedFiles.length >= currentMaxUploads || !!isEditingMessageId}
          />

          <textarea
            ref={textareaRef}
            value={isEditingMessageId ? editText : inputText}
            onChange={(e) => isEditingMessageId ? setEditText(e.target.value) : setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={textareaPlaceholder}
            className="flex-1 p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:border-primary outline-none text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 resize-none min-h-[44px] max-h-32 overflow-y-auto"
            rows={1}
            disabled={isLoading}
            aria-label="Chat input"
          />
           <Button
            variant="outline"
            size="sm"
            onClick={handleToggleListening}
            className={`!p-2.5 ${isListening ? '!border-red-500 dark:!border-red-400' : ''}`}
            aria-label={microphoneButtonTitle}
            title={microphoneButtonTitle}
            disabled={!canUserUploadImages || isLoading}
          >
            <MicrophoneIcon isListening={isListening} />
          </Button>

          <Button
            onClick={handleSend}
            size="sm"
            className="!p-2.5"
            disabled={sendButtonDisabled}
            aria-label={sendButtonTitle}
            title={sendButtonTitle}
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;