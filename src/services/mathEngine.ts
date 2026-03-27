import { evaluate } from 'mathjs';

export const validateAnswer = (userInput: string, correctAnswer: string): boolean => {
    // First try: exact string match (normalized)
    const normalizeStr = (s: string) => s.trim().toLowerCase()
        .replace(/\s+/g, '')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi');

    if (normalizeStr(userInput) === normalizeStr(correctAnswer)) {
        return true;
    }

    try {
        // Second try: numerical comparison using mathjs
        const userVal = evaluate(userInput);
        const correctVal = evaluate(correctAnswer);

        if (userVal === undefined || correctVal === undefined) return false;

        // Tolerance for floating point
        const EPSILON = 0.001;
        return Math.abs(userVal - correctVal) < EPSILON;
    }
    catch (e) {
        console.warn("Validation error:", e);
        return false;
    }
}

export const formatInputLatex = (input: string): string => {
    // Primitive parser to beautify input for display as user types
    // Replace * with \times, etc.
    // This can be improved with a real latex generator library if needed
    return input
        .replace(/\*/g, '\\times ')
        .replace(/\//g, '\\div ')
        .replace(/pi/g, '\\pi ')
        .replace(/sqrt/g, '\\sqrt')
        .replace(/sin/g, '\\sin ')
        .replace(/cos/g, '\\cos ')
        .replace(/tan/g, '\\tan ')
        .replace(/ln/g, '\\ln ')
        .replace(/log/g, '\\log ')
        .replace(/d\/dx/g, '\\frac{d}{dx} ')
        .replace(/∫/g, '\\int ')
        .replace(/∑/g, '\\sum ')
        .replace(/∏/g, '\\prod ')
        .replace(/∞/g, '\\infty ')
        .replace(/theta/g, '\\theta ')
        .replace(/∀/g, '\\forall ')
        .replace(/∃/g, '\\exists ')
        .replace(/∈/g, '\\in ')
        .replace(/∉/g, '\\notin ')
        .replace(/⊂/g, '\\subset ')
        .replace(/⊃/g, '\\supset ')
        .replace(/∪/g, '\\cup ')
        .replace(/∩/g, '\\cap ')
        .replace(/∧/g, '\\land ')
        .replace(/∨/g, '\\lor ')
        .replace(/¬/g, '\\neg ')
        .replace(/⇒/g, '\\Rightarrow ')
        .replace(/⇔/g, '\\Leftrightarrow ')
        .replace(/∴/g, '\\therefore ')
        .replace(/∵/g, '\\because ')
        .replace(/∅/g, '\\emptyset ')
        .replace(/→/g, '\\to ')
        .replace(/∠/g, '\\angle ')
        .replace(/△/g, '\\triangle ')
        .replace(/□/g, '\\square ')
        .replace(/∥/g, '\\parallel ')
        .replace(/⊥/g, '\\perp ')
        .replace(/≅/g, '\\cong ')
        .replace(/°/g, '^{\\circ}');
}
