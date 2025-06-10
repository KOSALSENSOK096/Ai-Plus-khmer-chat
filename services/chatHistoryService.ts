// Code Complete Review: 20240815120000
// This service manages the persistence of chat conversations,
// including loading, saving, deleting, and utility functions for chat history.
// It handles sanitization of messages for storage (e.g., removing blob URLs, image data from parts).
import { Part as GenAiPart } from '@google/genai';
import { CHAT_HISTORY_STORAGE_KEY } from '../constants';
import { ChatHistories, StoredConversation, StoredChatMessage } from '../types';

// Helper function to ensure originalParts are storable.
// For image parts, this means their inlineData (base64) is preserved.
const sanitizeOriginalPartsForStorage = (originalParts?: GenAiPart[]): GenAiPart[] | undefined => {
  if (!originalParts) {
    return undefined;
  }
  // Assuming originalParts are already structured correctly:
  // - Text parts are { text: "..." }
  // - Image parts from fileToGenerativePart are { inlineData: { mimeType: "image/...", data: "base64..." } }
  // No specific sanitization is needed here if the structure is correct and doesn't contain non-storable elements like live blobs.
  return originalParts;
};

const chatHistoryService = {
  loadAllConversations: (): ChatHistories => {
    try {
      const storedHistories = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (storedHistories) {
        const parsed = JSON.parse(storedHistories) as ChatHistories;
        // Ensure messages have Date objects
        Object.values(parsed).forEach(conv => {
          conv.messages.forEach(msg => {
            msg.timestamp = new Date(msg.timestamp);
          });
          // Ensure createdAt and lastUpdatedAt are numbers
          conv.createdAt = typeof conv.createdAt === 'string' ? new Date(conv.createdAt).getTime() : Number(conv.createdAt);
          conv.lastUpdatedAt = typeof conv.lastUpdatedAt === 'string' ? new Date(conv.lastUpdatedAt).getTime() : Number(conv.lastUpdatedAt);
        });
        return parsed;
      }
    } catch (error) {
      console.error("Error loading chat histories from localStorage:", error);
    }
    return {};
  },

  saveConversation: (conversation: StoredConversation): void => {
    try {
      const allConversations = chatHistoryService.loadAllConversations();
      
      const sanitizedMessages = conversation.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp, // Keep as Date object for JSON.stringify
        imageUrls: undefined, // Remove blob URLs
        originalParts: sanitizeOriginalPartsForStorage(msg.originalParts), // Sanitize/pass-through parts
      }));

      allConversations[conversation.id] = {
        ...conversation,
        messages: sanitizedMessages,
        createdAt: conversation.createdAt, 
        lastUpdatedAt: conversation.lastUpdatedAt, 
      };
      localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(allConversations));
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error(`Error saving conversation ${conversation.id} to localStorage: Quota exceeded.`, error);
        alert("LocalStorage is full. Cannot save more chat history. Please consider clearing some history or exporting it.");
      } else {
        console.error(`Error saving conversation ${conversation.id} to localStorage:`, error);
      }
    }
  },

  saveMultipleConversations: (conversations: ChatHistories): void => {
    try {
      const serializableConversations: ChatHistories = {};
      for (const convId in conversations) {
        const conv = conversations[convId];
        const sanitizedMessages = conv.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp, // Keep as Date object
          imageUrls: undefined, // Remove blob URLs
          originalParts: sanitizeOriginalPartsForStorage(msg.originalParts), // Sanitize/pass-through parts
        }));
        serializableConversations[convId] = {
          ...conv,
          messages: sanitizedMessages,
          createdAt: conv.createdAt,
          lastUpdatedAt: conv.lastUpdatedAt,
        };
      }
      localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(serializableConversations));
    } catch (error: any) {
       if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error("Error saving multiple chat histories to localStorage: Quota exceeded.", error);
        alert("LocalStorage is full. Cannot save more chat history. Please consider clearing some history or exporting it.");
      } else {
        console.error("Error saving multiple chat histories to localStorage:", error);
      }
    }
  },

  getConversation: (id: string): StoredConversation | undefined => {
    const allConversations = chatHistoryService.loadAllConversations();
    return allConversations[id];
  },

  deleteConversation: (id: string): void => {
    try {
      const allConversations = chatHistoryService.loadAllConversations();
      delete allConversations[id];
      chatHistoryService.saveMultipleConversations(allConversations);
    } catch (error) {
      console.error(`Error deleting conversation ${id} from localStorage:`, error);
    }
  },

  renameConversationTitle: (id: string, newTitle: string): boolean => {
    try {
      const allConversations = chatHistoryService.loadAllConversations();
      if (allConversations[id]) {
        allConversations[id].title = newTitle;
        allConversations[id].lastUpdatedAt = Date.now();
        chatHistoryService.saveMultipleConversations(allConversations);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error renaming conversation ${id} in localStorage:`, error);
      return false;
    }
  },

  generateNewConversationId: (): string => {
    return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  },

  getMostRecentConversationId: (): string | null => {
    const histories = chatHistoryService.loadAllConversations();
    const conversationsArray = Object.values(histories);
    if (conversationsArray.length === 0) {
      return null;
    }
    conversationsArray.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
    return conversationsArray[0].id;
  },

  clearAllConversations: (): void => {
    try {
      localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
      console.log("All chat histories cleared from localStorage.");
    } catch (error) {
      console.error("Error clearing all chat histories from localStorage:", error);
    }
  },

  exportAllConversations: (): void => {
    try {
      const allConversations = chatHistoryService.loadAllConversations(); // These are already sanitized for blob URLs and parts if loaded through app
      if (Object.keys(allConversations).length === 0) {
        console.info("No chat history to export.");
        alert("No chat history to export.");
        return;
      }
      const jsonString = JSON.stringify(allConversations, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `ai-plus-khmer-chat-history-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("All chat histories exported successfully.");
    } catch (error) {
      console.error("Error exporting chat histories:", error);
      alert("Failed to export chat history. See console for more details.");
    }
  },

  importConversations: async (file: File): Promise<{ success: boolean; message: string; importedCount: number; skippedCount: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const fileContent = event.target?.result as string;
          if (!fileContent) {
            resolve({ success: false, message: "File is empty or unreadable.", importedCount: 0, skippedCount: 0 });
            return;
          }
          const importedData = JSON.parse(fileContent);

          if (typeof importedData !== 'object' || importedData === null) {
            resolve({ success: false, message: "Invalid file format: Not a JSON object.", importedCount: 0, skippedCount: 0 });
            return;
          }

          const existingConversations = chatHistoryService.loadAllConversations();
          let importedCount = 0;
          let skippedCount = 0;

          for (const convId in importedData) {
            if (Object.prototype.hasOwnProperty.call(importedData, convId)) {
              const importedConv = importedData[convId] as StoredConversation;

              if (
                !importedConv.id ||
                typeof importedConv.title !== 'string' ||
                !Array.isArray(importedConv.messages) ||
                (typeof importedConv.createdAt !== 'number' && typeof importedConv.createdAt !== 'string') ||
                (typeof importedConv.lastUpdatedAt !== 'number' && typeof importedConv.lastUpdatedAt !== 'string') ||
                typeof importedConv.settingsSnapshot !== 'object'
              ) {
                console.warn(`Skipping conversation with ID ${convId} due to missing or invalid basic fields.`);
                skippedCount++;
                continue;
              }

              if (existingConversations[importedConv.id]) {
                skippedCount++;
                continue; 
              }
              
              const validMessages: StoredChatMessage[] = [];
              let messagesAreValid = true;
              for (const msg of importedConv.messages) {
                if (!msg.id || typeof msg.text !== 'string' || !msg.sender || !msg.timestamp) {
                  console.warn(`Skipping message in conversation ${convId} due to missing fields.`);
                  messagesAreValid = false;
                  break;
                }
                validMessages.push({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                  imageUrls: undefined, // Ensure no blob URLs are imported
                  originalParts: sanitizeOriginalPartsForStorage(msg.originalParts), // Sanitize parts on import
                });
              }

              if (!messagesAreValid) {
                console.warn(`Skipping conversation ${convId} due to invalid messages.`);
                skippedCount++;
                continue;
              }

              existingConversations[importedConv.id] = {
                ...importedConv,
                messages: validMessages,
                createdAt: typeof importedConv.createdAt === 'string' ? new Date(importedConv.createdAt).getTime() : Number(importedConv.createdAt),
                lastUpdatedAt: typeof importedConv.lastUpdatedAt === 'string' ? new Date(importedConv.lastUpdatedAt).getTime() : Number(importedConv.lastUpdatedAt),
              };
              importedCount++;
            }
          }

          if (importedCount > 0) {
            chatHistoryService.saveMultipleConversations(existingConversations);
          }
          
          let message = `Imported ${importedCount} conversation(s).`;
          if (skippedCount > 0) {
            message += ` Skipped ${skippedCount} conversation(s) (duplicates or invalid format).`;
          }
          if (importedCount === 0 && skippedCount === 0) {
            message = "No new conversations found in the file to import.";
          }
          resolve({ success: true, message, importedCount, skippedCount });

        } catch (error) {
          console.error("Error importing conversations:", error);
          resolve({ success: false, message: `Import failed: ${(error as Error).message}`, importedCount: 0, skippedCount: 0 });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, message: "Failed to read the file.", importedCount: 0, skippedCount: 0 });
      };
      reader.readAsText(file);
    });
  }
};

export default chatHistoryService;