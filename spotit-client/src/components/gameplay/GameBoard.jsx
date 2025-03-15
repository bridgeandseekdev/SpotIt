import GameCard from './GameCard';
import { useGameContext } from '../../context';

const GameBoard = () => {
  const { gameState, handleMatch } = useGameContext();
  const { topCardInPile, topCardInUserDeck } = gameState;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 max-h-full flex items-center justify-center">
        <GameCard symbols={topCardInPile} />
      </div>

      {topCardInUserDeck && (
        <div className="flex-1 max-h-full flex items-center justify-center">
          <GameCard
            symbols={topCardInUserDeck}
            isInteractive
            onSymbolClick={handleMatch}
          />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
