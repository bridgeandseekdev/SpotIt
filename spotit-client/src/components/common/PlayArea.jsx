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
    const containerRect =
      pileCardRef.current.parentElement.getBoundingClientRect();

    return {
      start: {
        top: currentRect.top - containerRect.top,
        left: currentRect.left - containerRect.left,
      },
      end: {
        top: pileRect.top - containerRect.top,
        left: pileRect.left - containerRect.left,
      },
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
          className="absolute h-[45%] aspect-square"
          initial={({ start }) => ({
            top: start.top,
            left: start.left,
            rotate: 0,
            scale: 1,
            opacity: 1,
          })}
          animate={({ end }) => ({
            top: end.top,
            left: end.left,
            rotate: -3,
            scale: 0.8,
            opacity: 1,
          })}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
          custom={getCardPositions()}
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
