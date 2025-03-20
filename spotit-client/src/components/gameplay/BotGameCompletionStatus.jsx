const BotGameCompletionStatus = ({ botCardsRemaining, userCardsRemaining }) => {
  return botCardsRemaining && userCardsRemaining ? (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center">
        <p className="text-sm text-gray-600">Bot</p>
        <p className="text-2xl font-bold">{botCardsRemaining}</p>
      </div>
      <div className="flex flex-col items-center mx-4">
        <p className="text-sm text-gray-600">You</p>
        <p className="text-2xl font-bold">{userCardsRemaining}</p>
      </div>
    </div>
  ) : (
    <p>Game Completed!</p>
  );
};

export default BotGameCompletionStatus;
