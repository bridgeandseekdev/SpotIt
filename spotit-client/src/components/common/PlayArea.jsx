import { motion } from 'framer-motion';
import { useNewGameContext } from '../../context';
import { useCardAnimation } from '../../hooks/useCardAnimation';
import Card from './Card';
import { useRef, useState, useEffect } from 'react';

function PlayArea({ handleCheckMatch: handleOnlineCheckMatch }) {
  const pileCardRef = useRef(null);
  const currentCardRef = useRef(null);

  const {
    handleMatchAction,
    gameState: {
      pileCard,
      players: { self },
      socketConnection: { gameId },
    },
  } = useNewGameContext();

  const [visualPileCard, setVisualPileCard] = useState(pileCard);

  const { animatingCard, isAnimating, onAnimationComplete } = useCardAnimation(
    pileCard,
    self.currentCard,
  );

  //If pile card changes during bot mode and online mode
  useEffect(() => {
    if (!isAnimating) {
      setVisualPileCard(pileCard);
    }
  }, [pileCard, isAnimating]);

  const handleSymbolClick = (symbol) => {
    if (handleOnlineCheckMatch) {
      handleOnlineCheckMatch(gameId, symbol);
    } else {
      handleMatchAction(symbol);
    }
  };

  const getCardPositions = () => {
    if (!pileCardRef.current || !currentCardRef.current) return null;

    const pileRect = pileCardRef.current.getBoundingClientRect();
    const currentRect = currentCardRef.current.getBoundingClientRect();

    const dx =
      pileRect.left +
      pileRect.width / 2 -
      (currentRect.left + currentRect.width / 2);
    const dy =
      pileRect.top +
      pileRect.height / 2 -
      (currentRect.top + currentRect.height / 2);

    return {
      transform: `translate(${dx}px, ${dy}px)`,
    };
  };

  const handleAnimationEnd = () => {
    setVisualPileCard(pileCard);
    onAnimationComplete();
  };

  return (
    <div className="h-full w-full flex flex-col justify-center p-4 mt-10 gap-4 relative">
      <div className="h-[45%] w-full flex justify-center p-[2%] md:p-2">
        <motion.div
          ref={pileCardRef}
          className="h-full max-w-full rounded-full aspect-square"
          style={{ zIndex: 10 }}
        >
          <Card card={visualPileCard} type="pile" onSymbolClick={() => {}} />
        </motion.div>
      </div>
      {isAnimating && animatingCard && (
        <motion.div
          className="absolute aspect-square"
          style={{
            width: currentCardRef.current?.offsetWidth,
            left: currentCardRef.current?.offsetLeft,
            top: currentCardRef.current?.offsetTop,
            zIndex: 20,
          }}
          initial={{
            transform: 'translate(0, 0)',
            rotate: 0,
            scale: 0.8,
            opacity: 0.5,
          }}
          animate={{
            transform: getCardPositions()?.transform || 'translate(0, 0)',
            rotate: -3,
            scale: 0.5,
            opacity: 1,
          }}
          transition={{
            duration: 0.25,
            ease: [0, 0, 1, 1], // Custom easing for smoother animation
          }}
          onAnimationComplete={handleAnimationEnd}
        >
          <Card card={animatingCard} type="player" onSymbolClick={() => {}} />
        </motion.div>
      )}
      <div className="h-[55%] w-full flex justify-center p-[3%] md:p-2">
        <motion.div
          ref={currentCardRef}
          className="h-full max-w-full rounded-full aspect-square"
          style={{ zIndex: 5 }}
        >
          <Card
            card={self.currentCard}
            type="player"
            onSymbolClick={handleSymbolClick}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default PlayArea;
