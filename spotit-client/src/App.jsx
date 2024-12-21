/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import deck from '/src/assets/decks/classic_deck_7.json';
import { ICON_MAP } from './assets/icons';
import { useTheme } from './context/ThemeContext';
import shuffle from 'lodash.shuffle';

// Positions for 8 symbols in a circular pattern
const SYMBOL_POSITIONS = [
  { top: '12%', left: '50%', transform: 'translate(-50%, 0)' },
  { top: '25%', right: '15%' },
  { bottom: '25%', right: '15%' },
  { bottom: '12%', left: '50%', transform: 'translate(-50%, 0)' },
  { bottom: '25%', left: '15%' },
  { top: '25%', left: '15%' },
  { top: '55%', left: '40%', transform: 'translate(-50%, -50%)' },
  { top: '50%', left: '65%', transform: 'translate(-50%, -50%)' },
];

// Components
const SymbolIcon = ({ symbol, className }) => {
  const IconComponent = ICON_MAP[symbol];

  if (!IconComponent) {
    console.warn(`No icon found for symbol: ${symbol}`);
    return null;
  }

  return <IconComponent className={className} aria-label={symbol} />;
};

const GameCard = ({ symbols, isInteractive = false, onSymbolClick }) => {
  return (
    <div className="relative h-[80%] sm:h-[90%] aspect-square rounded-full shadow-md backdrop-blur-3xl border border-neutral-200">
      {symbols.map((symbol, index) => {
        const rotation = Math.floor(
          Math.random() * (isInteractive ? -90 : 180),
        );
        const position = SYMBOL_POSITIONS[index];

        const symbolContent = (
          <SymbolIcon symbol={symbol} className="w-full h-full" />
        );

        return (
          <div
            key={`${symbol}-${index}`}
            className="absolute w-10 h-10 md:w-16 md:h-16"
            style={{
              ...position,
              transform: `${position.transform || ''} rotate(${rotation}deg)`,
            }}
          >
            {isInteractive ? (
              <button
                onClick={() => onSymbolClick(symbol)}
                className="w-full h-full"
                aria-label={`Select ${symbol}`}
              >
                {symbolContent}
              </button>
            ) : (
              symbolContent
            )}
          </div>
        );
      })}
    </div>
  );
};

const useGameState = (initialDeck) => {
  const [gameState, setGameState] = useState(() => {
    const shuffledDeck = shuffle(initialDeck);
    return {
      topCard: shuffledDeck[0],
      remainingCards: shuffledDeck.slice(1),
      cardsRemaining: shuffledDeck.length - 1,
    };
  });

  const handleMatch = useCallback((symbol) => {
    setGameState((prevState) => {
      if (
        prevState.remainingCards.length === 0 ||
        !prevState.topCard.includes(symbol)
      ) {
        return prevState;
      }

      return {
        topCard: prevState.remainingCards[0],
        remainingCards: prevState.remainingCards.slice(1),
        cardsRemaining: prevState.cardsRemaining - 1,
      };
    });
  }, []);

  return { ...gameState, handleMatch };
};

function App() {
  const { topCard, remainingCards, cardsRemaining, handleMatch } =
    useGameState(deck);

  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className="relative flex flex-col dark:bg-[#192331] dark:text-[#f1f3f7]"
      style={{ height: '100dvh' }}
    >
      <div className="absolute top-4 right-6">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? 'Light' : 'Dark'}
        </button>
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
}

export default App;
