// Code Complete Review: 20240815120000
import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../../hooks/useTheme';
import LoadingSpinner from '../Common/LoadingSpinner';

interface MermaidDiagramProps {
  syntax: string;
  messageId: string; // Unique identifier part from MessageBubble (e.g., originalMessageId-index)
}

const MermaidDiagramComponent: React.FC<MermaidDiagramProps> = ({ syntax, messageId }) => {
  const { appliedTheme } = useTheme();
  const [svgOutput, setSvgOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true); // Ref to track mount status
  
  // Generate a stable, unique ID for this diagram instance
  const diagramId = `mermaid-diagram-${messageId}`;

  useEffect(() => {
    isMountedRef.current = true; // Component is mounted
    return () => {
      isMountedRef.current = false; // Component will unmount
    };
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!isMountedRef.current) return;
      setIsLoading(true);
      setError(null);
      setSvgOutput(null);

      console.debug(
        `MermaidDiagram: Attempting to render ID: "${diagramId}", Theme: "${
          appliedTheme === 'dark' ? 'dark' : 'default'
        }". Syntax snippet: "${syntax.substring(0, 100).replace(/\n/g, '\\n')}..."`
      );

      if (!syntax || syntax.trim() === '') {
        if (isMountedRef.current) {
            setError("No diagram definition provided.");
            setIsLoading(false);
        }
        return;
      }
      
      try {
        // Configure Mermaid for this specific render.
        // This is called per-diagram to ensure the theme and font settings are
        // correctly applied, especially if the global theme changes or if different
        // diagrams might eventually need different settings. It overrides any
        // broader settings from a global mermaid.initialize() call (e.g., in App.tsx),
        // ensuring this diagram instance uses the correct, current theme and font.
        mermaid.initialize({
          startOnLoad: false,
          theme: appliedTheme === 'dark' ? 'dark' : 'default',
          fontFamily: '"Kantumruy Pro", "Inter", sans-serif', // Ensure Khmer text uses Kantumruy Pro, fallback to Inter
          // securityLevel: 'strict', // Mermaid's default is 'strict', explicit if needed
        });

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, syntax);
        if (isMountedRef.current) {
            setSvgOutput(svg);
        }
      } catch (e) {
        console.error(`Mermaid rendering error for ID "${diagramId}":`, e);
        
        const baseMessage = "Failed to render diagram.";
        let details = "";
        if (e instanceof Error) {
            const firstLine = e.message.split('\n')[0];
            details = `Details: ${firstLine.substring(0, 120)}${firstLine.length > 120 ? '...' : ''}`;
        } else {
            details = "An unknown error occurred during rendering.";
        }
        const advice = "The AI might have provided invalid or unsupported diagram syntax. Try asking the AI to simplify or correct the diagram.";
        
        if (isMountedRef.current) {
            setError(`${baseMessage}\n${details}\n\n${advice}`);
        }
      } finally {
        if (isMountedRef.current) {
            setIsLoading(false);
        }
      }
    };

    renderDiagram();
  }, [syntax, appliedTheme, diagramId]); // Rerun if syntax, theme, or the stable diagramId changes

  if (isLoading) {
    return (
      <div className="mermaid-diagram-container flex items-center justify-center min-h-[100px]">
        <LoadingSpinner size="md" />
        <p className="ml-2 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">Rendering diagram...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mermaid-diagram-container p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
        <p className="text-sm font-semibold text-red-700 dark:text-red-300" aria-live="polite">Diagram Error</p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1 whitespace-pre-wrap">{error}</p>
      </div>
    );
  }

  if (svgOutput) {
    return (
      <div 
        className="mermaid-diagram-container" 
        dangerouslySetInnerHTML={{ __html: svgOutput }}
        aria-label="Mermaid diagram" // Provides a label for the container of the SVG
      />
    );
  }

  return null; // Should not happen if logic is correct, but good fallback
};

export default MermaidDiagramComponent;