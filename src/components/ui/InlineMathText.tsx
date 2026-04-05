import { MathRenderer } from '../../components/ui/MathRenderer';

interface InlineMathTextProps {
    text: string;
    className?: string;
}

export const InlineMathText = ({ text, className = '' }: InlineMathTextProps) => {
    if (!text) return <span className={className}></span>;

    // Split on proper $...$ pairs that contain actual math content
    // Requires at least 2 non-space, non-dollar characters between dollar signs
    // Also matches \(...\)
    const parts = text.split(/(\$[^$\n]{2,}\$|\\\([^)]+\\\))/g);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (!part) return null;

                const isDollarMath = part.startsWith('$') && part.endsWith('$') && part.length > 2;
                const isEscapedMath = part.startsWith('\\(') && part.endsWith('\\)');

                if (isDollarMath || isEscapedMath) {
                    // Extract content: remove $ or \( \)
                    const content = isDollarMath
                        ? part.slice(1, -1).trim()
                        : part.slice(2, -2).trim();

                    // Skip if content looks like a plain number or currency (e.g. "250", "8")
                    if (/^\d+\.?\d*$/.test(content)) {
                        return <span key={index}>{content}</span>;
                    }

                    return (
                        <MathRenderer
                            key={index}
                            latex={content}
                            displayMode={false}
                            className="inline-block mx-1 align-middle text-[1.1em]"
                        />
                    );
                }

                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};
