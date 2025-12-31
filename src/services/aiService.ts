import type { Problem } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `
You are a Daily Math generator. Your goal is to generate a unique, interesting math problem that builds conceptual thinking.
Output MUST be valid JSON matching this TypeScript interface:
{
  id: string; (unique UUID)
  date: string; (YYYY-MM-DD)
  title: string;
  concept: string; (e.g. "Calculus • Optimization")
  statement: string; (The English description of the problem. PLAIN TEXT ONLY. DO NOT use LaTeX here. Write "integral from a to b" not "\int_a^b".)
  latex: string; (The pure math formula ONLY. Do NOT include any sentences, words or descriptions here. Example: "\int x dx")
  hints: { 
      text: string; 
      definitions: { 
        term: string; 
        definition: string;
        deepDive: {
           explanation: string; (A broader explanation of the concept for beginners)
           example: {
               problem: string; (Simplest possible example. Wrap English text in \\text{...}. Ex: "\\text{Find } x \\text{ if } x^2=4")
               steps: string[]; (Step by step. Wrap English text in \\text{...}. Ex: "\\text{Set derivative to 0: } 2x=0")
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
 - **IMPORTANT**: Output raw LaTeX for the 'latex' field. Do NOT wrap in $...$, \[...\], or \(...\).
 - **SYNTAX RULE**: ALWAYS use backslashes for functions. Use "\sqrt{x}" NOT "sqrt(x)". Use "\sin(x)" NOT "sin(x)". Use "\pi" NOT "pi".
 - **NO SPOILERS**: The 'latex' field MUST NOT contain the answer, result, OR the formula to calculate the answer. It should ONLY show the visual mathematical objects described in the setup (e.g. a shape, a function definition, an integral with limits).
 - IF THE PROBLEM IS "Find the area...", DO NOT write the area formula in 'latex'. Leave 'latex' empty or just show the shape dimensions.
 - Example: Problem "Evaluate integral e^x...", Latex "\int e^x dx".
 - Example: Problem "Find area of square side 4", Latex "4" (or empty). DO NOT write "4^2" or "16".
 - Example Explanation: "Substitute $h$ into the equation..." (Use dollar signs for variables in text)
`;

export const fetchAIProblem = async (apiKey: string): Promise<Problem> => {
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
                    { role: 'user', content: 'Generate a unique math problem for today.' }
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
            statement: cleanStatement
        };
    } catch (error) {
        console.error('AI Generation failed:', error);
        throw error;
    }
};
