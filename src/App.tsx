import { useState, useEffect } from 'react';
import { BarChart3, Loader2, Palette } from 'lucide-react';
import { getDailyProblem } from './services/problemService';
import { type Problem } from './types';
import { DailyProblemView } from './features/daily-problem/DailyProblemView';
import { SolverInterface } from './features/daily-problem/SolverInterface';

type Theme = 'default' | 'light' | 'matrix';

function App() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSolving, setIsSolving] = useState(false);
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    // Apply theme
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'default') return 'light';
      if (current === 'light') return 'matrix';
      return 'default';
    });
  };

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const data = await getDailyProblem();
        setProblem(data);
      } catch (error) {
        console.error('Failed to load problem', error);
      } finally {
        setLoading(false);
      }
    };
    loadProblem();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col p-4 relative transition-colors duration-300">
      <header className="flex justify-between items-center py-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Daily<span className="text-gradient">Math</span>
        </h1>
        <div className="flex gap-4">
          <button
            onClick={toggleTheme}
            style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
            className="hover:text-blue-400 transition-colors p-2 rounded-full"
            aria-label="Change Theme"
            title="Switch Theme"
          >
            <Palette size={24} />
          </button>
          <button
            style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
            className="hover:text-blue-400 transition-colors p-2 rounded-full"
            aria-label="Stats"
          >
            <BarChart3 size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        {loading ? (
          <div className="glass-panel p-6 flex items-center justify-center min-h-[300px]">
            <Loader2 className="animate-spin text-accent-primary" size={32} />
          </div>
        ) : problem ? (
          isSolving ? (
            <SolverInterface problem={problem} onBack={() => setIsSolving(false)} />
          ) : (
            <>
              <DailyProblemView problem={problem} />

              <button
                onClick={() => setIsSolving(true)}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-500 transition-colors mt-auto relative z-10 cursor-pointer text-lg"
              >
                Start Solving
              </button>
            </>
          )
        ) : (
          <div className="text-center text-error">Failed to load problem.</div>
        )}
      </main>

      {!isSolving && (
        <footer className="py-6 text-center text-xs text-secondary opacity-60">
          © {new Date().getFullYear()} DailyMath
        </footer>
      )}
    </div>
  );
}

export default App;
