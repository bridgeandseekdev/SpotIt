import { useRef, useState, useEffect } from 'react';

export function useCardAnimation(pileCard, currentCard) {
  const [animatingCard, setAnimatingCard] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCurrentCardRef = useRef(currentCard);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset animation state if cards are different
    if (prevCurrentCardRef.current !== currentCard) {
      setAnimatingCard(prevCurrentCardRef.current);
      setIsAnimating(true);

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setAnimatingCard(null);
      }, 200); // match duration with animation
    }

    prevCurrentCardRef.current = currentCard;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentCard]); // Remove isAnimating dependency

  return { animatingCard, isAnimating };
}
