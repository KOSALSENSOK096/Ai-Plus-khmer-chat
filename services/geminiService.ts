// Code Complete Review: 20240815120000
import { GoogleGenAI, Chat, GenerateContentResponse, Part, Content, GenerateImagesResponse } from "@google/genai";
import { GEMINI_CHAT_MODEL, IMAGEN_MODEL, INTERACTION_STYLE_SYSTEM_PROMPTS, COMMON_SYSTEM_INSTRUCTION_SUFFIX } from '../constants';
import { UserPlan, InteractionStyle } from "../types";

// 使用环境变量获取API密钥
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyBoGp-yURXRXR53LQ1dey5-LgzlE1PPcQM";

class GeminiService {
  private static instance: GeminiService;
  private ai: GoogleGenAI | null = null;
  
  private constructor() {
    try {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
      console.log("GoogleGenAI service initialized successfully.");
    } catch (e) {
      console.error(
        "CRITICAL: Failed to initialize GoogleGenAI instance. Details:",
        e
      );
      this.ai = null;
    }
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public isInitialized(): boolean {
    return this.ai !== null;
  }

  public startChatSession(
    userPlan?: UserPlan,
    isGoogleSearchEnabled?: boolean,
    useTechnicalVocabulary?: boolean,
    interactionStyle?: InteractionStyle,
    prioritizeFastResponse?: boolean
  ): Chat | null {
    if (!this.ai) {
      console.warn("Gemini AI service not initialized. Cannot start chat session.");
      return null;
    }

    const systemInstructionText = this.buildSystemInstruction(
      interactionStyle,
      useTechnicalVocabulary
    );

    const chatParams = this.buildChatParams(
      systemInstructionText,
      userPlan,
      isGoogleSearchEnabled,
      prioritizeFastResponse
    );

    return this.ai.chats.create(chatParams);
  }

  private buildSystemInstruction(
    interactionStyle?: InteractionStyle,
    useTechnicalVocabulary?: boolean
  ): string {
    let instruction = INTERACTION_STYLE_SYSTEM_PROMPTS[interactionStyle || InteractionStyle.DEFAULT];
    instruction += COMMON_SYSTEM_INSTRUCTION_SUFFIX;

    if (useTechnicalVocabulary) {
      instruction += "Please use precise, formal, and technical vocabulary where appropriate for the topic.\n";
    } else {
      instruction += "Please use generally understandable language and avoid overly technical jargon unless specifically requested or necessary for the topic.\n";
    }

    return instruction;
  }

  private buildChatParams(
    systemInstructionText: string,
    userPlan?: UserPlan,
    isGoogleSearchEnabled?: boolean,
    prioritizeFastResponse?: boolean
  ) {
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
      config: {}
    };

    // 配置Google搜索和思考预算
    if ((userPlan === UserPlan.PREMIUM || userPlan === UserPlan.PREMIUM_ULTRA2) && isGoogleSearchEnabled) {
      chatParams.tools = [{ googleSearch: {} }];
    } else if (GEMINI_CHAT_MODEL === 'gemini-2.5-flash-preview-04-17') {
      if (prioritizeFastResponse) {
        chatParams.config = { thinkingConfig: { thinkingBudget: 0 } };
      }
    }

    // 如果配置对象为空，则删除它
    if (Object.keys(chatParams.config || {}).length === 0) {
      delete chatParams.config;
    }

    return chatParams;
  }

  public async generateImageFromPrompt(prompt: string): Promise<GenerateImagesResponse> {
    if (!this.ai) {
      throw new Error("AI service not initialized.");
    }

    try {
      return await this.ai.models.generateImages({
        model: IMAGEN_MODEL,
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });
    } catch (error) {
      console.error("Error generating image via Gemini:", error);
      throw error;
    }
  }
}

// 导出单例实例
export const geminiService = GeminiService.getInstance();
export const isGeminiClientInitialized = () => geminiService.isInitialized();