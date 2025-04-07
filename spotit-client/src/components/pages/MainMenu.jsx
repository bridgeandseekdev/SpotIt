import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../context';
import { Gamepad, Timer, Bot, Users } from 'lucide-react';

function MainMenu() {
  const navigate = useNavigate();
  const {
    setGameMode,
    offline: { gameStatus },
    resetGame,
  } = useGameContext();

  const handleModeSelection = (mode) => {
    resetGame();
    setGameMode(mode);
    if (mode === 'online') {
      navigate('/online/create');
      return;
    }
    navigate('/difficulty');
  };

  useEffect(() => {
    if (gameStatus !== 'idle') {
      resetGame();
    }
  }, [gameStatus, resetGame]);

  return (
    <div className="max-w-md md:max-w-6xl mx-auto py-10">
      <div className="flex flex-col justify-center items-center">
        <p className="rounded-full px-4  text-sm bg-bg-dark-secondary text-text-dark-primary dark:bg-white dark:text-text-primary max-w-fit leading-loose">
          The Ultimate Pattern Matching Game
        </p>
        <div className="flex flex-col justify-center items-center mt-2">
          <h1 className="font-bold text-3xl md:text-5xl">
            SpotIt -{' '}
            <span className="text-text-accent font-bold text-3xl md:text-5xl">
              Quick Eyes Win!
            </span>
          </h1>

          <p className="text-base text-center text-text-secondary/80 dark:text-text-dark-secondary/80 mt-6 max-w-sm md:max-w-lg leading-relaxed">
            Challenge your observation skills in this fast-paced game where
            every card shares exactly one matching symbol.{' '}
            <span className="font-semibold dark:text-text-dark-secondary text-lg">
              Will you be the fastest to spot it?
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 mt-24">
        <h2 className="font-semibold text-lg">Choose your game mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-4xl px-4">
          <div
            onClick={() => handleModeSelection('practice')}
            className="flex items-center p-6 bg-white dark:bg-bg-dark-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <div className="mr-6">
              <Gamepad size={32} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Practice Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Train yourself at your own pace
              </p>
            </div>
          </div>

          <div
            onClick={() => handleModeSelection('timed')}
            className="flex items-center p-6 bg-white dark:bg-bg-dark-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <div className="mr-6">
              <Timer size={32} className="text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Timed Challenge</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Race against the clock
              </p>
            </div>
          </div>

          <div
            onClick={() => handleModeSelection('bot')}
            className="flex items-center p-6 bg-white dark:bg-bg-dark-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <div className="mr-6">
              <Bot size={32} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Play with bot</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Challenge our bot in an exciting duel
              </p>
            </div>
          </div>

          <div
            onClick={() => handleModeSelection('online')}
            className="flex items-center p-6 bg-white dark:bg-bg-dark-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-neutral-200 dark:border-neutral-700"
          >
            <div className="mr-6">
              <Users size={32} className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">2 Player</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Play with your friend online in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
