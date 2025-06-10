// Code Complete Review: 20240815120000
import { Part } from "@google/genai"; 

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  profilePictureUrl?: string; 
}

export enum UserPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PREMIUM_ULTRA2 = 'PREMIUM_ULTRA2', // Added new plan
}

export enum InteractionStyle {
  DEFAULT = 'DEFAULT',
  AGENT = 'AGENT',
  ASK_ASK = 'ASK_ASK',
  MANUAL = 'MANUAL',
  SC_ARCHITECT = 'SC_ARCHITECT',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  imageUrls?: string[]; 
  imageFileNames?: string[]; 
  promptId?: string; // For AI messages, this links back to the user's message ID that prompted this AI response.
  originalParts?: Part[]; 
  isEdited?: boolean; 
  groundingChunks?: Array<{ web: { uri?: string; title?: string } }>; 
}

// --- Types for Persistent Chat History ---
export interface StoredChatMessage extends ChatMessage {} // For now, same as ChatMessage

export interface ConversationSettingsSnapshot {
  model: string;
  userPlan: UserPlan; // User's plan when this conversation was active
  isGoogleSearchEnabled?: boolean;
  useTechnicalVocabulary?: boolean;
  interactionStyle?: InteractionStyle; // Added interaction style
  prioritizeFastResponse?: boolean; // Added for fast response mode
}

export interface StoredConversation {
  id: string; // Unique ID for the conversation
  title: string; // Title of the conversation (e.g., first user message)
  messages: StoredChatMessage[];
  createdAt: number; // Timestamp of creation
  lastUpdatedAt: number; // Timestamp of last message or update
  settingsSnapshot: ConversationSettingsSnapshot; // Settings at the time of creation/significant update
}

export interface ChatHistories {
  [conversationId: string]: StoredConversation;
}
// --- End of Types for Persistent Chat History ---


export interface PricingPlanDetails {
  id: UserPlan;
  name: string;
  price: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  isUltra?: boolean; // Optional flag for styling Ultra plans
}

export interface DecodedJWT {
  exp: number;
  // other claims if any
}

export type ThemeSetting = 'light' | 'dark' | 'system';
export type AppliedTheme = 'light' | 'dark';

export interface UserSettings {
  defaultSpeechLanguage: 'en-US' | 'km-KH';
  theme: ThemeSetting;
  confirmClearChat: boolean;
  useTechnicalVocabulary: boolean; 
  isGoogleSearchEnabled?: boolean; // Added for global default Google Search preference
  interactionStyle?: InteractionStyle; // Added for global default interaction style
  prioritizeFastResponse?: boolean; // Added for global default fast response preference
}

// --- Type definition for StartNewChatOptions (moved from ChatPage.tsx) ---
export type StartNewChatOptions = {
  conversationId?: string; // If starting from an existing one
  trigger?: 'user_action' | 'settings_change_local_tools' | 'settings_change_global_defaults' | 'load_most_recent' | 'import_new'; // Source of new chat request
  initialSettings?: Partial<ConversationSettingsSnapshot>; // Added for specific initial settings
};


// --- Speech Recognition API Types ---
export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
  length: number; // Required by SpeechRecognitionResultList
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string; // Standard errors like 'no-speech', 'audio-capture', etc.
  readonly message: string;
}

export interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

export interface SpeechRecognitionEventMap {
  audiostart: Event;
  audioend: Event;
  end: Event;
  error: SpeechRecognitionErrorEvent;
  nomatch: SpeechRecognitionEvent;
  result: SpeechRecognitionEvent;
  soundstart: Event;
  soundend: Event;
  speechstart: Event;
  speechend: Event;
  start: Event;
}

// Extend EventTarget to be more specific if needed, or ensure SpeechRecognition interface includes addEventListener/removeEventListener
export interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  // serviceURI: string; // Deprecated

  start(): void;
  stop(): void;
  abort(): void;

  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

  addEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

export interface SpeechGrammar {
  src: string;
  weight: number;
}

export interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}
// --- End of Speech Recognition API Types ---

// --- i18n Types ---
export type LanguageCode = 'en' | 'km';
export type TranslationKey = string; // For simplicity, can be more specific later
export type Translations = Record<TranslationKey, string>;
// --- End of i18n Types ---
