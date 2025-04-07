import { useGameContext } from '../../context';

function OnlineDifficultySelect() {
  const { setDifficulty, difficulty } = useGameContext();

  const handleDifficultySelection = (difficulty) => {
    setDifficulty(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1>Choose Difficulty</h1>
      <div className="flex items-center justify-center gap-4">
        <button
          className={`${difficulty === 'easy' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('easy')}
        >
          Easy
        </button>
        <button
          className={`${difficulty === 'medium' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('medium')}
        >
          Medium
        </button>
        <button
          className={`${difficulty === 'hard' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('hard')}
        >
          Hard
        </button>
      </div>
    </div>
  );
}

export default OnlineDifficultySelect;
