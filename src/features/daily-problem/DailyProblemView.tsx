import type { Problem } from '../../types';
import { MathRenderer } from '../../components/ui/MathRenderer';

interface DailyProblemViewProps {
    problem: Problem;
}

export const DailyProblemView = ({ problem }: DailyProblemViewProps) => {
    return (
        <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[300px] text-center w-full animate-in fade-in zoom-in duration-500">
            <div className="w-full flex justify-between items-center mb-6">
                <span className="text-xs font-bold tracking-widest text-secondary uppercase bg-white/5 px-3 py-1 rounded-full">{problem.date}</span>
                <span className="text-secondary text-xs uppercase tracking-widest font-semibold">{problem.concept}</span>
            </div>

            <h2 className="text-3xl font-light mb-2 text-text-primary">{problem.title}</h2>
            <p className="text-text-secondary mb-6 text-lg font-light max-w-lg leading-relaxed">{problem.statement}</p>

            <div className="py-8 w-full overflow-x-auto flex justify-center">
                <MathRenderer latex={problem.latex} className="text-3xl md:text-4xl text-text-primary" />
            </div>

        </div>
    );
};
