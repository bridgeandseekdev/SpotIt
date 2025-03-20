import BotGameCard from './BotGameCard';
import { useBotGameContext } from '../../context';

const BotGameBoard = () => {
  const { gameState, handleMatch } = useBotGameContext();
  const { topCardInPile, userDeckState, botDeckState } = gameState;

  return userDeckState.cardsRemaining && botDeckState.cardsRemaining ? (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 max-h-full flex items-center justify-center">
        <BotGameCard symbols={topCardInPile} />
      </div>
      <div className="flex-1 max-h-full flex items-center justify-center">
        <BotGameCard
          symbols={userDeckState.topCard}
          isInteractive
          onSymbolClick={handleMatch}
        />
      </div>
    </div>
  ) : null;
};

export default BotGameBoard;
