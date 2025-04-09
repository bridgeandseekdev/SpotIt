import { useEffect, useRef } from 'react';
import { useNewGameContext } from '../context';

export function useTimerEffect() {
  const {
    handleTimerExpiredAction,
    updateTimerAction,
    gameState: { gameStatus, timer },
  } = useNewGameContext();
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer.enabled && timer.remaining > 0 && gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        updateTimerAction(timer.remaining - 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    } else if (
      timer.enabled &&
      timer.remaining <= 0 &&
      gameStatus === 'playing'
    ) {
      clearInterval(timerRef.current);
      handleTimerExpiredAction();
    }
  }, [timer.enabled, timer.remaining, gameStatus]);
}
