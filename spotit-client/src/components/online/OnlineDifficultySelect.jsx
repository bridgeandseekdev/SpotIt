import { useGameContext } from '../../context';

function OnlineDifficultySelect() {
  const { setDifficulty, difficulty } = useGameContext();

  const handleDifficultySelection = (difficulty) => {
    setDifficulty(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold text-gray-700">Select Difficulty</h1>
      <div className="flex items-center justify-center gap-3">
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            difficulty === 'easy'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleDifficultySelection('easy')}
        >
          Easy
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            difficulty === 'medium'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleDifficultySelection('medium')}
        >
          Medium
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            difficulty === 'hard'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleDifficultySelection('hard')}
        >
          Hard
        </button>
      </div>
    </div>
  );
}

export default OnlineDifficultySelect;
