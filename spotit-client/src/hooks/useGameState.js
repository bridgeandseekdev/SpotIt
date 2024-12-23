import { useState, useCallback } from 'react';
import shuffle from 'lodash.shuffle';

export const useGameState = (initialDeck) => {
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
