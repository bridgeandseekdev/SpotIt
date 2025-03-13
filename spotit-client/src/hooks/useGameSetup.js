import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGameContext } from '../context';
import { getDeckBySettings } from '../utils/deckManager';

export const useGameSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { gameState, initializeGame, handleMatch } = useGameContext();

  const gameSettings = useMemo(
    () =>
      location.state || {
        theme: 'classic',
        difficulty: 'easy',
        symbolsPerCard: '3',
      },
    [location.state],
  );

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    const loadGame = async () => {
      try {
        const deck = await getDeckBySettings(
          gameSettings.theme,
          gameSettings.symbolsPerCard,
        );
        initializeGame(deck, gameSettings);
        setIsLoading(false);
      } catch {
        setError('Failed to load game');
        setIsLoading(false);
      }
    };

    loadGame();
  }, [location.state, navigate, gameSettings, initializeGame]);

  return {
    isLoading,
    error,
    gameState,
    gameSettings,
    handleMatch,
  };
};
