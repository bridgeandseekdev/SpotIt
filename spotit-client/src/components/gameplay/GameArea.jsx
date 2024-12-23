import shuffle from 'lodash.shuffle';

import GameCard from './GameCard';
import { useGameState } from '../../hooks/useGameState';
import deck from '/src/assets/decks/classic_deck_7.json';
import { useNavigate, useLocation } from 'react-router-dom';

const GameArea = () => {
  const { topCard, remainingCards, cardsRemaining, handleMatch } =
    useGameState(deck);
  const navigate = useNavigate();
  const location = useLocation();

  const params = location.state;
  console.log(params);

  return (
    <div className="relative flex flex-col" style={{ height: '100dvh' }}>
      <div className="absolute left-2 top-4" onClick={() => navigate('/')}>
        Quit
      </div>
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

      <div className="flex-none text-center pb-4">
        <h2 className="text-lg font-semibold">
          Cards Remaining: {cardsRemaining}
        </h2>
      </div>
    </div>
  );
};

export default GameArea;
