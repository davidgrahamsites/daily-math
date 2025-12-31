import { useState } from 'react';
import { clsx } from 'clsx';
import { Delete } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface ScientificKeyboardProps {
    onKeyPress: (key: string) => void;
    onClear: () => void;
    onDelete: () => void;
    onSubmit: () => void;
}

type KeyboardMode = 'basic' | 'calc' | 'logic';

interface KeyConfig {
    label: string; // What is shown (can be LaTeX)
    value: string; // What is typed
    isLatex?: boolean;
}

const createKey = (label: string, value?: string, isLatex = false): KeyConfig => ({
    label,
    value: value ?? label,
    isLatex
});

const LAYOUTS: Record<KeyboardMode, KeyConfig[][]> = {
    basic: [
        [createKey('\\sin', 'sin(', true), createKey('\\cos', 'cos(', true), createKey('\\tan', 'tan(', true), createKey('\\pi', 'pi', true)],
        [createKey('\\ln', 'ln(', true), createKey('e', 'e', true), createKey('(', '('), createKey(')', ')')],
        [createKey('7'), createKey('8'), createKey('9'), createKey('÷', '/')],
        [createKey('4'), createKey('5'), createKey('6'), createKey('×', '*')],
        [createKey('1'), createKey('2'), createKey('3'), createKey('-')],
        [createKey('.', '.'), createKey('0'), createKey('^'), createKey('+')],
    ],
    calc: [
        [createKey('\\int', '∫', true), createKey('\\frac{d}{dx}', 'd/dx', true), createKey('\\lim', 'lim', true), createKey('\\sum', '∑', true)],
        [createKey('\\prod', '∏', true), createKey('\\infty', '∞', true), createKey('dt', 'dt'), createKey('dx', 'dx')],
        [createKey('x'), createKey('y'), createKey('n'), createKey('\\theta', 'theta', true)],
        [createKey('\\sqrt{x}', 'sqrt(', true), createKey('|x|', 'abs(', true), createKey('!', '!'), createKey('\\log', 'log(', true)],
        [createKey('1'), createKey('2'), createKey('3'), createKey('=')],
        [createKey('0'), createKey('.', '.'), createKey(','), createKey('\\to', '→', true)],
    ],
    logic: [
        [createKey('\\forall', '∀', true), createKey('\\exists', '∃', true), createKey('\\in', '∈', true), createKey('\\notin', '∉', true)],
        [createKey('\\subset', '⊂', true), createKey('\\supset', '⊃', true), createKey('\\cup', '∪', true), createKey('\\cap', '∩', true)],
        [createKey('\\land', '∧', true), createKey('\\lor', '∨', true), createKey('\\neg', '¬', true), createKey('\\implies', '⇒', true)],
        [createKey('\\iff', '⇔', true), createKey('\\therefore', '∴', true), createKey('\\because', '∵', true), createKey('\\emptyset', '∅', true)],
        [createKey('P'), createKey('Q'), createKey('R'), createKey('S')],
        [createKey('('), createKey(')'), createKey('{'), createKey('}')],
    ]
};

const KeyButton = ({ k, onClick }: { k: KeyConfig, onClick: () => void }) => {
    // Render label using Katex if flag is true, otherwise plain text
    const content = k.isLatex
        ? <span dangerouslySetInnerHTML={{ __html: katex.renderToString(k.label, { throwOnError: false }) }} />
        : k.label;

    return (
        <button
            onClick={onClick}
            className={clsx(
                "h-12 rounded-lg text-lg font-medium transition-all active:scale-95 flex items-center justify-center",
                // Styling based on row/type (roughly inferred)
                "bg-white/10 text-white hover:bg-white/20 border border-white/5 shadow-sm"
            )}
        >
            {content}
        </button>
    );
}

export const ScientificKeyboard = ({ onKeyPress, onClear, onDelete, onSubmit }: ScientificKeyboardProps) => {
    const [mode, setMode] = useState<KeyboardMode>('basic');

    return (
        <div className="w-[100vw] -ml-4 -mb-4 bg-bg-card border-t border-white/10 pb-8 pt-2">
            <div className="max-w-md mx-auto px-2">
                {/* Action Row */}
                <div className="flex gap-2 mb-2 px-1">
                    <button onClick={onClear} className="h-10 px-4 rounded-lg bg-error/20 text-error font-bold text-sm flex items-center justify-center flex-1 transition-colors hover:bg-error/30">
                        AC
                    </button>
                    <button onClick={onDelete} className="h-10 px-4 rounded-lg bg-bg-secondary text-white font-medium text-sm flex items-center justify-center flex-1 transition-colors hover:bg-white/10 border border-white/10">
                        <Delete size={18} />
                    </button>
                    <button onClick={onSubmit} className="h-10 px-6 rounded-lg bg-accent-primary text-white font-bold text-sm tracking-wide flex-[2] hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                        ENTER
                    </button>
                </div>

                {/* Mode Switcher */}
                <div className="flex gap-1 mb-2 px-1 bg-black/20 p-1 rounded-lg">
                    {(['basic', 'calc', 'logic'] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={clsx(
                                "flex-1 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all",
                                mode === m
                                    ? "bg-accent-secondary text-white shadow-md"
                                    : "text-text-secondary hover:text-white"
                            )}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-2 px-1">
                    {LAYOUTS[mode].map((row, i) => (
                        row.map((btn, j) => (
                            <KeyButton
                                key={`${i}-${j}`}
                                k={btn}
                                onClick={() => onKeyPress(btn.value)}
                            />
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
};
