import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewGameContext, useSocketContext } from '../../context';
import { useGameContext } from '../../context';
import OnlineDifficultySelect from './OnlineDifficultySelect';

function RoomHome() {
  const navigate = useNavigate();
  const { startGame } = useSocketContext();

  const {
    difficulty,
    online: { gameId },
  } = useGameContext();

  const { gameState } = useNewGameContext();
  const {
    socketConnection: { id, hostId, roomId, players },
  } = gameState;

  useEffect(() => {
    if (gameId) {
      navigate('/online/play');
    }
  }, [gameId, navigate]);

  const handleStartGame = () => {
    if (!difficulty) {
      alert('Please select difficulty first!');
      return;
    }
    startGame();
  };

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <div className="bg-white dark:bg-bg-dark-primary p-8 rounded-xl shadow-lg w-96">
        <h1 className="font-bold text-2xl text-text-accent2 dark:text-text-dark-primary text-center mb-6">
          Game Lobby
        </h1>

        <div className="space-y-4 mb-6">
          {players.map(({ username, id }) => (
            <div
              key={id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:text-text-primary rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="font-medium">
                  {id === id ? `You - ${username}` : username}
                </span>
              </div>
              {hostId === id && (
                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>

        {players.length === 1 && (
          <div className="text-center space-y-3 bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600">Waiting for another player...</p>
            <div className="border p-3 rounded bg-white">
              <p className="text-sm text-gray-500">
                Share this code with your friend
              </p>
              <p className="font-mono font-bold text-lg text-blue-600">
                {roomId}
              </p>
            </div>
          </div>
        )}

        {players.length === 2 &&
          (hostId === id ? (
            <div className="space-y-10">
              <OnlineDifficultySelect />
              <button
                className={`w-full py-2 rounded-lg transition-colors ${
                  difficulty
                    ? 'bg-gradient-to-br from-orange-400 to-purple-500 text-white'
                    : 'bg-gray-200 cursor-not-allowed text-gray-500'
                }`}
                onClick={handleStartGame}
              >
                Start Game
              </button>
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-50 rounded-lg text-yellow-700">
              Waiting for host to start the game...
            </div>
          ))}
      </div>
    </div>
  );
}

export default RoomHome;
