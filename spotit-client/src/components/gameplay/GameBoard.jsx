import shuffle from 'lodash.shuffle';
import GameCard from './GameCard';
import { useGameContext } from '../../context';

const GameBoard = () => {
  const { gameState, handleMatch } = useGameContext();
  const { topCard, remainingCards } = gameState;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 max-h-full flex items-center justify-center">
        <GameCard symbols={topCard} />
      </div>

      {remainingCards.length > 0 && (
        <div className="flex-1 max-h-full flex items-center justify-center">
          <GameCard
            symbols={shuffle([...remainingCards[0]])}
            isInteractive
            onSymbolClick={handleMatch}
          />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
