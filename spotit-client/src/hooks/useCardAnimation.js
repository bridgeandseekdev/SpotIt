import { useRef, useState, useEffect, useCallback } from 'react';

export function useCardAnimation(pileCard, currentCard) {
  const [animatingCard, setAnimatingCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCurrentCardRef = useRef(currentCard);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    setAnimatingCard(null);
  }, []);

  useEffect(() => {
    if (prevCurrentCardRef.current !== currentCard) {
      setAnimatingCard(prevCurrentCardRef.current);
      setIsAnimating(true);
    }
    prevCurrentCardRef.current = currentCard;
  }, [currentCard]);

  return {
    animatingCard,
    isAnimating,
    onAnimationComplete: handleAnimationComplete,
  };
}
