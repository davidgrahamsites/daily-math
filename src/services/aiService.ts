import type { Problem, AnswerType } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// ─── MATH TAXONOMY ──────────────────────────────────────────────────────────
// 15 categories, ~60 subtopics drawn from the full map of mathematics

interface MathSubtopic {
    name: string;
    answerType: AnswerType;
}

interface MathCategory {
    name: string;
    subtopics: MathSubtopic[];
}

export const MATH_CATEGORIES: MathCategory[] = [
    {
        name: 'Arithmetic',
        subtopics: [
            { name: 'Order of Operations', answerType: 'numeric' },
            { name: 'Fractions & Decimals', answerType: 'fraction' },
            { name: 'Ratios & Proportions', answerType: 'fraction' },
            { name: 'Percentages', answerType: 'numeric' },
        ]
    },
    {
        name: 'Algebra',
        subtopics: [
            { name: 'Linear Equations', answerType: 'numeric' },
            { name: 'Quadratic Equations', answerType: 'algebraic' },
            { name: 'Systems of Equations', answerType: 'numeric' },
            { name: 'Polynomials', answerType: 'algebraic' },
            { name: 'Inequalities', answerType: 'algebraic' },
        ]
    },
    {
        name: 'Geometry',
        subtopics: [
            { name: 'Area & Perimeter', answerType: 'geometry' },
            { name: 'Circles', answerType: 'geometry' },
            { name: 'Triangles & Angles', answerType: 'geometry' },
            { name: '3D Solids & Volume', answerType: 'geometry' },
            { name: 'Coordinate Geometry', answerType: 'geometry' },
        ]
    },
    {
        name: 'Trigonometry',
        subtopics: [
            { name: 'Unit Circle & Special Angles', answerType: 'algebraic' },
            { name: 'Trigonometric Identities', answerType: 'algebraic' },
            { name: 'Law of Sines & Cosines', answerType: 'numeric' },
            { name: 'Inverse Trig Functions', answerType: 'algebraic' },
        ]
    },
    {
        name: 'Probability & Statistics',
        subtopics: [
            { name: 'Counting & Permutations', answerType: 'numeric' },
            { name: 'Combinations', answerType: 'numeric' },
            { name: "Bayes' Theorem", answerType: 'fraction' },
            { name: 'Expected Value', answerType: 'numeric' },
            { name: 'Distributions & Variance', answerType: 'numeric' },
        ]
    },
    {
        name: 'Logic & Proofs',
        subtopics: [
            { name: 'Truth Tables', answerType: 'symbolic' },
            { name: 'Set Operations', answerType: 'symbolic' },
            { name: 'Propositional Logic', answerType: 'symbolic' },
            { name: 'Proof by Induction', answerType: 'text' },
        ]
    },
    {
        name: 'Calculus',
        subtopics: [
            { name: 'Limits', answerType: 'numeric' },
            { name: 'Derivatives', answerType: 'algebraic' },
            { name: 'Integrals', answerType: 'algebraic' },
            { name: 'Series & Sequences', answerType: 'numeric' },
            { name: 'Optimization', answerType: 'numeric' },
        ]
    },
    {
        name: 'Discrete Math',
        subtopics: [
            { name: 'Graph Theory', answerType: 'numeric' },
            { name: 'Combinatorics', answerType: 'numeric' },
            { name: 'Recurrence Relations', answerType: 'algebraic' },
            { name: 'Modular Arithmetic', answerType: 'numeric' },
        ]
    },
    {
        name: 'Differential Equations',
        subtopics: [
            { name: 'Separable Equations', answerType: 'algebraic' },
            { name: 'Linear ODEs', answerType: 'algebraic' },
            { name: 'Initial Value Problems', answerType: 'algebraic' },
            { name: 'Exact Equations', answerType: 'algebraic' },
        ]
    },
    {
        name: 'Linear Algebra',
        subtopics: [
            { name: 'Matrix Operations', answerType: 'numeric' },
            { name: 'Determinants', answerType: 'numeric' },
            { name: 'Eigenvalues & Eigenvectors', answerType: 'numeric' },
            { name: 'Vector Spaces', answerType: 'algebraic' },
            { name: 'Linear Transformations', answerType: 'numeric' },
        ]
    },
    {
        name: 'Number Theory',
        subtopics: [
            { name: 'Primes & Factorization', answerType: 'numeric' },
            { name: 'GCD & LCM', answerType: 'numeric' },
            { name: 'Modular Arithmetic', answerType: 'numeric' },
            { name: 'Divisibility Rules', answerType: 'numeric' },
            { name: 'Diophantine Equations', answerType: 'numeric' },
        ]
    },
    {
        name: 'Abstract Algebra',
        subtopics: [
            { name: 'Groups & Symmetry', answerType: 'numeric' },
            { name: 'Rings & Fields', answerType: 'symbolic' },
            { name: 'Isomorphisms', answerType: 'symbolic' },
        ]
    },
    {
        name: 'Real Analysis',
        subtopics: [
            { name: 'Sequences & Convergence', answerType: 'numeric' },
            { name: 'Series Convergence Tests', answerType: 'text' },
            { name: 'Continuity & Limits', answerType: 'numeric' },
        ]
    },
    {
        name: 'Complex Analysis',
        subtopics: [
            { name: 'Complex Arithmetic', answerType: 'algebraic' },
            { name: 'Polar Form & Modulus', answerType: 'numeric' },
            { name: "Euler's Formula", answerType: 'algebraic' },
            { name: 'Roots of Unity', answerType: 'algebraic' },
        ]
    },
    {
        name: 'Applied Mathematics',
        subtopics: [
            { name: 'Optimization Problems', answerType: 'numeric' },
            { name: 'Game Theory', answerType: 'numeric' },
            { name: 'Financial Mathematics', answerType: 'numeric' },
            { name: 'Physics Applications', answerType: 'numeric' },
        ]
    },
];

// ─── CATEGORY SELECTION ──────────────────────────────────────────────────────

/** Uses date-based seeding + randomness to avoid repeating the same category */
export function getRandomCategory(): { category: string; subtopic: string; answerType: AnswerType } {
    // Use today's date as part of the seed to get variety day-to-day
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Pick a category based on day, with some randomness
    const catIndex = (dayOfYear + Math.floor(Math.random() * 3)) % MATH_CATEGORIES.length;
    const category = MATH_CATEGORIES[catIndex];
    
    // Pick a random subtopic within that category
    const subIndex = Math.floor(Math.random() * category.subtopics.length);
    const subtopic = category.subtopics[subIndex];
    
    return {
        category: category.name,
        subtopic: subtopic.name,
        answerType: subtopic.answerType,
    };
}

// ─── AI PROMPT ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are a Daily Math generator. Your goal is to generate a unique, interesting math problem that builds conceptual thinking.
Output MUST be valid JSON matching this TypeScript interface:
{
  id: string; (unique UUID)
  date: string; (YYYY-MM-DD)
  title: string;
  concept: string; (e.g. "Algebra • Quadratic Equations")
  category: string; (The math branch, e.g. "Algebra")
  subcategory: string; (The specific topic, e.g. "Quadratic Equations")
  answerType: string; (One of: "numeric", "algebraic", "fraction", "matrix", "symbolic", "text", "geometry")
  statement: string; (The English description of the problem. PLAIN TEXT ONLY. DO NOT use LaTeX here. Write "integral from a to b" not "\\int_a^b".)
  latex: string; (The pure math formula ONLY. Do NOT include any sentences, words or descriptions here. Example: "\\int x dx")
  hints: { 
      text: string; 
      definitions: { 
        term: string; 
        definition: string;
        deepDive: {
           explanation: string; (A broader explanation of the concept for beginners)
           example: {
               problem: string; (Simplest possible example. Wrap English text in \\\\text{...}. Ex: "\\\\text{Find } x \\\\text{ if } x^2=4")
               steps: string[]; (Step by step. Wrap English text in \\\\text{...}. Ex: "\\\\text{Set derivative to 0: } 2x=0")
               answer: string;
           }
        }
      }[] 
      }[] 
  }[]; (Provide 3 to 5 progressive hints. Hints should act as "crumb trails" leading to the solution. Start vaguely and get specific. IMPORTANT: Ensure the hint text explicitly mentions technical concepts (e.g. "Use the Chain Rule") so they can be defined in the 'definitions' array. Aggressively extract ALL mathematical concepts/terms mentioned in the hints for definitions.)
   solutionSteps: { explanation: string; latex?: string }[]; (Step by step solution. IMPORTANT: Wrap ALL inline math variables/numbers in explanation with '$', e.g. "The value of $x$ is $5$")
   answer: string; (The final numeric or algebraic answer for validation, e.g. "4pi" or "0.5")
 }
 
 - Problems should vary in difficulty but focus on "Aha!" moments.
 - **IMPORTANT**: Output raw LaTeX for the 'latex' field. Do NOT wrap in $...$, \\[...\\], or \\(...\\).
 - **SYNTAX RULE**: ALWAYS use backslashes for functions. Use "\\sqrt{x}" NOT "sqrt(x)". Use "\\sin(x)" NOT "sin(x)". Use "\\pi" NOT "pi".
 - **NO SPOILERS**: The 'latex' field MUST NOT contain the answer, result, OR the formula to calculate the answer. It should ONLY show the visual mathematical objects described in the setup (e.g. a shape, a function definition, an integral with limits).
 - IF THE PROBLEM IS "Find the area...", DO NOT write the area formula in 'latex'. Leave 'latex' empty or just show the shape dimensions.
 - Example: Problem "Evaluate integral e^x...", Latex "\\int e^x dx".
 - Example: Problem "Find area of square side 4", Latex "4" (or empty). DO NOT write "4^2" or "16".
 - Example Explanation: "Substitute $h$ into the equation..." (Use dollar signs for variables in text)
`;

export const fetchAIProblem = async (apiKey: string, category?: string, subtopic?: string, answerType?: AnswerType): Promise<Problem> => {
    // If no category provided, pick one randomly
    const selection = (category && subtopic && answerType)
        ? { category, subtopic, answerType }
        : getRandomCategory();

    const userMessage = `Generate a unique math problem from the branch: "${selection.category} • ${selection.subtopic}". 
The answerType should be "${selection.answerType}".
Make it engaging and educational. The problem should be specifically about ${selection.subtopic}, not a generic problem.`;

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: import.meta.env.VITE_AI_MODEL || 'gpt-4o',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`AI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const problem = JSON.parse(data.choices[0].message.content);

        // Ensure ID and Date are set if AI forgets
        const today = new Date().toISOString().split('T')[0];

        // Clean the statement of inline LaTeX delimiters which AI sometimes adds
        const cleanStatement = (problem.statement || problem.title)
            .replace(/\\\(/g, '')
            .replace(/\\\)/g, '');

        return {
            ...problem,
            id: problem.id || crypto.randomUUID(),
            date: today, // FORCE today's date
            statement: cleanStatement,
            category: problem.category || selection.category,
            subcategory: problem.subcategory || selection.subtopic,
            answerType: problem.answerType || selection.answerType,
        };
    } catch (error) {
        console.error('AI Generation failed:', error);
        throw error;
    }
};
