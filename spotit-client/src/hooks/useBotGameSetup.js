import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBotGameContext } from '../context';
import { getDeckBySettings } from '../utils/deckManager';

export const useBotGameSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { gameState, initializeGame, handleMatch } = useBotGameContext();

  const gameSettings = useMemo(
    () =>
      location.state || {
        theme: 'classic',
        difficulty: 'easy',
        symbolsPerCard: '3',
        mode: 'bot',
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
      } catch (err) {
        console.error('Error from bot setup', err);
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
