import { useState, useEffect, useRef, useCallback } from 'react';
import BotGameContext from './BotGameContext';
import shuffle from 'lodash.shuffle';

function splitDeckInHalf(deck) {
  const middleIndex = Math.floor(deck.length / 2);

  const firstHalf = deck.slice(0, middleIndex);
  const secondHalf = deck.slice(middleIndex);

  return [firstHalf, secondHalf];
}

const getNextGameState = (prevState, initiatedBy) => {
  if (initiatedBy === 'bot') {
    if (prevState.botDeckState.deck.length === 0) {
      return prevState;
    }

    const topCardInPile = prevState.botDeckState.deck[0];
    const deck = prevState.botDeckState.deck.slice(1);
    const score = prevState.botDeckState.score++;

    return {
      ...prevState,
      topCardInPile,
      botDeckState: {
        deck,
        topCard: deck[0] || null,
        cardsRemaining: deck.length - 1,
        score,
      },
    };
  }

  if (prevState.botDeckState.deck.length === 0) {
    return prevState;
  }

  const topCardInPile = prevState.userDeckState.deck[0];
  const deck = prevState.userDeckState.deck.slice(1);
  const score = prevState.userDeckState.score++;

  return {
    ...prevState,
    topCardInPile,
    userDeckState: {
      deck,
      topCard: deck[0] || null,
      cardsRemaining: deck.length - 1,
      score,
    },
  };
};

export const BotGameProvider = ({ children }) => {
  const [originalDeck, setOriginalDeck] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameSettings, setGameSettings] = useState(null);
  const isProcessingAction = useRef(false);
  const timerRef = useRef(null);

  // Clear any existing timer
  const clearBotTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const initializeGame = useCallback(
    (newDeck, settings) => {
      if (!originalDeck) setOriginalDeck(newDeck);

      if (newDeck) {
        const shuffledDeck = shuffle(newDeck);
        const topCardInPile = shuffledDeck[0];
        const [userDeck, botDeck] = splitDeckInHalf(shuffledDeck.slice(1));
        const initialState = {
          topCardInPile,
          userDeckState: {
            deck: userDeck,
            topCard: userDeck[0] || null,
            cardsRemaining: userDeck.length - 1,
            score: 0,
          },
          botDeckState: {
            deck: botDeck,
            topCard: botDeck[0] || null,
            cardsRemaining: botDeck.length - 1,
            score: 0,
          },
        };
        setGameState(initialState);
        setGameSettings(settings);
      }
    },
    [originalDeck],
  );

  const handleMatch = useCallback(
    (symbol, initiatedBy) => {
      if (!gameState || !gameSettings || isProcessingAction.current) return;

      if (initiatedBy === 'bot') {
        isProcessingAction.current = true;
        setGameState((prevState) => getNextGameState(prevState, initiatedBy));
        isProcessingAction.current = false;
        return;
      }

      //If user clicked on symbol first
      if (gameState.topCardInPile.includes(symbol)) {
        isProcessingAction.current = true;
        setGameState((prevState) => getNextGameState(prevState));
        isProcessingAction.current = false;
      }
    },
    [gameSettings, gameState],
  );

  useEffect(() => {
    // Only set up timer if all necessary state exists
    if (
      !gameState ||
      !gameSettings ||
      gameState.userDeckState.cardsRemaining < 1 ||
      gameState.botDeckState.cardsRemaining < 1
    ) {
      return;
    }

    clearBotTimer();

    //bot will trigger a match randomly between 1 and 3seconds
    timerRef.current = setTimeout(() => {
      if (!isProcessingAction.current) {
        handleMatch(null, 'bot');
      }
    }, Math.floor(Math.random() * 10001) + 1000);

    return clearBotTimer;
  }, [clearBotTimer, gameSettings, gameState, handleMatch]);

  // Separate effect for starting/stopping timer based on game state
  useEffect(() => {
    if (
      !gameState ||
      gameState.userDeckState.cardsRemaining < 1 ||
      gameState.botDeckState.cardsRemaining < 1
    ) {
      clearBotTimer();
    }
  }, [gameState, clearBotTimer]);

  const contextValue = {
    gameState,
    gameSettings,
    handleMatch,
    initializeGame,
  };
  return (
    <BotGameContext.Provider value={contextValue}>
      {children}
    </BotGameContext.Provider>
  );
};
