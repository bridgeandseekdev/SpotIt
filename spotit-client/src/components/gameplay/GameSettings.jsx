import { useNavigate, useParams } from 'react-router-dom';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

const GameSettings = () => {
  const navigate = useNavigate();
  const { mode } = useParams();

  const handleDifficultySelect = (difficulty) => {
    const settings = {
      theme: 'classic',
      difficulty,
      symbolsPerCard: DIFFICULTY_CONFIGS[difficulty].symbolsPerCard,
      mode,
    };
    navigate(`/game/${settings.mode}`, { state: settings });
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 onClick={() => navigate(-1)}>Back</h1>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(DIFFICULTY_CONFIGS).map(([difficulty]) => (
          <button
            key={difficulty}
            onClick={() => handleDifficultySelect(difficulty)}
            className="p-4 rounded border shadow hover:shadow-md transition-shadow"
          >
            <h3 className="capitalize">{difficulty}</h3>
            <p className="text-sm">
              {difficulty === 'easy' && '3 symbols, fixed size'}
              {difficulty === 'medium' && '5 symbols, varied sizes'}
              {difficulty === 'hard' && '8 symbols, random sizes and rotations'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameSettings;
