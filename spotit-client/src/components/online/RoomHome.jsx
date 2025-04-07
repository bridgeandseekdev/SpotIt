import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../context';
import { useGameContext } from '../../context';
import OnlineDifficultySelect from './OnlineDifficultySelect';

function RoomHome() {
  const navigate = useNavigate();
  const {
    onlineState: { roomId, hostId, myPlayerId, players },
    startGame,
  } = useSocketContext();

  const {
    difficulty,
    online: { gameId },
  } = useGameContext();

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
      <h1 className="font-bold text-xl">Welcome! to lobby</h1>
      {players.map(({ username, id }) => (
        <p key={id}>
          {myPlayerId === id ? 'You, ' : 'Your friend, '} {username} Joined{' '}
          {hostId === id ? '[HOST]' : null}
        </p>
      ))}
      {players.length === 1 && (
        <div>
          <p>Waiting for another player..</p>
          <p>Share this code with your friend to join: {roomId}</p>
        </div>
      )}

      {players.length === 2 &&
        (hostId === myPlayerId ? (
          <div>
            <OnlineDifficultySelect />
            <button
              className={`mt-4 ${
                !difficulty ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </div>
        ) : (
          'Waiting for host to start the game'
        ))}
    </div>
  );
}

export default RoomHome;
