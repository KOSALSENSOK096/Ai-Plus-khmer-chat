// Code Complete Review: 20240815120000
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'; // Added useMemo
import { Link, useNavigate, Navigate } from 'react-router-dom'; // Added Navigate import
import { Chat, Part as GenAiPart, GroundingChunk, Content } from '@google/genai'; 
import ChatInterface from '../components/Chat/ChatInterface'; // Changed to relative path
import { ChatSidebar } from '@/components/Chat/ChatSidebar'; // Updated to named import
import { useAuth } from '../hooks/useAuth';
import { APP_NAME, APP_ROUTES, GEMINI_CHAT_MODEL, USER_SETTINGS_KEY } from '../constants';
import { 
    UserPlan, 
    StoredConversation, 
    ChatMessage, 
    ConversationSettingsSnapshot, 
    UserSettings, 
    InteractionStyle,
    StartNewChatOptions,
    StoredChatMessage // Added StoredChatMessage
} from '../types'; 
import chatHistoryService from '../services/chatHistoryService';
import { geminiService, isGeminiClientInitialized } from '../services/geminiService'; 
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button'; 
import Input from '../components/Common/Input'; // Added Input import
import AppLogo from '../components/Common/AppLogo'; // Added AppLogo import
import { SettingsModal } from '../components/Common/SettingsModal'; // Changed to named import
import { useTranslation } from '../hooks/useTranslation'; // Import useTranslation

// --- SVG Icons for ChatPage Header (Defined ONCE) ---
const SidebarOpenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <title>Open Sidebar</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
  </svg>
);

const PageCpuChipIcon = ({ className }: { className?: string }) => ( // Renamed to avoid conflict
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <title>AI Model</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M12 12h.008v.008H12V12zm0 0H8.25m3.75 0h3.75M12 12v3.75m0-7.5V8.25m0 7.5h3.75m-7.5 0H8.25m7.5 0v3.75m0-7.5V8.25m0 7.5h3.75M3.75 12h4.5m3.75 0h4.5m-4.5 3.75h4.5m-4.5-7.5h4.5m-1.5-1.5h-1.5v-1.5h1.5v1.5zm1.5 0v-1.5m0 3h-1.5v-1.5h1.5v1.5zm1.5 0v-1.5M9 9.75h1.5v1.5H9v-1.5zm-1.5 0v1.5m0-3h1.5v1.5H7.5v-1.5zm-1.5 0v1.5m3-1.5H7.5M9 12.75h1.5v1.5H9v-1.5zm-1.5 0v1.5m0-3h1.5v1.5H7.5v-1.5zm-1.5 0v1.5m3-1.5H7.5" />
  </svg>
);

const PageGlobeAltIcon = ({ className, title }: { className?: string, title?: string }) => ( // Renamed
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <title>{title || 'Web Search'}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c.506 0 1.027-.024 1.543-.072M12 21c-.506 0-1.027-.024-1.543-.072M4.284 14.252A9.004 9.004 0 0112 3c2.998 0 5.685 1.453 7.367 3.68M12 3c-.506 0-1.027-.024-1.543-.072M12 3c.506 0 1.027-.024 1.543-.072M4.284 9.748A9.004 9.004 0 0112 21c2.998 0 5.685 1.453 7.367-3.68M12 21c.506 0 1.027-.024 1.543-.072M12 21c-.506 0-1.027-.024-1.543-.072M7.5 6A4.5 4.5 0 0112 1.5a4.5 4.5 0 014.5 4.5v1.398M7.5 6v1.398m0 0A4.5 4.5 0 0112 12.75a4.5 4.5 0 014.5-5.352M12 12.75c-.506 0-1.027-.024-1.543-.072M12 12.75c.506 0 1.027-.024 1.543-.072" />
  </svg>
);

const PageAcademicCapIcon = ({ className, title }: { className?: string, title?: string }) => ( // Renamed
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <title>{title || 'Technical Vocabulary'}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

const PageUserStarIcon = ({ className, title }: { className?: string, title?: string }) => ( // Renamed
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <title>{title || 'Interaction Style'}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zM16.875 10.312l1.061 2.15.18.365a.412.412 0 00.39.288l2.368.344a.413.413 0 01.23.705l-1.713 1.67a.413.413 0 00-.12.457l.404 2.358a.413.413 0 01-.6.435l-2.118-1.114a.414.414 0 00-.482 0l-2.118 1.114a.413.413 0 01-.6-.435l.404-2.358a.413.413 0 00-.12-.457l-1.713-1.67a.413.413 0 01.23-.705l2.368-.344a.412.412 0 00.39-.288l.18-.365 1.06-2.15z" />
  </svg>
);

const BoltIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Fast Response Mode</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const INTERACTION_STYLE_DETAILS: Record<InteractionStyle, { label: string; icon: JSX.Element }> = {
  [InteractionStyle.DEFAULT]: { label: "Default", icon: <PageUserStarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" title="Default Interaction Style"/> },
  [InteractionStyle.AGENT]: { label: "Agent", icon: <PageUserStarIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" title="Agent Interaction Style"/> },
  [InteractionStyle.ASK_ASK]: { label: "Ask Ask", icon: <PageUserStarIcon className="w-4 h-4 text-teal-500 dark:text-teal-400" title="Ask Ask Interaction Style"/> },
  [InteractionStyle.MANUAL]: { label: "Manual", icon: <PageUserStarIcon className="w-4 h-4 text-orange-500 dark:text-orange-400" title="Manual Interaction Style"/> },
  [InteractionStyle.SC_ARCHITECT]: { label: "SC Architect", icon: <PageUserStarIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" title="SC Architect Interaction Style"/> },
};


const ChatPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentChatSettings, setCurrentChatSettings] = useState<ConversationSettingsSnapshot | null>(null);

  const [isGeminiAvailable, setIsGeminiAvailable] = useState(isGeminiClientInitialized());
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    const geminiStatus = isGeminiClientInitialized();
    setIsGeminiAvailable(geminiStatus);
    if (!geminiStatus) {
        setInitializationError("Gemini AI service not available. Please check API key or network connection. Chat functionality will be limited.");
    }
  }, []);

  const loadConversations = useCallback(() => {
    const histories = chatHistoryService.loadAllConversations();
    const sortedConversations = Object.values(histories).sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
    setConversations(sortedConversations);
    return sortedConversations;
  }, []);

  const initializeChatSession = useCallback((settings: ConversationSettingsSnapshot) => {
    if (!user || !isGeminiAvailable) {
      setChatError("Gemini AI service not available. Please check API key or network connection.");
      return null;
    }
    const session = geminiService.startChatSession(
      settings.userPlan,
      settings.isGoogleSearchEnabled,
      settings.useTechnicalVocabulary,
      settings.interactionStyle,
      settings.prioritizeFastResponse // Pass this to service
    );
    if (!session) {
      setChatError("Failed to start chat session. AI service might be unavailable.");
    }
    return session;
  }, [user, isGeminiAvailable]);

  const startNewChat = useCallback((options?: StartNewChatOptions) => {
    setIsLoading(true);
    setChatError(null);
    setMessages([]);

    const userSettingsRaw = localStorage.getItem(USER_SETTINGS_KEY);
    const globalDefaultsFromStorage: UserSettings = {
        defaultSpeechLanguage: 'en-US',
        theme: 'system',
        confirmClearChat: true,
        useTechnicalVocabulary: false,
        isGoogleSearchEnabled: false,
        interactionStyle: InteractionStyle.DEFAULT,
        prioritizeFastResponse: false,
    };
    if (userSettingsRaw) {
        try {
            const parsedGlobalSettings: UserSettings = JSON.parse(userSettingsRaw);
            globalDefaultsFromStorage.defaultSpeechLanguage = parsedGlobalSettings.defaultSpeechLanguage ?? globalDefaultsFromStorage.defaultSpeechLanguage;
            globalDefaultsFromStorage.theme = parsedGlobalSettings.theme ?? globalDefaultsFromStorage.theme;
            globalDefaultsFromStorage.confirmClearChat = parsedGlobalSettings.confirmClearChat ?? globalDefaultsFromStorage.confirmClearChat;
            globalDefaultsFromStorage.useTechnicalVocabulary = parsedGlobalSettings.useTechnicalVocabulary ?? globalDefaultsFromStorage.useTechnicalVocabulary;
            globalDefaultsFromStorage.isGoogleSearchEnabled = parsedGlobalSettings.isGoogleSearchEnabled ?? globalDefaultsFromStorage.isGoogleSearchEnabled;
            globalDefaultsFromStorage.interactionStyle = parsedGlobalSettings.interactionStyle ?? globalDefaultsFromStorage.interactionStyle;
            globalDefaultsFromStorage.prioritizeFastResponse = parsedGlobalSettings.prioritizeFastResponse ?? globalDefaultsFromStorage.prioritizeFastResponse;
        } catch(e) { console.error("Failed to parse global user settings for new chat.", e); }
    }
    
    let resolvedInitialSettings: ConversationSettingsSnapshot;

    if (options?.initialSettings && Object.keys(options.initialSettings).length > 0) {
        resolvedInitialSettings = {
            model: GEMINI_CHAT_MODEL, 
            userPlan: user!.plan,     
            isGoogleSearchEnabled: options.initialSettings.isGoogleSearchEnabled ?? globalDefaultsFromStorage.isGoogleSearchEnabled,
            useTechnicalVocabulary: options.initialSettings.useTechnicalVocabulary ?? globalDefaultsFromStorage.useTechnicalVocabulary,
            interactionStyle: options.initialSettings.interactionStyle ?? globalDefaultsFromStorage.interactionStyle,
            prioritizeFastResponse: options.initialSettings.prioritizeFastResponse ?? globalDefaultsFromStorage.prioritizeFastResponse,
        };
    } else {
        resolvedInitialSettings = {
            model: GEMINI_CHAT_MODEL,
            userPlan: user!.plan,
            isGoogleSearchEnabled: globalDefaultsFromStorage.isGoogleSearchEnabled,
            useTechnicalVocabulary: globalDefaultsFromStorage.useTechnicalVocabulary,
            interactionStyle: globalDefaultsFromStorage.interactionStyle,
            prioritizeFastResponse: globalDefaultsFromStorage.prioritizeFastResponse,
        };
    }
    
    const newConversationId = options?.conversationId || chatHistoryService.generateNewConversationId();
    const newConversation: StoredConversation = {
      id: newConversationId,
      title: t('chatPage.header.defaultTitle'), // Use translation for default title
      messages: [],
      createdAt: Date.now(),
      lastUpdatedAt: Date.now(),
      settingsSnapshot: resolvedInitialSettings,
    };

    chatHistoryService.saveConversation(newConversation);
    const updatedConversations = loadConversations(); 
    setActiveConversationId(newConversationId);
    setCurrentChatSettings(resolvedInitialSettings);
    
    const session = initializeChatSession(resolvedInitialSettings);
    setChatSession(session);
    
    setIsLoading(false);
    
    if (options?.trigger !== 'import_new') {
         const convToSetActive = updatedConversations.find(c => c.id === newConversationId);
         if (convToSetActive) { 
            setMessages(convToSetActive.messages.map(m => ({...m, timestamp: new Date(m.timestamp)})));
         } else {
            setMessages([]); 
         }
    }
  }, [user, loadConversations, initializeChatSession, t]);


  const handleSettingsChangeRequiresNewChat = useCallback((changedSettings: {isGoogleSearchEnabled?: boolean, useTechnicalVocabulary?: boolean, interactionStyle?: InteractionStyle, prioritizeFastResponse?: boolean}) => {
    if (!currentChatSettings) { 
        startNewChat({ trigger: 'settings_change_local_tools', initialSettings: changedSettings as Partial<ConversationSettingsSnapshot> });
        return;
    }

    const updatedSettings: ConversationSettingsSnapshot = {
        model: currentChatSettings.model, 
        userPlan: currentChatSettings.userPlan,
        isGoogleSearchEnabled: changedSettings.isGoogleSearchEnabled !== undefined ? changedSettings.isGoogleSearchEnabled : currentChatSettings.isGoogleSearchEnabled,
        useTechnicalVocabulary: changedSettings.useTechnicalVocabulary !== undefined ? changedSettings.useTechnicalVocabulary : currentChatSettings.useTechnicalVocabulary,
        interactionStyle: changedSettings.interactionStyle !== undefined ? changedSettings.interactionStyle : currentChatSettings.interactionStyle,
        prioritizeFastResponse: changedSettings.prioritizeFastResponse !== undefined ? changedSettings.prioritizeFastResponse : currentChatSettings.prioritizeFastResponse,
    };
    startNewChat({ trigger: 'settings_change_local_tools', initialSettings: updatedSettings });
  }, [currentChatSettings, startNewChat]);


  useEffect(() => {
    const loadedConvs = loadConversations();
    if (loadedConvs.length > 0) {
      const mostRecentId = chatHistoryService.getMostRecentConversationId();
      if (mostRecentId) {
        handleSelectChat(mostRecentId, 'load_most_recent');
      } else {
        startNewChat({trigger: 'user_action'});
      }
    } else {
      startNewChat({trigger: 'user_action'});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); 

  const handleSelectChat = useCallback((conversationId: string, trigger: StartNewChatOptions['trigger'] = 'user_action') => {
    const conversation = chatHistoryService.getConversation(conversationId);
    if (conversation && user) {
      setActiveConversationId(conversationId);
      setMessages(conversation.messages.map(msg => ({...msg, timestamp: new Date(msg.timestamp)})));
      
      const defaultSnapshot: ConversationSettingsSnapshot = {
        model: GEMINI_CHAT_MODEL,
        userPlan: user.plan,
        isGoogleSearchEnabled: false, 
        useTechnicalVocabulary: false,
        interactionStyle: InteractionStyle.DEFAULT,
        prioritizeFastResponse: false,
      };
      
      const settings = conversation.settingsSnapshot 
          ? { 
              model: conversation.settingsSnapshot.model || GEMINI_CHAT_MODEL,
              userPlan: conversation.settingsSnapshot.userPlan || user.plan,
              isGoogleSearchEnabled: conversation.settingsSnapshot.isGoogleSearchEnabled ?? defaultSnapshot.isGoogleSearchEnabled,
              useTechnicalVocabulary: conversation.settingsSnapshot.useTechnicalVocabulary ?? defaultSnapshot.useTechnicalVocabulary,
              interactionStyle: conversation.settingsSnapshot.interactionStyle ?? defaultSnapshot.interactionStyle,
              prioritizeFastResponse: conversation.settingsSnapshot.prioritizeFastResponse ?? defaultSnapshot.prioritizeFastResponse,
            }
          : defaultSnapshot;

      setCurrentChatSettings(settings);
      
      const session = initializeChatSession(settings);
      setChatSession(session);
      setChatError(null);
    }
  }, [user, initializeChatSession]);

  const handleSendMessage = async (userParts: GenAiPart[], textPrompt: string, imageDetails?: { names: string[], urls: string[] }) => {
    if (!chatSession || !user || !activeConversationId || !currentChatSettings) {
      setChatError("Chat session or user data is not initialized.");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setChatError(null);
    lastMessageIdRef.current = null;

    const userMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      text: textPrompt,
      sender: 'user',
      timestamp: new Date(),
      imageUrls: imageDetails?.urls,
      imageFileNames: imageDetails?.names,
      originalParts: userParts,
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let stream;
      const messageValueForRequest: string | GenAiPart[] = userParts.length > 0 ? userParts : textPrompt;
      
      stream = await chatSession.sendMessageStream({message: messageValueForRequest});

      let aiResponseText = "";
      let aiMessageId = `msg_${Date.now()}_ai_${Math.random().toString(36).substring(2, 7)}`;
      let currentGroundingChunks: ChatMessage['groundingChunks'] = undefined;

      setMessages(prev => [
        ...prev,
        { id: aiMessageId, text: "▋", sender: 'ai', timestamp: new Date(), promptId: userMessageId },
      ]);
      lastMessageIdRef.current = aiMessageId;

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        if (chunk.candidates && chunk.candidates[0].groundingMetadata && chunk.candidates[0].groundingMetadata.groundingChunks) {
            const apiGroundingChunks = chunk.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[];
            currentGroundingChunks = apiGroundingChunks
                .filter(gc => gc.web) 
                .map(gc => ({ web: { uri: gc.web!.uri, title: gc.web!.title } })); 
        }
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMessageId ? { ...m, text: aiResponseText + "▋", groundingChunks: currentGroundingChunks } : m
          )
        );
      }
      
      const finalAiMessage: ChatMessage = { 
        id: aiMessageId, 
        text: aiResponseText.trim(), 
        sender: 'ai', 
        timestamp: new Date(), 
        promptId: userMessageId, 
        groundingChunks: currentGroundingChunks 
      };
      setMessages(prev =>
        prev.map(m => (m.id === aiMessageId ? finalAiMessage : m))
      );
      lastMessageIdRef.current = null;
      
      const conversationToUpdate = conversations.find(c => c.id === activeConversationId);
      let newTitle = conversationToUpdate?.title || t('chatPage.header.defaultTitle');
      if (conversationToUpdate && conversationToUpdate.messages.length === 0 && textPrompt) {
        newTitle = textPrompt.substring(0, 50); 
      }
      
      chatHistoryService.saveConversation({
        id: activeConversationId,
        title: newTitle,
        messages: [...messages, userMessage, finalAiMessage].map(m => ({...m, timestamp: new Date(m.timestamp)})) as StoredChatMessage[],
        createdAt: conversationToUpdate?.createdAt || Date.now(),
        lastUpdatedAt: Date.now(),
        settingsSnapshot: currentChatSettings,
      });
      loadConversations(); 

    } catch (error: any) {
      console.error("Error sending message:", error);
      setChatError(`Failed to get response from AI: ${error.message || 'Unknown error'}`);
      if (lastMessageIdRef.current) {
        setMessages(prev => prev.filter(m => m.id !== lastMessageIdRef.current));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegenerateResponse = async (userPromptId: string) => {
    const userMessage = messages.find(msg => msg.id === userPromptId && msg.sender === 'user');
    if (!userMessage || !chatSession || !activeConversationId || !currentChatSettings) {
      setChatError("Could not find the original user message or chat session is invalid.");
      return;
    }

    setIsLoading(true);
    setChatError(null);
    lastMessageIdRef.current = null;

    setMessages(prev => prev.filter(msg => msg.promptId !== userPromptId || msg.sender !== 'ai'));
    
    try {
      const messageValueForRequest: string | GenAiPart[] = userMessage.originalParts && userMessage.originalParts.length > 0 ? userMessage.originalParts : userMessage.text;
      const stream = await chatSession.sendMessageStream({message: messageValueForRequest});

      let aiResponseText = "";
      let aiMessageId = `msg_${Date.now()}_ai_regen_${Math.random().toString(36).substring(2, 7)}`;
      let currentGroundingChunks: ChatMessage['groundingChunks'] = undefined;

      setMessages(prev => [
        ...prev,
        { id: aiMessageId, text: "▋", sender: 'ai', timestamp: new Date(), promptId: userPromptId },
      ]);
      lastMessageIdRef.current = aiMessageId;

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        if (chunk.candidates && chunk.candidates[0].groundingMetadata && chunk.candidates[0].groundingMetadata.groundingChunks) {
            const apiGroundingChunks = chunk.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[];
            currentGroundingChunks = apiGroundingChunks
                .filter(gc => gc.web)
                .map(gc => ({ web: { uri: gc.web!.uri, title: gc.web!.title } }));
        }
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMessageId ? { ...m, text: aiResponseText + "▋", groundingChunks: currentGroundingChunks } : m
          )
        );
      }
      
      const finalAiMessage: ChatMessage = { 
        id: aiMessageId, 
        text: aiResponseText.trim(), 
        sender: 'ai', 
        timestamp: new Date(), 
        promptId: userPromptId, 
        groundingChunks: currentGroundingChunks 
      };

      setMessages(prev =>
        prev.map(m => (m.id === aiMessageId ? finalAiMessage : m))
      );
      lastMessageIdRef.current = null;
      
      const existingMessagesForStorage = messages.filter(msg => !(msg.promptId === userPromptId && msg.sender === 'ai'));
      const updatedMessagesForStorage = [...existingMessagesForStorage, finalAiMessage];


      chatHistoryService.saveConversation({
        id: activeConversationId,
        title: conversations.find(c=>c.id === activeConversationId)?.title || t('chatPage.header.defaultTitle'),
        messages: updatedMessagesForStorage.map(m => ({...m, timestamp: new Date(m.timestamp)})) as StoredChatMessage[],
        createdAt: conversations.find(c=>c.id === activeConversationId)?.createdAt || Date.now(),
        lastUpdatedAt: Date.now(),
        settingsSnapshot: currentChatSettings,
      });
      loadConversations();

    } catch (error: any) {
      console.error("Error regenerating response:", error);
      setChatError(`Failed to regenerate response: ${error.message || 'Unknown error'}`);
      if (lastMessageIdRef.current) {
        setMessages(prev => prev.filter(m => m.id !== lastMessageIdRef.current));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUserMessage = async (messageId: string, newParts: GenAiPart[], newText: string, newImageDetails?: { names: string[], urls: string[] }) => {
    if (!chatSession || !activeConversationId || !currentChatSettings) {
      setChatError("Chat session is not initialized properly for editing.");
      return;
    }
    setIsLoading(true);
    setChatError(null);
    lastMessageIdRef.current = null;

    const messagesBeforeEditResponse = messages.filter(msg => 
        !(msg.sender === 'ai' && msg.promptId === messageId)
    );
    
    const updatedUserMessageInList = messagesBeforeEditResponse.map(msg =>
      msg.id === messageId
        ? { ...msg, text: newText, originalParts: newParts, imageUrls: newImageDetails?.urls, imageFileNames: newImageDetails?.names, isEdited: true, timestamp: new Date() }
        : msg
    );
    setMessages(updatedUserMessageInList);


    try {
      const messageValueForRequest: string | GenAiPart[] = newParts.length > 0 ? newParts : newText;
      const stream = await chatSession.sendMessageStream({message: messageValueForRequest});

      let aiResponseText = "";
      let aiMessageId = `msg_${Date.now()}_ai_edit_${Math.random().toString(36).substring(2, 7)}`;
      let currentGroundingChunks: ChatMessage['groundingChunks'] = undefined;

      setMessages(prev => [ 
        ...prev,
        { id: aiMessageId, text: "▋", sender: 'ai', timestamp: new Date(), promptId: messageId },
      ]);
      lastMessageIdRef.current = aiMessageId;

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        if (chunk.candidates && chunk.candidates[0].groundingMetadata && chunk.candidates[0].groundingMetadata.groundingChunks) {
            const apiGroundingChunks = chunk.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[];
            currentGroundingChunks = apiGroundingChunks
                .filter(gc => gc.web)
                .map(gc => ({ web: { uri: gc.web!.uri, title: gc.web!.title } }));
        }
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMessageId ? { ...m, text: aiResponseText + "▋", groundingChunks: currentGroundingChunks } : m
          )
        );
      }
      
      const finalAiMessage: ChatMessage = { 
        id: aiMessageId, 
        text: aiResponseText.trim(), 
        sender: 'ai', 
        timestamp: new Date(), 
        promptId: messageId, 
        groundingChunks: currentGroundingChunks 
      };

      setMessages(prev =>
        prev.map(m => (m.id === aiMessageId ? finalAiMessage : m))
      );
      lastMessageIdRef.current = null;

      const finalMessagesForStorage = messages.map(msg => {
          if (msg.id === messageId) { 
              return { ...msg, text: newText, originalParts: newParts, imageUrls: newImageDetails?.urls, imageFileNames: newImageDetails?.names, isEdited: true, timestamp: new Date() };
          }
          return msg;
      }).filter(msg => !(msg.sender === 'ai' && msg.promptId === messageId && msg.id !== finalAiMessage.id )); 
      
      if (!finalMessagesForStorage.find(m => m.id === finalAiMessage.id)) {
        finalMessagesForStorage.push(finalAiMessage);
      }
      
      chatHistoryService.saveConversation({
        id: activeConversationId,
        title: conversations.find(c=>c.id === activeConversationId)?.title || t('chatPage.header.defaultTitle'),
        messages: finalMessagesForStorage.map(m => ({...m, timestamp: new Date(m.timestamp)})) as StoredChatMessage[],
        createdAt: conversations.find(c=>c.id === activeConversationId)?.createdAt || Date.now(),
        lastUpdatedAt: Date.now(),
        settingsSnapshot: currentChatSettings,
      });
      loadConversations();

    } catch (error: any) {
      console.error("Error sending edited message:", error);
      setChatError(`Failed to get response for edited message: ${error.message || 'Unknown error'}`);
      if (lastMessageIdRef.current) {
        setMessages(prev => prev.filter(m => m.id !== lastMessageIdRef.current));
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteChat = (conversationId: string) => {
    const userSettingsRaw = localStorage.getItem(USER_SETTINGS_KEY);
    let confirmAction = true; 
    if (userSettingsRaw) {
      try {
        const parsedSettings: UserSettings = JSON.parse(userSettingsRaw);
        if (parsedSettings.confirmClearChat !== undefined) {
            confirmAction = parsedSettings.confirmClearChat;
        }
      } catch(e) {console.error("Failed to parse user settings for delete confirmation.")}
    }

    if (confirmAction && !window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      return;
    }

    chatHistoryService.deleteConversation(conversationId);
    const updatedConversations = loadConversations();
    if (activeConversationId === conversationId) {
      if (updatedConversations.length > 0) {
        handleSelectChat(updatedConversations[0].id);
      } else {
        startNewChat({trigger: 'user_action'});
      }
    }
  };

  const handleRenameChat = (conversationId: string, newTitle: string) => {
    chatHistoryService.renameConversationTitle(conversationId, newTitle);
    loadConversations(); 
  };
  
  const handleClearAllChatHistory = () => {
    const userSettingsRaw = localStorage.getItem(USER_SETTINGS_KEY);
    let confirmAction = true; 
    if (userSettingsRaw) {
        try {
            const parsedSettings: UserSettings = JSON.parse(userSettingsRaw);
             if (parsedSettings.confirmClearChat !== undefined) {
                confirmAction = parsedSettings.confirmClearChat;
            }
        } catch(e) { console.error("Failed to parse user settings for clear all confirmation.") }
    }

    if (confirmAction && !window.confirm("Are you sure you want to delete ALL chat history? This action cannot be undone.")) {
        return;
    }
    chatHistoryService.clearAllConversations();
    loadConversations(); 
    startNewChat({trigger: 'user_action'});    
  };

  const handleExportAllChatHistory = () => {
      chatHistoryService.exportAllConversations();
  };

  const handleImportHistoryRequest = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const importResult = await chatHistoryService.importConversations(file);
        alert(importResult.message); // Or use a more sophisticated notification
        if (importResult.success && importResult.importedCount > 0) {
          const updatedConversations = loadConversations();
          const mostRecentImportedId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
          if (mostRecentImportedId) {
            handleSelectChat(mostRecentImportedId, 'import_new');
          } else {
            startNewChat({ trigger: 'import_new' });
          }
        }
      }
      if (target) target.value = ''; // Reset input value
    };
    fileInput.click();
  };

  const handleRunCodeFromMessage = useCallback((code: string, language?: string) => {
    navigate(APP_ROUTES.PLAYGROUND, { 
        state: { 
            initialCode: code, 
            initialLanguage: language,
            autoRunFromChat: true 
        } 
    });
  }, [navigate]);


  if (!user) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  if (initializationError && !isGeminiAvailable) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <AppLogo className="w-40 h-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-3">AI Service Error</h2>
            <p className="text-center max-w-md mb-6 text-sm text-red-600 dark:text-red-400">{initializationError}</p>
            <p className="text-sm mb-2">Please check your API key configuration and network connection.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Refer to console logs for more details or the README for setup instructions.</p>
            <div className="flex space-x-3">
                <Button onClick={() => window.location.reload()} variant="primary">Refresh Page</Button>
                <Button onClick={() => logout()} variant="outline">Logout</Button>
            </div>
        </div>
    );
  }

  const currentConversation = conversations.find(c => c.id === activeConversationId);
  const currentConversationTitle = currentConversation?.title || t('chatPage.header.defaultTitle');
  const currentModelDisplay = currentChatSettings?.model || GEMINI_CHAT_MODEL;
  const isGoogleSearchActiveForSession = currentChatSettings?.isGoogleSearchEnabled === true && (user.plan === UserPlan.PREMIUM || user.plan === UserPlan.PREMIUM_ULTRA2);
  const isTechnicalVocabularyActive = currentChatSettings?.useTechnicalVocabulary === true;
  const currentInteractionStyle = currentChatSettings?.interactionStyle || InteractionStyle.DEFAULT;
  const isFastResponseActive = currentChatSettings?.prioritizeFastResponse === true && currentModelDisplay === GEMINI_CHAT_MODEL && !isGoogleSearchActiveForSession;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-200 dark:bg-slate-900">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={startNewChat}
        onLogout={logout}
        userName={user.name}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onClearAllChatHistory={handleClearAllChatHistory}
        onExportAllChatHistory={handleExportAllChatHistory}
        onImportHistoryRequest={handleImportHistoryRequest}
      />
      <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 is crucial for flex item to shrink properly */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center min-w-0">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 mr-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="Open sidebar"
              >
                <SidebarOpenIcon />
              </button>
            )}
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate pr-2" title={currentConversationTitle}>
              {currentConversationTitle}
            </h2>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2 text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
            {isFastResponseActive && (
                <span className="flex items-center p-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md" title="Fast Response Mode Active">
                   <BoltIcon className="w-4 h-4 mr-1" /> Fast
                </span>
            )}
            <span className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md" title={`AI Model: ${currentModelDisplay}`}>
               <PageCpuChipIcon className="w-4 h-4 mr-1" /> {currentModelDisplay.split('/').pop()?.replace(/-/g, ' ').replace('preview 04 17', 'Flash')}
            </span>
            {isGoogleSearchActiveForSession && (
                <span className="flex items-center p-1.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-md" title="Google Search Active">
                    <PageGlobeAltIcon className="w-4 h-4 mr-1" /> Search
                </span>
            )}
            {isTechnicalVocabularyActive && (
                <span className="flex items-center p-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-md" title="Technical Vocabulary Active">
                    <PageAcademicCapIcon className="w-4 h-4 mr-1" /> Tech Vocab
                </span>
            )}
             <span 
                className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md" 
                title={`Interaction Style: ${INTERACTION_STYLE_DETAILS[currentInteractionStyle].label}`}
             >
                {React.cloneElement(INTERACTION_STYLE_DETAILS[currentInteractionStyle].icon, { className: "w-4 h-4 mr-1"})} 
                {INTERACTION_STYLE_DETAILS[currentInteractionStyle].label}
            </span>
          </div>
        </header>
        {isLoading && messages.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-lightgray dark:bg-slate-800">
             <LoadingSpinner size="lg" />
             <p className="mt-3">Loading chat session...</p>
           </div>
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onRegenerateResponse={handleRegenerateResponse}
            onEditUserMessage={handleEditUserMessage}
            isLoading={isLoading}
            chatError={chatError}
            setChatError={setChatError}
            user={user}
            currentChatSettings={currentChatSettings}
            onSettingsChangeRequiresNewChat={handleSettingsChangeRequiresNewChat}
            onRunCode={handleRunCodeFromMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
