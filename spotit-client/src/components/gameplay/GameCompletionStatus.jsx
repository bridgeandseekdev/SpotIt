const GameCompletionStatus = ({ cardsRemaining }) => {
  return (
    <h2 className="text-lg font-semibold">
      {cardsRemaining
        ? `Cards Remaining: ${cardsRemaining}`
        : 'Game Completed!'}
    </h2>
  );
};

export default GameCompletionStatus;
