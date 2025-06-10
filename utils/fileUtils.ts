// Code Complete Review: 20240815120000
import { Part as GenAiPart } from "@google/genai";

/**
 * Converts a File object to a GenAI Part suitable for inclusion in API requests,
 * specifically for inline image data. This involves reading the file as a Data URL,
 * extracting the Base64 encoded data, and constructing the Part object.
 * @param file The File object to convert.
 * @returns {Promise<GenAiPart>} A Promise that resolves to a GenAiPart object
 *                                containing the inline data (MIME type and Base64 string).
 */
export const fileToGenerativePart = async (file: File): Promise<GenAiPart> => {
  const base64String = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      mimeType: file.type,
      data: base64String,
    },
  };
};

/**
 * Utility to format bytes into a readable string (KB, MB, GB).
 * This function is a general utility and is not actively used in the current UI,
 * but is available for future enhancements if file size display is needed.
 * @param bytes The number of bytes.
 * @param decimals The number of decimal places to display.
 * @returns A string representing the formatted file size.
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};