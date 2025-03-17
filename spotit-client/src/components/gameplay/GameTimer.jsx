import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

const GameTimer = ({ timeLeft, difficulty }) => {
  let shakeThreshold;
  switch (difficulty) {
    case 'easy':
      shakeThreshold = 3;
      break;
    case 'medium':
      shakeThreshold = 4;
      break;
    case 'hard':
      shakeThreshold = 5;
      break;
    default:
      shakeThreshold = 3;
  }

  const shouldShake = timeLeft <= shakeThreshold;
  const shakeStyle = {
    animation: shouldShake ? 'shake 0.5s infinite' : 'none',
  };

  const keyframes = `
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
      100% { transform: translateX(0); }
    }
  `;

  return (
    <div
      className="flex flex-col justify-center w-[30%] mx-auto"
      style={shakeStyle}
    >
      <style>{keyframes}</style>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className={`${
            shouldShake ? 'bg-red-600' : 'bg-green-600'
          } h-2.5 rounded-full transition-all duration-1000 ease-linear`}
          style={{
            width: `${
              (timeLeft / DIFFICULTY_CONFIGS[difficulty].timerSeconds) * 100
            }%`,
          }}
        ></div>
      </div>
      <h2 className="text-lg font-semibold">Time Remaining: {timeLeft}s</h2>
    </div>
  );
};

export default GameTimer;
