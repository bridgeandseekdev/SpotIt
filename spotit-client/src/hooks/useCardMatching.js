import { useCallback } from 'react';
import { useGameContext } from '../context';
import { findMatchingSymbol } from '../utils/gameUtils';

export function useCardMatching() {
  const {
    offline: { player, pileCard },
    handleMatchFound,
  } = useGameContext();
  const checkMatch = useCallback(
    (clickedSymbol) => {
      if (!pileCard || !player.currentCard) return false;

      const matchingSymbol = findMatchingSymbol(pileCard, player.currentCard);
      if (matchingSymbol === clickedSymbol) {
        handleMatchFound(clickedSymbol);
        return true;
      }
      return false;
    },
    [pileCard, player.currentCard, handleMatchFound],
  );
  return { checkMatch };
}
