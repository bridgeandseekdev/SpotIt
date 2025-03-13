import shuffle from 'lodash.shuffle';
import PropTypes from 'prop-types';
import GameCard from './GameCard';

const GameBoard = ({ gameState, gameSettings, onMatch }) => {
  const { topCard, remainingCards } = gameState;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 max-h-full flex items-center justify-center">
        <GameCard symbols={topCard} gameSettings={gameSettings} />
      </div>

      {remainingCards.length > 0 && (
        <div className="flex-1 max-h-full flex items-center justify-center">
          <GameCard
            symbols={shuffle([...remainingCards[0]])}
            isInteractive
            onSymbolClick={onMatch}
            gameSettings={gameSettings}
          />
        </div>
      )}
    </div>
  );
};

GameBoard.propTypes = {
  gameState: PropTypes.shape({
    topCard: PropTypes.array.isRequired,
    remainingCards: PropTypes.array.isRequired,
  }),
  gameSettings: PropTypes.object,
  onMatch: PropTypes.func,
};

export default GameBoard;
