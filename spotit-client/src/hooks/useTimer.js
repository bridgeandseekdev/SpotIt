import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime = 10000) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeRemaining(initialTime);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  //clean up on unmount
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  return { timeRemaining, resetTimer, startTimer };
};
