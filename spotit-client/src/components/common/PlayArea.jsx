import { motion } from 'framer-motion';
import { useNewGameContext } from '../../context';
import { useCardAnimation } from '../../hooks/useCardAnimation';
import Card from './Card';
import { useRef } from 'react';

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

  const { animatingCard, isAnimating } = useCardAnimation(
    pileCard,
    self.currentCard,
  );

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

    // Calculate scale ratio between pile and current card
    const scaleRatio = pileRect.width / currentRect.width;

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
      scaleRatio,
    };
  };

  return (
    <div className="h-full w-full flex flex-col justify-center p-4 mt-10 gap-4 relative">
      <div className="h-[45%] w-full flex justify-center p-[2%] md:p-2">
        <motion.div
          ref={pileCardRef}
          className="h-full max-w-full rounded-full aspect-square"
        >
          <Card card={pileCard} type="pile" onSymbolClick={() => {}} />
        </motion.div>
      </div>
      {isAnimating && animatingCard && (
        <motion.div
          className="absolute aspect-square"
          style={{
            width: currentCardRef.current?.offsetWidth,
            left: currentCardRef.current?.offsetLeft,
            top: currentCardRef.current?.offsetTop,
          }}
          initial={{
            transform: 'translate(0, 0)',
            rotate: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            transform: getCardPositions()?.transform || 'translate(0, 0)',
            rotate: -3,
            scale: getCardPositions()?.scaleRatio || 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1], // Custom easing for smoother animation
          }}
        >
          <Card card={animatingCard} type="player" onSymbolClick={() => {}} />
        </motion.div>
      )}
      <div className="h-[55%] w-full flex justify-center p-[3%] md:p-2">
        <motion.div
          ref={currentCardRef}
          className="h-full max-w-full rounded-full aspect-square"
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
