import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewGameContext } from '../../context';
import ModeCard from '../common/ModeCard';
import { Gamepad, Timer, Bot, Users } from 'lucide-react';

function MainMenu() {
  const navigate = useNavigate();

  const {
    setGameModeAction,
    gameState: { gameStatus },
    handleResetAction,
  } = useNewGameContext();

  const handleModeSelection = (mode) => {
    handleResetAction();
    setGameModeAction(mode);
    setGameModeAction(mode);
    if (mode === 'online') {
      navigate('/online/create');
      return;
    }
    navigate('/difficulty');
  };

  useEffect(() => {
    if (gameStatus !== 'idle') {
      handleResetAction();
    }
  }, [gameStatus, handleResetAction]);

  return (
    <div className="max-w-md md:max-w-6xl mx-auto py-10">
      <div className="flex flex-col justify-center items-center">
        <p className="rounded-full px-4 text-xs md:text-sm bg-bg-dark-secondary text-text-dark-primary dark:bg-white dark:text-text-primary max-w-fit leading-loose">
          The Ultimate Pattern Matching Game
        </p>
        <div className="flex flex-col justify-center items-center mt-2">
          <h1 className="font-bold text-2xl md:text-5xl">
            SpotIt -{' '}
            <span className="text-text-accent font-bold text-2xl md:text-5xl">
              Quick Eyes Win!
            </span>
          </h1>

          <p className="text-sm md:text-base text-center text-text-secondary/80 dark:text-text-dark-secondary/80 mt-6 px-2 md:p-0 max-w-sm md:max-w-lg leading-relaxed">
            Challenge your observation skills in this fast-paced game where
            every card shares exactly one matching symbol.{' '}
            <span className="font-semibold dark:text-text-dark-secondary text-base md:text-lg">
              Will you be the fastest to spot it?
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 mt-12 md:mt-24">
        <h2 className="font-semibold md:text-lg">Choose your game mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-4xl px-10 md:px-4">
          <ModeCard
            onClick={() => handleModeSelection('practice')}
            Icon={Gamepad}
            iconColor="text-blue-500"
            title="Practice Mode"
            description="Train yourself at your own pace"
          />
          <ModeCard
            onClick={() => handleModeSelection('timed')}
            Icon={Timer}
            iconColor="text-orange-500"
            title="Timed Challenge"
            description="Race against the clock"
          />
          <ModeCard
            onClick={() => handleModeSelection('bot')}
            Icon={Bot}
            iconColor="text-green-500"
            title="Play with bot"
            description="Challenge our bot in an exciting duel"
          />
          <ModeCard
            onClick={() => handleModeSelection('online')}
            Icon={Users}
            iconColor="text-purple-500"
            title="2 Player"
            description="Play with your friend online in real-time"
          />
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
