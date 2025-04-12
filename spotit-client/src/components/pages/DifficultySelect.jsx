import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useNewGameContext } from '../../context';
import { ArrowLeft } from 'lucide-react';

function DifficultySelect() {
  const navigate = useNavigate();
  const [isGameStarting, setIsGameStarting] = useState(false);
  const {
    setDifficultyAction,
    initializeGameAction,
    gameState: { mode: gameMode, difficulty },
  } = useNewGameContext();

  const handleDifficultySelection = (difficulty) => {
    setDifficultyAction(difficulty);
  };

  const handleStartGame = async () => {
    setIsGameStarting(true);
    await initializeGameAction();

    setIsGameStarting(false);
    navigate('/play');
  };

  return (
    <div className="max-w-md md:max-w-6xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary transition-colors"
      >
        <ArrowLeft size={24} />
        Back to Menu
      </button>

      <div className="flex flex-col items-center justify-center">
        <p className="rounded-full px-4 py-1 text-sm bg-white max-w-fit text-text-secondary">
          {gameMode === 'practice'
            ? 'Practice Mode'
            : gameMode === 'timed'
            ? 'Timed Challenge'
            : 'Bot Mode'}
        </p>
        <h1 className="font-bold text-3xl md:text-5xl mt-4 mb-8 text-center">
          Select Your <span className="text-text-accent">Difficulty</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
          <div
            onClick={() => handleDifficultySelection('easy')}
            className={`flex flex-col items-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border ${
              difficulty === 'easy'
                ? 'border-green-500 scale-105 bg-gradient-to-b from-green-50 to-white dark:bg-bg-dark-secondary dark:from-transparent dark:to-transparent'
                : 'bg-white dark:bg-bg-dark-secondary border-neutral-200 dark:border-neutral-700'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">Easy</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Perfect for beginners
            </p>
          </div>

          <div
            onClick={() => handleDifficultySelection('medium')}
            className={`flex flex-col items-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border ${
              difficulty === 'medium'
                ? 'border-green-500 scale-105 bg-gradient-to-b from-green-50 to-white dark:bg-bg-dark-secondary dark:from-transparent dark:to-transparent'
                : 'bg-white dark:bg-bg-dark-secondary border-neutral-200 dark:border-neutral-700'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">Medium</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              For experienced players
            </p>
          </div>

          <div
            onClick={() => handleDifficultySelection('hard')}
            className={`flex flex-col items-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border ${
              difficulty === 'hard'
                ? 'border-green-500 scale-105 bg-gradient-to-b from-green-50 to-white dark:bg-bg-dark-secondary dark:from-transparent dark:to-transparent'
                : 'bg-white dark:bg-bg-dark-secondary border-neutral-200 dark:border-neutral-700'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">Hard</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              The ultimate challenge
            </p>
          </div>
        </div>

        <button
          className={`mt-12 px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none ${
            isGameStarting
              ? 'relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent'
              : 'hover:from-green-600 hover:to-green-700'
          }`}
          onClick={handleStartGame}
          disabled={!difficulty || isGameStarting}
        >
          {isGameStarting ? 'Starting...' : 'Start Game'}
        </button>
      </div>
    </div>
  );
}

export default DifficultySelect;
