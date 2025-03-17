import { useGameContext } from '../../context';
import GameTimer from './GameTimer';
import GameScore from './GameScore';
import GameCompletionStatus from './GameCompletionStatus';

const GameStatus = () => {
  const { gameState, gameSettings, timeLeft, initializeGame, originalDeck } =
    useGameContext();

  return (
    <div
      className={`flex ${
        !gameState.cardsRemaining ? 'flex-1' : ''
      } flex-col justify-center items-center text-center pb-4`}
    >
      <GameCompletionStatus cardsRemaining={gameState.cardsRemaining} />
      {gameSettings?.mode === 'timed' && gameState.cardsRemaining ? (
        <GameTimer timeLeft={timeLeft} difficulty={gameSettings.difficulty} />
      ) : null}
      <GameScore score={gameState.score} total={originalDeck.length} />
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
