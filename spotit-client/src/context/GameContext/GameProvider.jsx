import { useState, useCallback, useEffect } from 'react';
import GameContext from './GameContext';
import shuffle from 'lodash.shuffle';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

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
  const [timeLeft, setTimeLeft] = useState(
    DIFFICULTY_CONFIGS[gameSettings?.difficulty]?.timerSeconds || 8,
  );

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

  const handleMatch = useCallback(
    (symbol) => {
      if (gameState.topCardInPile.includes(symbol)) {
        setGameState((prevState) => getNextGameState(prevState));
        setTimeLeft(DIFFICULTY_CONFIGS[gameSettings.difficulty].timerSeconds);
      }
    },
    [gameState?.topCardInPile],
  );

  useEffect(() => {
    if (!gameState) return;
    let timer;

    if (gameSettings.mode === 'timed' && gameState.cardsRemaining >= 1) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime < 1) {
            clearInterval(timer);
            moveToNextCard();
            return DIFFICULTY_CONFIGS[gameSettings.difficulty].timerSeconds;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameState?.cardsRemaining]);

  const moveToNextCard = useCallback(() => {
    setGameState((prevState) => getNextGameState(prevState));
  }, []);

  const contextValue = {
    deck,
    gameState,
    gameSettings,
    initializeGame,
    handleMatch,
    moveToNextCard,
    timeLeft,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
