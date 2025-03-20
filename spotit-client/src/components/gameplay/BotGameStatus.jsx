import { useBotGameContext } from '../../context';
import BotGameScore from './BotGameScore';
import BotGameCompletionStatus from './BotGameCompletionStatus';

const BotGameStatus = () => {
  const { gameState } = useBotGameContext();
  const isWinner =
    !gameState.userDeckState.cardsRemaining ||
    !gameState.botDeckState.cardsRemaining;

  return (
    <div
      className={`flex ${
        isWinner ? 'flex-1' : ''
      } flex-col justify-center items-center text-center pb-4`}
    >
      <BotGameCompletionStatus
        botCardsRemaining={gameState.botDeckState.cardsRemaining}
        userCardsRemaining={gameState.userDeckState.cardsRemaining}
      />
      <BotGameScore
        userScore={gameState.userDeckState.score}
        botScore={gameState.botDeckState.score}
        isWinner={isWinner}
      />
    </div>
  );
};

export default BotGameStatus;
