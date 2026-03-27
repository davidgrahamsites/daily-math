import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Delete } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import type { AnswerType } from '../../types';

interface ScientificKeyboardProps {
    onKeyPress: (key: string) => void;
    onClear: () => void;
    onDelete: () => void;
    onSubmit: () => void;
    answerType?: AnswerType;
}

type KeyboardMode = 'basic' | 'algebra' | 'calc' | 'trig' | 'logic' | 'fraction';

interface KeyConfig {
    label: string; // What is shown (can be LaTeX)
    value: string; // What is typed
    isLatex?: boolean;
    span?: number; // Grid column span
}

const createKey = (label: string, value?: string, isLatex = false, span = 1): KeyConfig => ({
    label,
    value: value ?? label,
    isLatex,
    span
});

const LAYOUTS: Record<KeyboardMode, KeyConfig[][]> = {
    basic: [
        [createKey('7'), createKey('8'), createKey('9'), createKey('÷', '/')],
        [createKey('4'), createKey('5'), createKey('6'), createKey('×', '*')],
        [createKey('1'), createKey('2'), createKey('3'), createKey('-')],
        [createKey('.', '.'), createKey('0'), createKey('^'), createKey('+')],
        [createKey('('), createKey(')'), createKey('\\pi', 'pi', true), createKey('e')],
    ],
    algebra: [
        [createKey('x'), createKey('y'), createKey('z'), createKey('n')],
        [createKey('7'), createKey('8'), createKey('9'), createKey('^')],
        [createKey('4'), createKey('5'), createKey('6'), createKey('\\sqrt{x}', 'sqrt(', true)],
        [createKey('1'), createKey('2'), createKey('3'), createKey('\\pm', '±', true)],
        [createKey('.', '.'), createKey('0'), createKey('('), createKey(')')],
        [createKey('+'), createKey('-'), createKey('×', '*'), createKey('÷', '/')],
    ],
    calc: [
        [createKey('\\int', '∫', true), createKey('\\frac{d}{dx}', 'd/dx', true), createKey('\\lim', 'lim', true), createKey('\\sum', '∑', true)],
        [createKey('\\infty', '∞', true), createKey('dx', 'dx'), createKey('dt', 'dt'), createKey('\\to', '→', true)],
        [createKey('x'), createKey('y'), createKey('n'), createKey('e')],
        [createKey('7'), createKey('8'), createKey('9'), createKey('^')],
        [createKey('4'), createKey('5'), createKey('6'), createKey('\\sqrt{x}', 'sqrt(', true)],
        [createKey('1'), createKey('2'), createKey('3'), createKey('\\pi', 'pi', true)],
        [createKey('.', '.'), createKey('0'), createKey('+'), createKey('-')],
    ],
    trig: [
        [createKey('\\sin', 'sin(', true), createKey('\\cos', 'cos(', true), createKey('\\tan', 'tan(', true), createKey('\\pi', 'pi', true)],
        [createKey('\\sin^{-1}', 'asin(', true), createKey('\\cos^{-1}', 'acos(', true), createKey('\\tan^{-1}', 'atan(', true), createKey('\\theta', 'theta', true)],
        [createKey('7'), createKey('8'), createKey('9'), createKey('^')],
        [createKey('4'), createKey('5'), createKey('6'), createKey('\\sqrt{x}', 'sqrt(', true)],
        [createKey('1'), createKey('2'), createKey('3'), createKey('÷', '/')],
        [createKey('.', '.'), createKey('0'), createKey('('), createKey(')')],
    ],
    logic: [
        [createKey('\\forall', '∀', true), createKey('\\exists', '∃', true), createKey('\\in', '∈', true), createKey('\\notin', '∉', true)],
        [createKey('\\subset', '⊂', true), createKey('\\supset', '⊃', true), createKey('\\cup', '∪', true), createKey('\\cap', '∩', true)],
        [createKey('\\land', '∧', true), createKey('\\lor', '∨', true), createKey('\\neg', '¬', true), createKey('\\implies', '⇒', true)],
        [createKey('\\iff', '⇔', true), createKey('\\therefore', '∴', true), createKey('\\because', '∵', true), createKey('\\emptyset', '∅', true)],
        [createKey('P'), createKey('Q'), createKey('R'), createKey('S')],
        [createKey('('), createKey(')'), createKey('{'), createKey('}')],
    ],
    fraction: [
        [createKey('7'), createKey('8'), createKey('9'), createKey('\\frac{a}{b}', '/', true)],
        [createKey('4'), createKey('5'), createKey('6'), createKey('×', '*')],
        [createKey('1'), createKey('2'), createKey('3'), createKey('-')],
        [createKey('.', '.'), createKey('0'), createKey('('), createKey(')')],
        [createKey('\\pi', 'pi', true), createKey('e'), createKey('^'), createKey('+')],
    ],
};

// Map answerType to the best default keyboard mode
const ANSWER_TYPE_TO_MODE: Record<AnswerType, KeyboardMode> = {
    numeric: 'basic',
    algebraic: 'algebra',
    fraction: 'fraction',
    matrix: 'basic',     // Matrix gets basic for now
    symbolic: 'logic',
    text: 'basic',       // Text problems use free-text input (handled in SolverInterface)
};

// Available modes per answerType (for manual switching)
const AVAILABLE_MODES: Record<AnswerType, KeyboardMode[]> = {
    numeric: ['basic', 'trig', 'calc'],
    algebraic: ['algebra', 'calc', 'trig'],
    fraction: ['fraction', 'basic', 'algebra'],
    matrix: ['basic', 'algebra'],
    symbolic: ['logic', 'algebra'],
    text: ['basic'],
};

const KeyButton = ({ k, onClick }: { k: KeyConfig, onClick: () => void }) => {
    const content = k.isLatex
        ? <span dangerouslySetInnerHTML={{ __html: katex.renderToString(k.label, { throwOnError: false }) }} />
        : k.label;

    return (
        <button
            onClick={onClick}
            className={clsx(
                "h-12 rounded-lg text-lg font-medium transition-all active:scale-95 flex items-center justify-center",
                "bg-white/10 text-white hover:bg-white/20 border border-white/5 shadow-sm",
                k.span && k.span > 1 && `col-span-${k.span}`
            )}
        >
            {content}
        </button>
    );
}

// Friendly mode labels for the UI
const MODE_LABELS: Record<KeyboardMode, string> = {
    basic: 'NUM',
    algebra: 'ALG',
    calc: 'CALC',
    trig: 'TRIG',
    logic: 'LOGIC',
    fraction: 'FRAC',
};

export const ScientificKeyboard = ({ onKeyPress, onClear, onDelete, onSubmit, answerType = 'numeric' }: ScientificKeyboardProps) => {
    const defaultMode = ANSWER_TYPE_TO_MODE[answerType] || 'basic';
    const [mode, setMode] = useState<KeyboardMode>(defaultMode);
    const availableModes = AVAILABLE_MODES[answerType] || ['basic', 'algebra', 'calc'];

    // Auto-switch mode when answerType changes
    useEffect(() => {
        setMode(ANSWER_TYPE_TO_MODE[answerType] || 'basic');
    }, [answerType]);

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

                {/* Mode Switcher - now adaptive */}
                <div className="flex gap-1 mb-2 px-1 bg-black/20 p-1 rounded-lg">
                    {availableModes.map((m) => (
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
                            {MODE_LABELS[m]}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-2 px-1">
                    {LAYOUTS[mode].map((row, i) => (
                        row.map((btn, j) => (
                            <KeyButton
                                key={`${mode}-${i}-${j}`}
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
