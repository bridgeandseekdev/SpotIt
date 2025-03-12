import { useState, useCallback } from 'react';
import GameContext from './GameContext';
import shuffle from 'lodash.shuffle';
import PropTypes from 'prop-types';

export const GameProvider = ({ children }) => {
  const [deck, setDeck] = useState(null);
  const [gameState, setGameState] = useState(null);

  const initializeGame = useCallback((newDeck) => {
    if (newDeck) {
      const shuffledDeck = shuffle(newDeck);
      setDeck(newDeck);
      setGameState({
        topCard: shuffledDeck[0],
        remainingCards: shuffledDeck.slice(1),
        cardsRemaining: shuffledDeck.length - 1,
      });
    }
  }, []);

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

  return (
    <GameContext.Provider
      value={{
        deck,
        gameState,
        initializeGame,
        handleMatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
