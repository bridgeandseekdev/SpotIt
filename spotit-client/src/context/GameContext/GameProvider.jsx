import { useState, useCallback, useMemo } from 'react';
import GameContext from './GameContext';
import shuffle from 'lodash.shuffle';

// Utility function for getting next game state
const getNextGameState = (prevState) => {
  if (prevState.remainingCards.length === 0) {
    return prevState;
  }

  const topCardInPile = prevState.remainingCards[0];
  const remainingCards = prevState.remainingCards.slice(1);
  const topCardInUserDeck = remainingCards[0] || null;

  return {
    topCardInPile,
    remainingCards,
    topCardInUserDeck,
    cardsRemaining: prevState.cardsRemaining - 1,
    score: prevState.score + 1,
  };
};

export const GameProvider = ({ children }) => {
  const [deck, setDeck] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameSettings, setGameSettings] = useState(null);

  const initializeGame = useCallback((newDeck, settings) => {
    if (newDeck) {
      const shuffledDeck = shuffle(newDeck);
      setDeck(newDeck);
      setGameSettings(settings);

      setGameState({
        topCardInPile: shuffledDeck[0],
        remainingCards: shuffledDeck.slice(1),
        topCardInUserDeck: shuffledDeck[1] || null,
        cardsRemaining: shuffledDeck.length - 1,
        score: 0,
      });
    }
  }, []);

  const handleMatch = useCallback((symbol) => {
    setGameState((prevState) => {
      if (!prevState.topCardInPile.includes(symbol)) {
        return prevState;
      }
      return getNextGameState(prevState);
    });
  }, []);

  const moveToNextCard = useCallback(() => {
    setGameState((prevState) => getNextGameState(prevState));
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      deck,
      gameState,
      gameSettings,
      initializeGame,
      handleMatch,
      moveToNextCard,
    }),
    [
      deck,
      gameState,
      gameSettings,
      initializeGame,
      handleMatch,
      moveToNextCard,
    ],
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
