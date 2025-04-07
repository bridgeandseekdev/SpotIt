import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../context';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';
import { Trophy, Medal, Equal } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className=" dark:bg-bg-dark-secondary rounded-xl p-8 shadow-lg max-w-md w-full border border-neutral-200 dark:border-neutral-700">
        <h1 className="text-4xl font-bold text-center mb-8 animate-bounce">
          Game Over!
        </h1>

        {(gameMode === 'bot' || gameMode === 'online') && (
          <div className="text-center mb-8">
            <div className="text-2xl font-semibold mb-6">
              {player.score > opponent.score ? (
                <div className="flex items-center justify-center gap-2 text-yellow-500">
                  <Trophy className="text-3xl" size={24} />
                  <span>You Win!</span>
                </div>
              ) : player.score < opponent.score ? (
                <div className="flex items-center justify-center gap-2 text-red-400">
                  <Medal className="text-3xl" size={24} />
                  <span>
                    {opponent.username
                      ? `${opponent.username} wins!`
                      : 'Bot Wins!'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-blue-400">
                  <Equal className="text-3xl" size={24} />
                  <span>{`It's a Tie!`}</span>
                </div>
              )}
            </div>

            {gameMode === 'online' && (
              <div className="space-y-2 bg-white/5 rounded-lg p-4">
                <h3 className="text-xl mb-3">Final Score:</h3>
                <p className="text-lg">
                  {player.username}:{' '}
                  <span className="font-bold">{player.score}</span>
                </p>
                <p className="text-lg">
                  {opponent.username}:{' '}
                  <span className="font-bold">{opponent.score}</span>
                </p>
              </div>
            )}

            {gameMode === 'bot' && (
              <div className="space-y-2 bg-white/5 rounded-lg p-4">
                <h3 className="text-xl mb-3">Final Score:</h3>
                <p className="text-lg">
                  You: <span className="font-bold">{player.score}</span>
                </p>
                <p className="text-lg">
                  Bot: <span className="font-bold">{opponent.score}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {gameMode === 'timed' && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Final Score:{' '}
              <span className="text-yellow-700 font-bold">{player.score}</span>
              <span className="text-sm"> / {totalScore}</span>
            </h2>
          </div>
        )}

        {gameMode === 'online' ? (
          <div className="flex justify-center">
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-text-dark-primary"
            >
              Back to Lobby
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePlayAgain}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-text-dark-primary"
            >
              Play Again
            </button>
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-text-dark-primary"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameResult;
