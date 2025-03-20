import { useState, useEffect, useRef, useCallback } from 'react';
import GameContext from './GameContext';
import shuffle from 'lodash.shuffle';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

// Utility function for getting next game state
const getNextGameState = (prevState, isMatch) => {
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
    score: isMatch ? prevState.score + 1 : prevState.score,
  };
};

export const GameProvider = ({ children }) => {
  const [originalDeck, setOriginalDeck] = useState(null);
  const [deck, setDeck] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [gameSettings, setGameSettings] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const isProcessingAction = useRef(false);

  // Clear any existing timer
  const clearGameTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Initialize game with new deck and settings
  const initializeGame = useCallback(
    (newDeck, settings) => {
      // Clean up any existing timer
      clearGameTimer();

      if (!originalDeck) setOriginalDeck(newDeck); // If the deck is already loaded and player is trying to play again after one round

      if (newDeck) {
        const shuffledDeck = shuffle(newDeck);
        setDeck(newDeck);
        setGameSettings(settings);

        const initialState = {
          topCardInPile: shuffledDeck[0],
          remainingCards: shuffledDeck.slice(1),
          topCardInUserDeck: shuffledDeck[1] || null,
          cardsRemaining: shuffledDeck.length - 1,
          score: 0,
        };

        setGameState(initialState);

        // Set initial timer value
        if (settings) {
          setTimeLeft(DIFFICULTY_CONFIGS[settings.difficulty].timerSeconds);
        }
      }
    },
    [clearGameTimer, originalDeck],
  );

  // Handle match logic - use callback to ensure stable reference for child components
  const handleMatch = useCallback(
    (symbol) => {
      if (!gameState || !gameSettings || isProcessingAction.current) return;

      // Check if the symbol matches
      if (gameState.topCardInPile.includes(symbol)) {
        isProcessingAction.current = true;

        // Update game state with next card
        setGameState((prevState) => getNextGameState(prevState, true));
        setTimeLeft(DIFFICULTY_CONFIGS[gameSettings.difficulty].timerSeconds);
        isProcessingAction.current = false;
      }
    },
    [gameState, gameSettings],
  );

  // Move to next card - use callback to ensure stable reference
  const moveToNextCard = useCallback(() => {
    if (!gameState || !gameSettings || isProcessingAction.current) return;

    isProcessingAction.current = true;

    // Update game state with next card
    setGameState((prevState) => getNextGameState(prevState));
    setTimeLeft(DIFFICULTY_CONFIGS[gameSettings.difficulty].timerSeconds);
    isProcessingAction.current = false;
  }, [gameState, gameSettings]);

  // Setup and manage the timer
  useEffect(() => {
    // Only set up timer if all necessary state exists
    if (!gameState || !gameSettings || gameState.cardsRemaining < 1) {
      return;
    }

    // Clear any previous timer
    clearGameTimer();

    // Only create timer if we're in timed mode
    if (gameSettings.mode === 'timed') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          // If timer reaches zero, move to next card
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;

            // Ensure we're not already processing an action
            if (!isProcessingAction.current) {
              moveToNextCard();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Cleanup timer when component unmounts or dependencies change
    return clearGameTimer;
  }, [gameSettings, gameState, clearGameTimer, moveToNextCard]);

  // Separate effect for starting/stopping timer based on game state
  useEffect(() => {
    if (!gameState || gameState.cardsRemaining < 1) {
      clearGameTimer();
    }
  }, [gameState, clearGameTimer]);

  const contextValue = {
    deck,
    gameState,
    gameSettings,
    initializeGame,
    handleMatch,
    moveToNextCard,
    timeLeft,
    originalDeck,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
