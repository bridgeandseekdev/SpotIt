import { useState, useCallback, useEffect } from 'react';
import shuffle from 'lodash.shuffle';

export const useGameState = (deck) => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    if (deck) {
      const shuffledDeck = shuffle(deck);
      setGameState({
        topCard: shuffledDeck[0],
        remainingCards: shuffledDeck.slice(1),
        cardsRemaining: shuffledDeck.length - 1,
      });
    }
  }, [deck]);

  const handleMatch = useCallback(
    (symbol) => {
      if (!gameState) return;

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
    },
    [gameState],
  );

  return gameState ? { ...gameState, handleMatch } : null;
};
