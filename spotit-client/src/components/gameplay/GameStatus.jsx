import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';
import { useGameContext } from '../../context';

const GameStatus = () => {
  const { gameState, gameSettings, timeLeft } = useGameContext();

  return (
    <div className="flex-none text-center pb-4">
      <h2 className="text-lg font-semibold">
        Cards Remaining: {gameState.cardsRemaining}
      </h2>
      {gameSettings?.mode === 'timed' ? (
        <div className="flex flex-col justify-center w-[30%] mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${
                  (timeLeft /
                    DIFFICULTY_CONFIGS[gameSettings.difficulty].timerSeconds) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <h2 className="text-lg font-semibold">Time Remaining: {timeLeft}</h2>
        </div>
      ) : null}
    </div>
  );
};

export default GameStatus;
