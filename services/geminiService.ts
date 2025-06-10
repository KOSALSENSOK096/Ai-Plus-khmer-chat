// Code Complete Review: 20240815120000
import { GoogleGenAI, Chat, GenerateContentResponse, Part, Content, GenerateImagesResponse } from "@google/genai"; // Added Content type & GenerateImagesResponse
import { GEMINI_CHAT_MODEL, IMAGEN_MODEL, INTERACTION_STYLE_SYSTEM_PROMPTS, COMMON_SYSTEM_INSTRUCTION_SUFFIX } from '../constants';
import { UserPlan, InteractionStyle } from "../types";

let ai: GoogleGenAI | null = null;
// Safely access the API key
const apiKeyFromEnv = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

if (apiKeyFromEnv) {
  try {
    ai = new GoogleGenAI({ apiKey: apiKeyFromEnv });
    console.log("GoogleGenAI service initialized successfully.");
  } catch (e) {
    console.error(
        "CRITICAL: Failed to initialize GoogleGenAI instance. This might be due to an invalid API_KEY (sourced from 'process.env.API_KEY'), network issues, or other configuration problems. " +
        "Please ensure 'process.env.API_KEY' is a valid Google Generative AI API key and check your network connection. " +
        "The Gemini AI service will be unavailable. Details:",
        e
    );
    ai = null; // Ensure ai is null on failure
  }
} else {
  console.error(
    "CRITICAL: 'process.env.API_KEY' is not defined or 'process' object is unavailable. The Gemini AI service requires this environment variable to be set with a valid Google Generative AI API key. " +
    "The chat functionality will be unavailable. Please refer to the setup instructions or documentation to configure the API_KEY environment variable."
  );
  ai = null; // Ensure ai is null if no key
}

export const isGeminiClientInitialized = (): boolean => {
  return ai !== null;
};

export const geminiService = {
  startChatSession: (
    userPlan?: UserPlan, 
    isGoogleSearchEnabled?: boolean, 
    useTechnicalVocabulary?: boolean,
    interactionStyle?: InteractionStyle,
    prioritizeFastResponse?: boolean // New parameter for fast response mode
  ): Chat | null => {
    if (!ai) {
      console.warn("Gemini AI service not initialized (API key likely missing, invalid, or initialization failed). Cannot start chat session.");
      return null;
    }

    let systemInstructionText = INTERACTION_STYLE_SYSTEM_PROMPTS[interactionStyle || InteractionStyle.DEFAULT];
    systemInstructionText += COMMON_SYSTEM_INSTRUCTION_SUFFIX;
    
    if (useTechnicalVocabulary) {
      systemInstructionText += "Please use precise, formal, and technical vocabulary where appropriate for the topic.\n";
    } else {
      systemInstructionText += "Please use generally understandable language and avoid overly technical jargon unless specifically requested or necessary for the topic.\n";
    }
    
    const systemInstructionContent: Content = { 
      role: 'system',
      parts: [{ text: systemInstructionText }] 
    };
    
    const chatParams: {
      model: string;
      systemInstruction?: Content;
      tools?: Array<{ googleSearch?: Record<string, unknown> }>;
      config?: { 
        temperature?: number;
        topK?: number;
        topP?: number;
        thinkingConfig?: { thinkingBudget: number };
      };
    } = {
      model: GEMINI_CHAT_MODEL,
      systemInstruction: systemInstructionContent,
      config: {} // Initialize config object
    };
    
    if ((userPlan === UserPlan.PREMIUM || userPlan === UserPlan.PREMIUM_ULTRA2) && isGoogleSearchEnabled) {
        chatParams.tools = [{ googleSearch: {} }];
        // Ensure thinkingConfig is not set if Google Search is enabled
        if (chatParams.config && chatParams.config.thinkingConfig) {
            delete chatParams.config.thinkingConfig;
        }
    } else if (GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17') { 
        if (prioritizeFastResponse) {
            // If fast response is prioritized (and not using Google Search), disable thinking
            chatParams.config.thinkingConfig = { thinkingBudget: 0 };
        } else {
            // For 'gemini-2.5-flash-preview-04-17' without Google Search & without fast response prioritization:
            // Omit thinkingConfig to use the model's default behavior for chat (higher quality).
        }
    }

    // If config object is empty after all logic, remove it to keep params clean
    if (chatParams.config && Object.keys(chatParams.config).length === 0) {
        delete chatParams.config;
    }

    return ai.chats.create(chatParams);
  },

  generateImageFromPrompt: async (prompt: string): Promise<GenerateImagesResponse | null> => {
    if (!ai) {
      console.warn("Gemini AI service not initialized. Cannot generate image.");
      throw new Error("AI service not initialized.");
    }
    try {
      const response: GenerateImagesResponse = await ai.models.generateImages({
        model: IMAGEN_MODEL,
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });
      return response;
    } catch (error) {
      console.error("Error generating image via Gemini:", error);
      throw error; // Re-throw to be handled by the caller
    }
  }
};