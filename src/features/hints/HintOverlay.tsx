import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Lightbulb, Check, Info, GripHorizontal, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, useDragControls } from 'framer-motion';
import { MathRenderer } from '../../components/ui/MathRenderer';
import { InlineMathText } from '../../components/ui/InlineMathText';
import { ConceptExplainer } from '../education/ConceptExplainer';

interface Definition {
    term: string;
    definition: string;
    deepDive?: {
        explanation: string;
        example: {
            problem: string;
            steps: string[];
            answer: string;
        }
    }
}

interface Hint {
    text: string;
    definitions?: Definition[];
}

interface HintOverlayProps {
    hints: Hint[];
    solutionSteps: { explanation: string; latex?: string }[];
    isOpen: boolean;
    onClose: () => void;
}

// Portal Tooltip Component
const PortalTooltip = ({ rect, text }: { rect: DOMRect; text: string }) => {
    return createPortal(
        <div
            className="fixed z-[100] px-4 py-3 text-text-primary text-xs rounded-xl shadow-2xl border border-text-secondary/20 pointer-events-none w-max max-w-[250px] sm:max-w-sm animate-in fade-in zoom-in-95 duration-150"
            style={{
                top: rect.top - 12, // Gap above the word
                left: rect.left + rect.width / 2,
                transform: 'translate(-50%, -100%)',
                backgroundColor: 'var(--bg-card)',
                opacity: 1
            }}
        >
            {text}
            {/* Arrow */}
            <div
                className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-bg-card drop-shadow-sm"
                style={{ borderTopColor: 'var(--bg-card)' }}
            />
        </div>,
        document.body
    );
};

const HintText = ({ text, definitions = [] }: { text: string; definitions?: Definition[] }) => {
    const [hoveredTerm, setHoveredTerm] = useState<{ rect: DOMRect; definition: string } | null>(null);

    if (!definitions || definitions.length === 0) {
        return <p className="text-sm leading-relaxed">{text}</p>;
    }

    const terms = definitions.map(d => d.term).join('|');
    const regex = new RegExp(`(${terms})`, 'gi');

    const parts = text.split(regex);

    const handleMouseEnter = (e: React.MouseEvent, def: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredTerm({ rect, definition: def });
    };

    const handleMouseLeave = () => {
        setHoveredTerm(null);
    };

    return (
        <p className="text-sm leading-relaxed">
            {parts.map((part, i) => {
                const def = definitions.find(d => d.term.toLowerCase() === part.toLowerCase());
                if (def) {
                    return (
                        <span
                            key={i}
                            className="group relative inline-block cursor-help text-accent-primary border-b border-dashed border-accent-primary/50 font-medium"
                            onMouseEnter={(e) => handleMouseEnter(e, def.definition)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {part}
                            {/* Render Portal Tooltip if this specific element is hovered */}
                            {hoveredTerm && hoveredTerm.definition === def.definition && (
                                <PortalTooltip rect={hoveredTerm.rect} text={hoveredTerm.definition} />
                            )}
                        </span>
                    );
                }
                return part;
            })}
        </p>
    );
};

export const HintOverlay = ({ hints, solutionSteps, isOpen, onClose }: HintOverlayProps) => {
    const [revealedCount, setRevealedCount] = useState(0);
    const [showSolution, setShowSolution] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showEducation, setShowEducation] = useState(false);
    const controls = useDragControls();

    // Collect all definitions with deepDive content
    const allDefinitions = hints.flatMap(h => h.definitions || []).filter(d => Boolean(d.deepDive));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Click backdrop to close */}
            <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose} />

            <ConceptExplainer
                isOpen={showEducation}
                onClose={() => setShowEducation(false)}
                definitions={allDefinitions}
            />

            {/* Draggable & Resizable Window */}
            <motion.div
                drag
                dragListener={false}
                dragControls={controls}
                dragMomentum={false}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, height: isCollapsed ? 'auto' : 'auto' }}
                // Use 'resize' CSS property + 'overflow-hidden' for container, but 'overflow-auto' for content
                className={clsx(
                    "pointer-events-auto flex flex-col bg-bg-card border border-text-secondary/20 rounded-2xl shadow-2xl overflow-hidden min-w-[320px]",
                    !isCollapsed && "resize min-h-[300px]" // Only resizable when expanded
                )}
                style={{
                    // FIX: Force solid background via inline style accessing the variable, to defeat any transparency defaults
                    backgroundColor: 'var(--bg-card)',
                    ...(isCollapsed ? { width: '320px' } : {
                        width: '500px',
                        height: '600px',
                        maxWidth: '90vw',
                        maxHeight: '85vh'
                    })
                }}
            >
                {/* Header (Drag Handle) */}
                <div
                    onPointerDown={(e) => controls.start(e)}
                    className="flex justify-between items-center px-4 py-3 bg-white/5 border-b border-white/5 cursor-move active:cursor-grabbing select-none shrink-0"
                >
                    <div className="flex items-center gap-2 text-text-primary">
                        <Lightbulb className="text-warning fill-warning/20" size={20} />
                        <span className="font-bold">Hints</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Collapse Toggle */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                            aria-label={isCollapsed ? "Expand" : "Collapse"}
                        >
                            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>

                        {/* Drag Indicator */}
                        <div className="flex items-center gap-1 text-text-secondary/50 mx-1">
                            <GripHorizontal size={18} />
                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                {/* Content Area (Hidden if Collapsed) */}
                {!isCollapsed && (
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="space-y-4 pb-8">
                            {hints.map((hint, index) => {
                                const isRevealed = index < revealedCount;
                                const isNext = index === revealedCount;

                                return (
                                    <div
                                        key={index}
                                        className={clsx(
                                            "p-4 rounded-xl border transition-all duration-300 relative",
                                            isRevealed
                                                ? "bg-white/5 border-text-secondary/20"
                                                : "bg-black/20 border-text-secondary/10 dashed-border opacity-70"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={clsx("text-xs uppercase font-bold tracking-wider", isRevealed ? "text-accent-primary" : "text-text-secondary")}>
                                                Hint {index + 1}
                                            </span>
                                            {isRevealed && <Check size={14} className="text-success" />}
                                        </div>

                                        {isRevealed ? (
                                            <div className="text-text-primary">
                                                <HintText text={hint.text} definitions={hint.definitions} />
                                            </div>
                                        ) : isNext ? (
                                            <button
                                                onClick={() => setRevealedCount(index + 1)}
                                                className="w-full py-3 bg-accent-primary text-white hover:bg-accent-primary/80 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                                            >
                                                Tap to Reveal
                                            </button>
                                        ) : (
                                            <div className="h-8 flex items-center justify-center">
                                                <span className="text-xs text-text-secondary flex items-center gap-2">
                                                    <Info size={12} />
                                                    Locked
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Solution Section */}
                        <div className="mt-8 pt-6 border-text-secondary/10 border-t">
                            {revealedCount === hints.length ? (
                                !showSolution ? (
                                    <button
                                        onClick={() => setShowSolution(true)}
                                        className="w-full py-4 bg-error text-white hover:bg-error/90 font-bold rounded-xl shadow-lg transition-all"
                                    >
                                        Give Up & Show Solution
                                    </button>
                                ) : (
                                    <div className="space-y-6 animate-in fade-in">
                                        <h3 className="text-lg font-semibold text-text-primary">Solution Steps</h3>
                                        {solutionSteps.map((step, i) => (
                                            <div key={i} className="space-y-3 relative">
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-text-secondary/20 rounded-full" />
                                                <div className="pl-4">
                                                    <div className="text-sm text-text-secondary mb-2 leading-relaxed">
                                                        <InlineMathText text={step.explanation} />
                                                    </div>
                                                    {step.latex && (
                                                        <div className="bg-black/20 p-4 rounded-lg overflow-x-auto border border-text-secondary/10">
                                                            <MathRenderer latex={step.latex} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex flex-col gap-3">
                                            <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center">
                                                <span className="text-success font-bold">Problem Complete</span>
                                            </div>

                                            {/* Education Button */}
                                            {allDefinitions.length > 0 && (
                                                <button
                                                    onClick={() => setShowEducation(true)}
                                                    className="w-full py-3 bg-accent-secondary text-white hover:bg-accent-secondary/90 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                                >
                                                    <GraduationCap size={20} />
                                                    Explore Concepts & Examples
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <p className="text-center text-xs text-text-secondary opacity-50">
                                    Reveal all hints to unlock solution
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
