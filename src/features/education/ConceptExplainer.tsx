import { useState } from 'react';
import { BookOpen, GripHorizontal, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, useDragControls } from 'framer-motion';
import { MathRenderer } from '../../components/ui/MathRenderer';

// Reusing types from global types, but defining props clearly
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

interface ConceptExplainerProps {
    definitions: Definition[];
    isOpen: boolean;
    onClose: () => void;
}

export const ConceptExplainer = ({ definitions, isOpen, onClose }: ConceptExplainerProps) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const controls = useDragControls();

    // Filter only definitions that have deep dive content
    const educationalContent = definitions.filter(d => d.deepDive);

    if (!isOpen || educationalContent.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
            {/* Click backdrop to close */}
            {/* <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={onClose} /> */}
            {/* We might want to allow this to stay open while they look at the solution? Let's make it modal for now to avoid clutter, or modeless? User said "pop up in another portal". Let's stick to modal backdrop for focus. */}
            <div className="absolute inset-0 bg-black/10 pointer-events-auto" onClick={onClose} />

            {/* Draggable Window */}
            <motion.div
                drag
                dragListener={false}
                dragControls={controls}
                dragMomentum={false}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className={clsx(
                    "pointer-events-auto flex flex-col border border-text-secondary/20 rounded-2xl shadow-2xl overflow-hidden min-w-[320px]",
                    !isCollapsed && "resize min-h-[300px]"
                )}
                // HARDCODED OPACITY AND COLOR as requested
                style={{
                    backgroundColor: 'var(--bg-card)',
                    ...(isCollapsed ? { width: '300px' } : {
                        width: '550px', // Wider for education
                        height: '600px',
                        maxWidth: '90vw',
                        maxHeight: '85vh'
                    })
                }}
            >
                {/* Header */}
                <div
                    onPointerDown={(e) => controls.start(e)}
                    className="flex justify-between items-center px-4 py-3 bg-accent-secondary/10 border-b border-white/5 cursor-move active:cursor-grabbing select-none shrink-0"
                >
                    <div className="flex items-center gap-2 text-text-primary">
                        <GraduationCap className="text-accent-secondary" size={22} />
                        <span className="font-bold">Concept Deep Dive</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                        >
                            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                        <div className="flex items-center gap-1 text-text-secondary/50 mx-1">
                            <GripHorizontal size={18} />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                {!isCollapsed && (
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <p className="text-sm text-text-secondary mb-6">
                            Master the underlying concepts found in today's problem.
                        </p>

                        <div className="space-y-4">
                            {educationalContent.map((item, index) => {
                                const isExpanded = expandedIndex === index;
                                return (
                                    <div key={index} className="border border-text-secondary/20 rounded-xl overflow-hidden bg-black/10">
                                        <button
                                            onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                            className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors text-left"
                                        >
                                            <span className="font-bold text-accent-primary flex items-center gap-2">
                                                <BookOpen size={16} />
                                                {item.term}
                                            </span>
                                            {isExpanded ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
                                        </button>

                                        {isExpanded && item.deepDive && (
                                            <div className="p-5 border-t border-text-secondary/10 bg-black/20 animate-in slide-in-from-top-2">
                                                {/* Explanation */}
                                                <div className="mb-6">
                                                    <h4 className="text-xs uppercase font-bold text-text-secondary mb-2 tracking-wider">Concept</h4>
                                                    <p className="text-text-primary leading-relaxed text-sm">
                                                        {item.deepDive.explanation}
                                                    </p>
                                                </div>

                                                {/* Example Problem */}
                                                <div className="bg-bg-card border border-text-secondary/10 rounded-lg p-4">
                                                    <h4 className="text-xs uppercase font-bold text-success mb-3 tracking-wider flex items-center gap-2">
                                                        Simplest Example
                                                    </h4>
                                                    <div className="mb-4 text-sm font-medium">
                                                        <span className="text-text-secondary mr-2">Problem:</span>
                                                        <MathRenderer latex={item.deepDive.example.problem} inline />
                                                    </div>

                                                    <div className="space-y-3 relative pl-4 border-l-2 border-text-secondary/20">
                                                        {item.deepDive.example.steps.map((step, s_idx) => (
                                                            <div key={s_idx} className="text-sm text-text-secondary overflow-x-auto pb-2">
                                                                <span className="text-xs text-text-secondary/50 block mb-1">Step {s_idx + 1}</span>
                                                                <MathRenderer latex={step} inline />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-text-secondary/10 flex items-center justify-between">
                                                        <span className="text-xs text-text-secondary">Answer</span>
                                                        <span className="font-bold text-success">
                                                            <MathRenderer latex={item.deepDive.example.answer} inline />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
