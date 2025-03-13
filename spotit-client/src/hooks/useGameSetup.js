import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDeckBySettings } from '../utils/deckManager';
import { useGameState } from './useGameState';

export const useGameSetup = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deck, setDeck] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const gameSettings = location.state || {
    theme: 'classic',
    difficulty: 'easy',
    symbolsPerCard: '8',
  };

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    const loadDeck = async () => {
      try {
        const deckData = await getDeckBySettings(
          gameSettings.theme,
          gameSettings.symbolsPerCard,
        );
        setDeck(deckData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load game deck');
        alert('Failed to load game deck', err);
        setIsLoading(false);
      }
    };

    loadDeck();
  }, [
    location.state,
    navigate,
    gameSettings.theme,
    gameSettings.symbolsPerCard,
  ]);

  const gameState = useGameState(deck);

  return {
    isLoading,
    error,
    gameState,
    gameSettings,
    handleMatch: gameState?.handleMatch,
  };
};
