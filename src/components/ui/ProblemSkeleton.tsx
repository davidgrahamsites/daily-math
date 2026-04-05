export const ProblemSkeleton = () => (
    <div className="glass-panel p-8 flex flex-col items-center min-h-[300px] w-full animate-pulse">
        {/* Top row: date + category badges */}
        <div className="w-full flex justify-between items-center mb-6">
            <div className="h-5 w-24 bg-white/10 rounded-full" />
            <div className="h-5 w-32 bg-white/10 rounded-full" />
        </div>
        {/* Title */}
        <div className="h-8 w-3/4 bg-white/10 rounded-lg mb-3" />
        {/* Statement */}
        <div className="space-y-2 w-full max-w-sm mb-8">
            <div className="h-4 bg-white/8 rounded w-full" />
            <div className="h-4 bg-white/8 rounded w-5/6 mx-auto" />
            <div className="h-4 bg-white/8 rounded w-4/6 mx-auto" />
        </div>
        {/* LaTeX area */}
        <div className="h-16 w-3/4 bg-white/10 rounded-xl" />
    </div>
);

interface ErrorCardProps {
    message?: string;
    detail?: string;
    onRetry?: () => void;
}

export const ErrorCard = ({ message = 'Failed to load problem', detail, onRetry }: ErrorCardProps) => (
    <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-lg font-bold text-error">{message}</h3>
        {detail && <p className="text-sm text-text-secondary max-w-xs">{detail}</p>}
        {!detail && (
            <p className="text-sm text-text-secondary max-w-xs">
                Make sure your OpenAI API key is set in Settings, or check your internet connection.
            </p>
        )}
        {onRetry && (
            <button
                onClick={onRetry}
                className="mt-2 px-6 py-2.5 bg-accent-primary text-white font-bold rounded-xl hover:bg-accent-primary/90 transition-colors shadow-lg"
            >
                Try Again
            </button>
        )}
    </div>
);
