import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lightbulb } from 'lucide-react';
import type { Problem } from '../../types';
import { MathRenderer } from '../../components/ui/MathRenderer';
import { ScientificKeyboard } from '../calculator/ScientificKeyboard';
import { validateAnswer, formatInputLatex } from '../../services/mathEngine';
import { HintOverlay } from '../hints/HintOverlay';
import { clsx } from 'clsx';

interface SolverInterfaceProps {
    problem: Problem;
    onBack: () => void;
}

export const SolverInterface = ({ problem, onBack }: SolverInterfaceProps) => {
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [showHints, setShowHints] = useState(false);

    const handleKeyPress = (key: string) => {
        if (feedback === 'correct') return; // Lock input if correct
        setFeedback('idle');
        setInput((prev) => prev + key);
    };

    const handleClear = () => {
        setFeedback('idle');
        setInput('');
    };

    const handleDelete = () => {
        setFeedback('idle');
        setInput((prev) => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (!input) return;

        const isValid = validateAnswer(input, problem.answer);
        if (isValid) {
            setFeedback('correct');
            // Trigger confetti or success sound here
        } else {
            setFeedback('incorrect');
        }
    };

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={onBack} className="p-2 -ml-2 text-secondary hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHints(true)}
                        className="px-4 py-2 bg-warning/10 text-warning hover:bg-warning/20 rounded-full transition-colors flex items-center gap-2 font-semibold text-sm border border-warning/20"
                        aria-label="Hints"
                    >
                        <Lightbulb size={18} />
                        <span>Hints</span>
                    </button>
                </div>
            </div>

            {/* Problem Context (Collapsed view) */}
            {/* Problem Context (Collapsed view) */}
            <div className="mb-6 opacity-80 scale-90 origin-top text-center max-w-lg mx-auto">
                <h3 className="text-xl font-light text-white mb-2">{problem.title}</h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-3">{problem.statement}</p>
                <MathRenderer latex={problem.latex} className="text-2xl text-blue-200" />
            </div>

            {/* Input Display Area */}
            <div className={clsx(
                "flex-1 glass-panel mx-2 mb-4 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300",
                feedback === 'incorrect' ? "border-error/50 bg-error/10" :
                    feedback === 'correct' ? "border-success/50 bg-success/10" : ""
            )}>
                {input ? (
                    <MathRenderer latex={formatInputLatex(input)} className="text-3xl" />
                ) : (
                    <span className="text-white/20 text-2xl italic">Enter solution...</span>
                )}

                {/* Feedback Indicator */}
                {feedback === 'correct' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
                        <div className="flex flex-col items-center text-success">
                            <CheckCircle2 size={48} className="mb-2" />
                            <span className="font-bold text-lg">Correct!</span>
                        </div>
                    </div>
                )}

                {feedback === 'incorrect' && (
                    <div className="absolute bottom-4 text-error text-sm font-semibold animate-in slide-in-from-bottom-2">
                        Incorrect, try again.
                    </div>
                )}
            </div>

            {/* Keyboard */}
            <div className="mt-auto">
                <ScientificKeyboard
                    onKeyPress={handleKeyPress}
                    onClear={handleClear}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                />
            </div>

            <HintOverlay
                isOpen={showHints}
                onClose={() => setShowHints(false)}
                hints={problem.hints}
                solutionSteps={problem.solutionSteps}
            />
        </div>
    );
};
