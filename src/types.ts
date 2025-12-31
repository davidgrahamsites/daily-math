export interface SolutionStep {
    latex?: string;
    explanation: string;
}

export interface Problem {
    id: string;
    date: string;
    title: string;
    concept: string;
    statement: string; // The English description (e.g. "Find the integral...")
    latex: string; // The pure Math formula
    hints: {
        text: string;
        definitions?: {
            term: string;
            definition: string;
            deepDive?: { // Educational expansion
                explanation: string; // Broad concept explanation
                example: {
                    problem: string; // "Find the derivative of x^2"
                    steps: string[]; // ["Step 1...", "Step 2..."]
                    answer: string;
                }
            }
        }[];
    }[];
    solutionSteps: SolutionStep[];
    answer: string; // The numeric or algebraic answer for validation
    verificationFunction?: (input: string) => boolean; // Advanced verification
}
