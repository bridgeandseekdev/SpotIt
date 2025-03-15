import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '../../context';
import { useTimer } from '../../hooks/useTimer';

const GameStatus = () => {
  const { gameState, moveToNextCard } = useGameContext();
  const { startTimer, timeRemaining, resetTimer } = useTimer();
  const { mode } = useParams();

  useEffect(() => {
    if (mode !== 'timed') return;
    startTimer();
  }, []);

  useEffect(() => {
    if (mode !== 'timed') return;
    if (timeRemaining === 0) {
      if (gameState.cardsRemaining < 1) {
        resetTimer();
        return;
      }
      moveToNextCard();
      resetTimer();
      startTimer();
    }
  }, [timeRemaining]);

  return (
    <div className="flex-none text-center pb-4">
      <h2 className="text-lg font-semibold">
        Cards Remaining: {gameState.cardsRemaining}
      </h2>
      <h2 className="text-lg font-semibold">Time Remaining: {timeRemaining}</h2>
    </div>
  );
};

export default GameStatus;
