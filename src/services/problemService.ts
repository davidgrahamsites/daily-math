import type { Problem } from '../types';
import { fetchAIProblem } from './aiService';
import { getStoredApiKey } from '../features/settings/Settings';

const MOCK_PROBLEM: Problem = {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    title: 'Riemann Sum Limit',
    concept: 'Calculus • Definite Integrals',
    statement: 'Evaluate the limit of the Riemann sum on the interval [0, 1].',
    latex: '\\lim_{n \\to \\infty} \\sum_{i=1}^{n} \\frac{1}{n} e^{i/n}',
    hints: [
        {
            text: 'What is the formal definition of a Definite Integral?',
            definitions: [{ term: 'Definite Integral', definition: 'The net signed area under a curve.' }]
        },
        {
            text: 'Recall that $\\int_a^b f(x) dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i) \\Delta x$.',
        },
        {
            text: 'Identify the components: $\\Delta x = 1/n$, $x_i = i/n$.',
        }
    ],
    solutionSteps: [
        { explanation: 'This limit represents the definition of the definite integral of $e^x$ from 0 to 1.' },
        { latex: '\\int_0^1 e^x dx', explanation: 'Set up the integral.' },
        { latex: '[e^x]_0^1', explanation: 'Find the antiderivative.' },
        { latex: 'e^1 - e^0 = e - 1', explanation: 'Evaluate.' }
    ],
    answer: 'e-1'
};

export const getDailyProblem = async (): Promise<Problem> => {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily_math_problem_v10_${today}`;

    // Check Cache First
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch (e) {
            console.error('Failed to parse cached problem', e);
            localStorage.removeItem(cacheKey);
        }
    }

    // Try to get API key from Capacitor storage first, fallback to .env
    let apiKey = await getStoredApiKey();
    if (!apiKey) {
        apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    }

    // If API key is present, try to fetch from AI
    if (apiKey && apiKey.length > 10) {
        try {
            const problem = await fetchAIProblem(apiKey);
            // Cache the result
            localStorage.setItem(cacheKey, JSON.stringify(problem));
            return problem;
        } catch (e) {
            console.warn('Falling back to mock data due to AI error', e);
        }
    }

    // Fallback to mock
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROBLEM;
};
