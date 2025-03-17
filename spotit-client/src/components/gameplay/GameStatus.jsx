import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';
import { useGameContext } from '../../context';

const GameStatus = () => {
  const { gameState, gameSettings, timeLeft, initializeGame, originalDeck } =
    useGameContext();

  return (
    <div
      className={`flex ${
        !gameState.cardsRemaining ? 'flex-1' : ''
      } flex-col justify-center items-center text-center pb-4`}
    >
      <h2 className="text-lg font-semibold">
        {gameState.cardsRemaining
          ? `Cards Remaining: ${gameState.cardsRemaining}`
          : 'Game Completed!'}
      </h2>
      {gameSettings?.mode === 'timed' ? (
        gameState.cardsRemaining ? (
          <div className="flex flex-col justify-center w-[30%] mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${
                    (timeLeft /
                      DIFFICULTY_CONFIGS[gameSettings.difficulty]
                        .timerSeconds) *
                    100
                  }%`,
                }}
              ></div>
            </div>
            <h2 className="text-lg font-semibold">
              Time Remaining: {timeLeft}s
            </h2>
          </div>
        ) : null
      ) : null}
      <h2 className="mt-2 text-lg font-semibold">
        Score: {gameState.score}/{originalDeck.length}
      </h2>
      {!gameState.cardsRemaining && (
        <div>
          <button
            onClick={() => initializeGame(originalDeck, gameSettings)}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Play again!
          </button>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
