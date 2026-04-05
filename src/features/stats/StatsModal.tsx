import { useState, useEffect } from 'react';
import { X, Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { statsService } from '../../services/statsService';
import type { DailySolveRecord } from '../../types';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const StatsModal = ({ isOpen, onClose }: StatsModalProps) => {
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [totalSolved, setTotalSolved] = useState(0);
    const [recentRecords, setRecentRecords] = useState<DailySolveRecord[]>([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, { attempted: number; solved: number }>>({});

    useEffect(() => {
        if (isOpen) {
            setStreak(statsService.getCurrentStreak());
            setLongestStreak(statsService.getLongestStreak());
            setTotalSolved(statsService.getTotalSolved());
            setRecentRecords(statsService.getAllRecords().slice(0, 14));
            setCategoryBreakdown(statsService.getCategoryBreakdown());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const totalAttempted = Object.values(categoryBreakdown).reduce((s, v) => s + v.attempted, 0);
    const accuracy = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;

    const topCategories = Object.entries(categoryBreakdown)
        .sort((a, b) => b[1].attempted - a[1].attempted)
        .slice(0, 5);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{
                zIndex: 70,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="rounded-2xl shadow-2xl w-[92%] max-w-md max-h-[88vh] flex flex-col"
                style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid color-mix(in srgb, var(--text-secondary) 20%, transparent)',
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-5 flex-shrink-0"
                    style={{ borderBottom: '1px solid color-mix(in srgb, var(--text-secondary) 10%, transparent)' }}
                >
                    <div className="flex items-center gap-3">
                        <TrendingUp style={{ color: 'var(--accent-primary)' }} size={22} />
                        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Your Progress</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-5 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard icon={<Flame className="text-orange-400" size={22} />} value={streak} label="Current Streak" unit="days" accent="orange" />
                        <StatCard icon={<Trophy className="text-yellow-400" size={22} />} value={longestStreak} label="Best Streak" unit="days" accent="yellow" />
                        <StatCard icon={<Target style={{ color: 'var(--success)' }} size={22} />} value={totalSolved} label="Problems Solved" unit="total" accent="green" />
                        <StatCard icon={<TrendingUp style={{ color: 'var(--accent-primary)' }} size={22} />} value={accuracy} label="Accuracy" unit="%" accent="blue" />
                    </div>

                    {/* Recent 14 days calendar-strip */}
                    {recentRecords.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-secondary)' }}>Recent Activity</h3>
                            <div className="grid grid-cols-7 gap-1.5">
                                {recentRecords.slice(0, 14).reverse().map((r) => (
                                    <div key={r.date} title={`${r.date}: ${r.category}`}
                                        className="h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                                        style={r.solved ? {
                                            backgroundColor: 'color-mix(in srgb, var(--success) 30%, transparent)',
                                            color: 'var(--success)',
                                            border: '1px solid color-mix(in srgb, var(--success) 40%, transparent)',
                                        } : {
                                            backgroundColor: 'color-mix(in srgb, var(--error) 20%, transparent)',
                                            color: 'color-mix(in srgb, var(--error) 60%, transparent)',
                                            border: '1px solid color-mix(in srgb, var(--error) 20%, transparent)',
                                        }}
                                    >
                                        {r.solved ? '✓' : '✗'}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-2">
                                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: 'color-mix(in srgb, var(--success) 30%, transparent)' }} /> Solved
                                </span>
                                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 20%, transparent)' }} /> Attempted
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Category Breakdown */}
                    {topCategories.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-secondary)' }}>Top Topics</h3>
                            <div className="space-y-2">
                                {topCategories.map(([cat, stats]) => {
                                    const pct = Math.round((stats.solved / stats.attempted) * 100);
                                    return (
                                        <div key={cat}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{cat}</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>{stats.solved}/{stats.attempted} ({pct}%)</span>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: 'var(--accent-primary)' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {totalAttempted === 0 && (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">📊</div>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No stats yet — solve your first problem to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, value, label, unit, accent }: { icon: React.ReactNode; value: number; label: string; unit: string; accent: string }) => {
    const accentStyles: Record<string, React.CSSProperties> = {
        orange: { backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)' },
        yellow: { backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)' },
        green: { backgroundColor: 'color-mix(in srgb, var(--success) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--success) 20%, transparent)' },
        blue: { backgroundColor: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)' },
    };

    return (
        <div className="p-4 rounded-xl flex flex-col gap-2" style={accentStyles[accent] || { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{unit}</span>
            </div>
        </div>
    );
};
