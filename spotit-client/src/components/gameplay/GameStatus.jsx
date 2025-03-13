import { useGameContext } from '../../context';

const GameStatus = () => {
  const { gameState } = useGameContext();

  return (
    <div className="flex-none text-center pb-4">
      <h2 className="text-lg font-semibold">
        Cards Remaining: {gameState.cardsRemaining}
      </h2>
    </div>
  );
};

export default GameStatus;
