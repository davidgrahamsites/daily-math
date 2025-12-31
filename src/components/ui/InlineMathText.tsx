import { MathRenderer } from '../../components/ui/MathRenderer';

interface InlineMathTextProps {
    text: string;
    className?: string;
}

export const InlineMathText = ({ text, className = '' }: InlineMathTextProps) => {
    // Regex for inline math delimited by $...$ or \(...\)
    // Matches $...$ OR \(...\)
    // Capturing group 1 is $ content, Group 2 is \( content
    const parts = text.split(/(\$[^$]+\$|\\\([^)]+\\\))/g);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                const isDollarMath = part.startsWith('$') && part.endsWith('$');
                const isEscapedMath = part.startsWith('\\(') && part.endsWith('\\)');

                if (isDollarMath || isEscapedMath) {
                    // Extract content: remove $ or \( \)
                    const content = isDollarMath
                        ? part.slice(1, -1)
                        : part.slice(2, -2);

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
