// Code Complete Review: 20240815120000
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import MermaidDiagramComponent from './MermaidDiagram'; // Import the new MermaidDiagram component
import { Part as GenAiPart } from '@google/genai';


interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerateResponse?: (promptId: string) => void;
  isEditable?: boolean;
  onEditUserMessageRequest?: (messageId: string, currentText: string) => void;
  referencedUserAttachment?: { parts: GenAiPart[], names: string[] };
  onRunCode?: (code: string, language?: string) => void; // New prop for running code
  isSendingMessage: boolean; // New prop to know if a message is currently being processed
}

// --- SVG Icons for Copy Functionality ---
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

// --- SVG Icons for AI/User Message Actions ---
const EllipsisVerticalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
       <title>Message actions</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
);

const PencilSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
        <title>Edit</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const ArrowPathIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
        <title>Regenerate</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const PlayIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Run Code</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

// Google Icon for sourced messages
const GoogleIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <title>Google</title>
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.12,4.73 17.07,6.08 17.07,6.08L19.07,4.15C19.07,4.15 16.57,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,12.11 21.48,11.53 21.35,11.1Z" />
  </svg>
);


interface CodeBlockDisplayProps {
  code: string;
  language?: string;
  onRunCode?: (code: string, language?: string) => void;
  runCodeDisabled?: boolean; // Typically indicates if AI is busy
}

const CodeBlockDisplay: React.FC<CodeBlockDisplayProps> = ({ code, language, onRunCode, runCodeDisabled }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy code: ', err);
      alert('Failed to copy code. Your browser might not support this feature or permissions may be denied.');
    });
  };

  const isCodeEffectivelyEmpty = !code || code.trim() === '';
  const isDisabled = runCodeDisabled || isCodeEffectivelyEmpty;

  let runButtonTitle = "Simulate Code Execution";
  if (isCodeEffectivelyEmpty) {
    runButtonTitle = "Cannot run: Code is empty.";
  } else if (runCodeDisabled) {
    runButtonTitle = "Cannot run: AI is busy.";
  }

  return (
    <div className="relative group my-1.5">
      {language && <span className="absolute top-2 left-2 text-xs text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded-sm">{language}</span>}
      <pre className="font-mono font-khmer bg-gray-200 text-gray-800 dark:bg-slate-800 dark:text-slate-200 p-3 pr-10 rounded-md overflow-x-auto text-sm whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2 flex space-x-1.5">
        {onRunCode && (
          <button
            onClick={() => onRunCode(code, language)}
            disabled={isDisabled}
            title={runButtonTitle}
            aria-label={runButtonTitle}
            className={`p-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 ease-in-out ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <PlayIcon />
          </button>
        )}
        <button
          onClick={handleCopyCode}
          title={copied ? "Code Copied!" : "Copy Code"}
          aria-label={copied ? "Code Copied!" : "Copy Code"}
          className="p-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150 ease-in-out"
        >
          {copied ? <CopiedIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};

const ExternalLinkIcon = ({ className = "w-3 h-3 ml-1 opacity-70" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <title>External Link</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);


const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    onRegenerateResponse,
    isEditable,
    onEditUserMessageRequest,
    referencedUserAttachment,
    onRunCode,
    isSendingMessage,
}) => {
  const isUser = message.sender === 'user';
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';

  const baseBubbleStyle = "relative rounded-lg shadow-md dark:shadow-slate-900/40 flex flex-col";
  const userSpecificStyle = `bg-primary text-white self-end rounded-br-none p-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg`;
  const aiSpecificStyle = `bg-lightgray dark:bg-slate-700 text-gray-800 dark:text-slate-200 self-start rounded-bl-none p-3.5 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl`;

  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [textCopiedStatus, setTextCopiedStatus] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    };
    if (showActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsMenu]);

  const handleCopyMessageText = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setTextCopiedStatus(true);
      setTimeout(() => setTextCopiedStatus(false), 2000);
    }).catch(err => {
      console.error('Failed to copy message text: ', err);
    });
    setShowActionsMenu(false);
  };

  const handleTriggerAIRegenerate = () => {
    if (onRegenerateResponse && message.promptId && !isSendingMessage) {
      onRegenerateResponse(message.promptId);
    }
    setShowActionsMenu(false);
  };

  const handleTriggerUserEdit = () => {
    if (onEditUserMessageRequest && message.id) {
      onEditUserMessageRequest(message.id, message.text);
    }
    setShowActionsMenu(false);
  };

  const renderContent = (text: string, messageId: string) => {
    const parts = text.split(/(```(?:mermaid|[\w-#+]+)?\n[\s\S]*?\n```)/g);
    return parts.map((part, index) => {
      const match = part.match(/^```(mermaid|[\w-#+]+)?\n([\s\S]*?)\n```$/);
      if (match) {
        const languageOrType = match[1]; // Language (e.g., javascript) or 'mermaid'
        const codeContent = match[2];
        const uniqueKey = `${messageId}-block-${index}`;

        if (languageOrType === 'mermaid') {
          return <MermaidDiagramComponent key={uniqueKey} syntax={codeContent} messageId={uniqueKey} />;
        }
        return (
            <CodeBlockDisplay 
                key={uniqueKey} 
                code={codeContent} 
                language={languageOrType} 
                onRunCode={onRunCode}
                runCodeDisabled={isSendingMessage}
            />
        );
      }
      // Apply Khmer font styling if the language is Khmer (using :lang(km) in CSS)
      // The actual font application is handled globally via CSS.
      // Here, we ensure the `lang="km"` attribute is applied if needed for semantic correctness or specific overrides.
      // For general text, it's usually fine without explicit lang attribute here if the global CSS handles it.
      // However, for mixed content, it could be beneficial.
      // For simplicity now, we assume global CSS and font-family stacks handle Khmer.
      // Check if the part contains Khmer characters to apply lang="km"
      const containsKhmer = /[\u1780-\u17FF]/.test(part);
      return <span key={`${messageId}-text-${index}`} className="whitespace-pre-wrap break-words" lang={containsKhmer ? "km" : undefined}>{part}</span>;
    });
  };

  return (
    <div className={`${containerClasses} group`}>
      <div className={`${baseBubbleStyle} ${isUser ? userSpecificStyle : aiSpecificStyle}`}>
        {referencedUserAttachment && referencedUserAttachment.parts.length > 0 && (
          <div className="mb-2 p-2 bg-slate-200 dark:bg-slate-600 rounded-md">
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-1">User Attached:</p>
            <div className="flex flex-wrap gap-2">
              {referencedUserAttachment.parts.map((part, index) => (
                part.inlineData && (
                  <div key={`ref-img-${index}`} className="relative">
                    <img
                      src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
                      alt={referencedUserAttachment.names[index] || 'Attached image'}
                      className="w-16 h-16 object-cover rounded-md border border-slate-400 dark:border-slate-500"
                    />
                    <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[10px] px-1 py-0.5 truncate rounded-b-md" title={referencedUserAttachment.names[index] || 'Attached image'}>
                      {referencedUserAttachment.names[index] || 'Image'}
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        {message.imageUrls && message.imageUrls.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                    <img 
                        src={url} 
                        alt={message.imageFileNames?.[index] || `Attached image ${index + 1}`} 
                        className="w-24 h-24 object-cover rounded-md border border-slate-300 dark:border-slate-500" 
                    />
                    {message.imageFileNames?.[index] && (
                        <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 truncate rounded-b-md" title={message.imageFileNames?.[index]}>
                            {message.imageFileNames?.[index]}
                        </p>
                    )}
                </div>
            ))}
          </div>
        )}
        
        <div className="text-sm leading-relaxed">
          {renderContent(message.text, message.id)}
        </div>

        {/* Display Grounding Sources */}
        {message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-300 dark:border-slate-500">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                    <GoogleIcon className="mr-1.5 text-slate-500 dark:text-slate-400" /> {/* Adjusted icon class for consistency */}
                    Sources:
                </p>
                <ul className="list-none pl-0 space-y-0.5">
                    {message.groundingChunks.map((chunk, index) => (
                        chunk.web && chunk.web.uri && ( // Ensure chunk.web and chunk.web.uri exist
                            <li key={`grounding-${index}`} className="text-xs">
                                <a
                                    href={chunk.web.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline break-all flex items-center"
                                    title={chunk.web.uri} // Show URI on hover for clarity
                                >
                                    <span>{chunk.web.title || chunk.web.uri}</span> {/* Display title or URI */}
                                    <ExternalLinkIcon />
                                </a>
                            </li>
                        )
                    ))}
                </ul>
            </div>
        )}
        
        <div className="flex items-end justify-between mt-1.5 pt-1 text-xs">
            <span className={`${isUser ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'} opacity-80`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.isEdited && <span className="ml-1.5 italic text-[11px]">(edited)</span>}
            </span>

           {/* Message Actions Button */}
            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out">
                <button
                    onClick={() => setShowActionsMenu(prev => !prev)}
                    className={`p-1 rounded-md ${isUser ? 'text-blue-200 hover:bg-blue-700' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                    aria-label="Message actions"
                    aria-haspopup="true"
                    aria-expanded={showActionsMenu}
                    title="Message actions"
                >
                    <EllipsisVerticalIcon />
                </button>
                {showActionsMenu && (
                    <div 
                        ref={actionsMenuRef}
                        className="absolute bottom-full right-0 mb-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10 py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="message-actions-button" // Assuming the button above has this ID
                    >
                        <button
                            onClick={handleCopyMessageText}
                            className="w-full text-left px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
                            role="menuitem"
                            title={textCopiedStatus ? "Copied!" : "Copy message text"}
                        >
                           {textCopiedStatus ? <CopiedIcon className="w-4 h-4 mr-2 text-accent"/> : <CopyIcon className="w-4 h-4 mr-2" />}
                            Copy Text
                        </button>
                        {isUser && isEditable && onEditUserMessageRequest && (
                            <button
                                onClick={handleTriggerUserEdit}
                                className="w-full text-left px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center"
                                role="menuitem"
                                title="Edit this message"
                                disabled={isSendingMessage}
                            >
                                <PencilSquareIcon /> Edit
                            </button>
                        )}
                        {!isUser && onRegenerateResponse && message.promptId && (
                            <button
                                onClick={handleTriggerAIRegenerate}
                                className={`w-full text-left px-3 py-1.5 text-sm flex items-center ${isSendingMessage ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                role="menuitem"
                                title={isSendingMessage ? "Cannot regenerate: AI is busy" : "Regenerate AI response"}
                                disabled={isSendingMessage}
                            >
                                <ArrowPathIcon /> Regenerate
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;