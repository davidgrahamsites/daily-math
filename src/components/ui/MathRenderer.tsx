import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
    latex: string;
    displayMode?: boolean;
    inline?: boolean;
    className?: string; // Allow passing external styles
}

export const MathRenderer = ({ latex, displayMode = true, inline = false, className = '' }: MathRendererProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            try {
                // Strip common delimiters if the AI mistakenly included them
                // Clean the statement of inline LaTeX delimiters which AI sometimes adds
                let cleanLatex = latex
                    .replace(/^\\\[/, '') // Remove leading \[
                    .replace(/\\\]$/, '') // Remove trailing \]
                    .replace(/^\$/, '')   // Remove leading $
                    .replace(/\$$/, '')   // Remove trailing $
                    .replace(/^\\\(/, '') // Remove leading \(
                    .replace(/\\\)$/, ''); // Remove trailing \)

                // Auto-fix common missing backslashes (conservatively)
                cleanLatex = cleanLatex
                    // Only fix simple cases if absolutely needed, but for now we trust the improved AI prompt
                    // .replace(/sqrt\(/g, '\\sqrt(') 
                    ;

                katex.render(cleanLatex, containerRef.current, {
                    throwOnError: false,
                    displayMode: inline ? false : displayMode,
                    errorColor: '#ef4444', // Red text on error (standard KaTeX behavior)
                });
            } catch (e) {
                console.error('KaTeX rendering error:', e);
                containerRef.current.innerText = latex;
            }
        }
    }, [latex, displayMode]);

    return <div ref={containerRef} className={className} />;
};
