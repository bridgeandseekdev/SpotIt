import { useGameContext } from '../../context';

const GameStatus = () => {
  const { gameState, gameSettings, timeLeft } = useGameContext();

  return (
    <div className="flex-none text-center pb-4">
      <h2 className="text-lg font-semibold">
        Cards Remaining: {gameState.cardsRemaining}
      </h2>
      {gameSettings?.mode === 'timed' ? (
        <h2 className="text-lg font-semibold">Time Remaining: {timeLeft}</h2>
      ) : null}
    </div>
  );
};

export default GameStatus;
