function ScoreBoard({ playerScore, botScore = null, opponentName }) {
  return (
    <div className="flex justify-center space-x-8 mt-4 mb-4">
      <div className="text-center">
        <h3 className="font-semibold">Your Score</h3>
        <div className="text-2xl font-bold">{playerScore}</div>
      </div>

      {botScore !== null && (
        <div className="text-center">
          <h3 className="font-semibold">{`${
            opponentName ? opponentName : 'Bot'
          } Score`}</h3>
          <div className="text-2xl font-bold">{botScore}</div>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;
