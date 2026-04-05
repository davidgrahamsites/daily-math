import type { DailySolveRecord } from '../types';

const STATS_STORAGE_KEY = 'daily_math_stats_v1';
const MAX_HISTORY = 90; // Keep 90 days of history

function loadRecords(): DailySolveRecord[] {
    try {
        const raw = localStorage.getItem(STATS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveRecords(records: DailySolveRecord[]): void {
    // Keep only the last MAX_HISTORY entries
    const trimmed = records.slice(-MAX_HISTORY);
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(trimmed));
}

export const statsService = {
    /**
     * Record the outcome of today's problem.
     * If a record for today already exists, it updates it (preserving any earlier solve).
     */
    recordSolve(record: Omit<DailySolveRecord, 'date'>): void {
        const records = loadRecords();
        const today = new Date().toISOString().split('T')[0];
        const existingIndex = records.findIndex(r => r.date === today);

        const newRecord: DailySolveRecord = { date: today, ...record };

        if (existingIndex >= 0) {
            // Preserve a prior 'solved: true' — don't downgrade it
            const existing = records[existingIndex];
            records[existingIndex] = {
                ...newRecord,
                solved: existing.solved || newRecord.solved,
                hintsUsed: Math.max(existing.hintsUsed, newRecord.hintsUsed),
                usedSolution: existing.usedSolution || newRecord.usedSolution,
            };
        } else {
            records.push(newRecord);
        }

        saveRecords(records);
    },

    /**
     * Get total number of problems solved.
     */
    getTotalSolved(): number {
        return loadRecords().filter(r => r.solved).length;
    },

    /**
     * Get current streak (consecutive days with a solved problem, including today).
     */
    getCurrentStreak(): number {
        const records = loadRecords();
        const solvedDates = new Set(records.filter(r => r.solved).map(r => r.date));

        let streak = 0;
        const cursor = new Date();

        while (true) {
            const dateStr = cursor.toISOString().split('T')[0];
            if (solvedDates.has(dateStr)) {
                streak++;
                cursor.setDate(cursor.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    },

    /**
     * Get longest ever streak.
     */
    getLongestStreak(): number {
        const records = loadRecords().sort((a, b) => a.date.localeCompare(b.date));
        const solvedDates = records.filter(r => r.solved).map(r => r.date);

        let longest = 0;
        let current = 0;

        for (let i = 0; i < solvedDates.length; i++) {
            if (i === 0) {
                current = 1;
            } else {
                const prev = new Date(solvedDates[i - 1]);
                const curr = new Date(solvedDates[i]);
                const diff = (curr.getTime() - prev.getTime()) / 86400000;
                if (diff === 1) {
                    current++;
                } else {
                    current = 1;
                }
            }
            longest = Math.max(longest, current);
        }

        return longest;
    },

    /**
     * Get all records for display (most recent first).
     */
    getAllRecords(): DailySolveRecord[] {
        return loadRecords().slice().reverse();
    },

    /**
     * Get category breakdown: how many times each category was attempted/solved.
     */
    getCategoryBreakdown(): Record<string, { attempted: number; solved: number }> {
        const records = loadRecords();
        const breakdown: Record<string, { attempted: number; solved: number }> = {};

        for (const record of records) {
            if (!breakdown[record.category]) {
                breakdown[record.category] = { attempted: 0, solved: 0 };
            }
            breakdown[record.category].attempted++;
            if (record.solved) breakdown[record.category].solved++;
        }

        return breakdown;
    },

    /**
     * Get today's solve record if it exists.
     */
    getTodayRecord(): DailySolveRecord | null {
        const today = new Date().toISOString().split('T')[0];
        return loadRecords().find(r => r.date === today) ?? null;
    },
};
