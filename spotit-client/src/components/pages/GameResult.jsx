import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../context';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

function GameResult() {
  const navigate = useNavigate();
  const {
    gameMode,
    offline: { player: offlinePlayer, opponent: offlineOpponent },
    online: { player: onlinePlayer, opponent: onlineOpponent },
    initializeGame,
    resetGame,
    difficulty,
    resetOnlineGame,
  } = useGameContext();
  let totalScore;

  if (gameMode === 'timed') {
    const n = DIFFICULTY_CONFIGS[difficulty].symbolsPerCard - 1;
    totalScore = Math.pow(n, 2) + n;
  }

  const handlePlayAgain = () => {
    initializeGame();
  };

  const handleBackToMenu = () => {
    if (gameMode === 'online') {
      resetOnlineGame();
      navigate('/online');
    } else {
      resetGame();
      navigate('/');
    }
  };

  const player = gameMode === 'online' ? onlinePlayer : offlinePlayer;
  const opponent = gameMode === 'online' ? onlineOpponent : offlineOpponent;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <h1 className="text-2xl font-bold">Game Over!</h1>
      {gameMode === 'bot' || gameMode === 'online' ? (
        <div>
          <h2>
            {player.score > opponent.score
              ? 'You Win!'
              : player.score < opponent.score
              ? opponent.username
                ? `${opponent.username} wins!`
                : 'Bot Wins!'
              : "It's a Tie!"}
          </h2>

          {gameMode === 'online' && (
            <div>
              Final Score:
              <p>
                {player.username}: {player.score}
              </p>
              <p>
                {opponent.username}: {opponent.score}
              </p>
            </div>
          )}

          {gameMode === 'bot' && (
            <div>
              Final Score:
              <p>You: {player.score}</p>
              <p>Bot: {opponent.score}</p>
            </div>
          )}
        </div>
      ) : null}

      {gameMode === 'timed' && (
        <h2>
          Final Score: {player.score} /{totalScore}
        </h2>
      )}

      {gameMode === 'online' ? (
        <div>
          <button onClick={handleBackToMenu}>Back to Lobby</button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button onClick={handlePlayAgain}>Play Again</button>
          <button onClick={handleBackToMenu}>Back to Menu</button>
        </div>
      )}
    </div>
  );
}

export default GameResult;
