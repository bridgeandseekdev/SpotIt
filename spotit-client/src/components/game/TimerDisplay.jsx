import { Timer } from 'lucide-react';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

function TimerDisplay({ timer, difficulty }) {
  const percentage =
    (timer.remaining / DIFFICULTY_CONFIGS[difficulty].timerSeconds) * 100;
  const isLow = timer.remaining <= 3;

  return (
    <div className="flex items-center gap-4 relative">
      <div
        className={`${
          isLow ? 'bg-red-400' : 'bg-green-400'
        } h-1 transition-all duration-1000 ease-linear fixed bottom-0 left-0 right-0 mx-auto w-[70%]`}
        style={{ width: `${percentage}%` }}
      />
      <div className="flex items-center gap-2">
        <Timer className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
          {timer.remaining}s
        </span>
      </div>
    </div>
  );
}

export default TimerDisplay;
