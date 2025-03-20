const GameScore = ({ userScore, botScore, isWinner }) => {
  return (
    <div>
      <p className="text-sm text-gray-600">Score</p>
      <h2 className="mt-2 text-lg font-semibold">
        User: {userScore} | Bot: {botScore}
      </h2>

      {isWinner && (
        <p className="text-xl font-semibold">
          {userScore > botScore ? 'You Win!' : 'Winner: Bot'}
        </p>
      )}
    </div>
  );
};

export default GameScore;
