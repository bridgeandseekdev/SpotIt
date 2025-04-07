import { useEffect, useRef } from 'react';
import { useGameContext } from '../context';

export function useTimerEffect() {
  const {
    offline: { timer, gameStatus },
    updateTimer,
    timerExpired,
  } = useGameContext();
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer.enabled && timer.remaining > 0 && gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        updateTimer(timer.remaining - 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    } else if (
      timer.enabled &&
      timer.remaining <= 0 &&
      gameStatus === 'playing'
    ) {
      clearInterval(timerRef.current);
      timerExpired();
    }
  }, [timer.enabled, timer.remaining, gameStatus]);
}
