/* eslint-disable react/prop-types */

import deck from '/src/assets/decks/classic_deck_7.json';
import shuffle from 'lodash.shuffle';

import { useGameState } from './hooks/useGameState';
import GameCard from './components/gameplay/GameCard';
import DarkModeSwitch from './components/DarkModeSwitch';

function App() {
  const { topCard, remainingCards, cardsRemaining, handleMatch } =
    useGameState(deck);

  return (
    <div
      className="relative flex flex-col bg-gradient-to-br from-orange-100 to-purple-100 dark:bg-none dark:bg-bg-dark-tertiary dark:text-text-dark-primary"
      style={{ height: '100dvh' }}
    >
      <DarkModeSwitch />
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
}

export default App;
