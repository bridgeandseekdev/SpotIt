import { useEffect } from 'react';
import { useGameContext } from '../context';

export const useGameState = (deck) => {
  const { gameState, initializeGame, handleMatch } = useGameContext();

  useEffect(() => {
    initializeGame(deck);
  }, [deck, initializeGame]);

  return gameState ? { ...gameState, handleMatch } : null;
};
