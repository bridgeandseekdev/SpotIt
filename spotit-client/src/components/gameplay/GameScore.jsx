const GameScore = ({ score, total }) => {
  return (
    <h2 className="mt-2 text-lg font-semibold">
      Score: {score}/{total}
    </h2>
  );
};

export default GameScore;
