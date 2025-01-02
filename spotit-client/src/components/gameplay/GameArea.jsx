import { useEffect, useState } from 'react';
import shuffle from 'lodash.shuffle';
import { useNavigate, useLocation } from 'react-router-dom';

import GameCard from './GameCard';
import { useGameState } from '../../hooks/useGameState';
import { getDeckBySettings } from '../../utils/gameUtils';
// import staticDeck from '/src/assets/decks/classic_deck_7.json';

const GameArea = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deck, setDeck] = useState(null);

  const gameSettings = location.state || {
    theme: 'classic',
    difficulty: 'easy',
    symbolsPerCard: '8',
  };

  useEffect(() => {
    //If no settings were passed, redirect to home page
    if (!location.state) {
      navigate('/');
      return;
    }

    const loadDeck = async () => {
      try {
        const deckData = await getDeckBySettings(
          gameSettings.theme,
          gameSettings.symbolsPerCard,
        );
        setDeck(deckData);
      } catch {
        const classicDeck = await import(
          '/src/assets/decks/classic_deck_7.json'
        );
        setDeck(classicDeck);
      }
    };

    loadDeck();
  }, [
    location.state,
    navigate,
    gameSettings.theme,
    gameSettings.symbolsPerCard,
  ]);

  const gameState = useGameState(deck);

  if (!deck || !gameState) return <div>Loading...</div>;

  const { topCard, remainingCards, cardsRemaining, handleMatch } = gameState;

  return (
    <div className="relative flex flex-col" style={{ height: '100dvh' }}>
      <div className="absolute left-2 top-4" onClick={() => navigate('/')}>
        Quit
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 max-h-full flex items-center justify-center">
          <GameCard symbols={topCard} gameSettings={gameSettings} />
        </div>

        {remainingCards.length > 0 && (
          <div className="flex-1 max-h-full flex items-center justify-center">
            <GameCard
              symbols={shuffle([...remainingCards[0]])}
              isInteractive
              onSymbolClick={handleMatch}
              gameSettings={gameSettings}
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
