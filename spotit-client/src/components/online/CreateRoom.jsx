import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../context';
import { useSocketConnection } from '../../hooks/useSocketConnection';

function CreateRoom() {
  const {
    createRoom,
    onlineState: { roomId },
  } = useSocketContext();
  const { createRoom: createRoomHook, joinRoom: joinRoomHook } =
    useSocketConnection();
  const navigate = useNavigate();

  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');

  const validateInput = (value, fieldName) => {
    if (!value.trim()) {
      alert(`${fieldName} cannot be empty`);
      return false;
    }
    if (value.length > 10) {
      alert(`${fieldName} must be 10 characters or less`);
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    if (!validateInput(createName, 'Username')) return;
    createRoom({ username: createName });
    createRoomHook({ username: createName });
  };

  const handleJoin = () => {
    if (!validateInput(joinCode, 'Room code')) return;
    if (!validateInput(joinName, 'Username')) return;
    joinRoomHook({ roomId: joinCode, username: joinName });
    // joinRoom({ roomId: joinCode, username: joinName });
  };

  useEffect(() => {
    if (roomId) navigate('/online');
  }, [roomId, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col gap-8 items-center border border-neutral-50/20 bg-bg-tertiary dark:bg-bg-dark-secondary p-8 rounded-xl shadow-lg w-96">
        <div className="flex flex-col gap-4 items-center w-full">
          <h1 className="text-2xl font-bold text-text-accent2 dark:text-text-dark-primary">
            Create Game Room
          </h1>
          <input
            type="text"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-text-secondary"
          />
          <button
            onClick={handleCreate}
            className="w-full bg-gradient-to-br from-orange-400 to-purple-500 text-white py-2 rounded-lg"
          >
            Create Room
          </button>
        </div>

        <div className="w-full border-t border-gray-200 my-4"></div>

        <div className="flex flex-col gap-4 items-center w-full">
          <h2 className="text-xl font-bold text-text-accent2 dark:text-text-dark-primary">
            Join Room
          </h2>
          <p className="text-sm text-gray-500 text-center">{`Have an invite code? Join your friend's room`}</p>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter invite code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-text-secondary"
          />
          <input
            type="text"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-text-secondary"
          />
          <button
            onClick={handleJoin}
            className="w-full bg-gradient-to-br from-orange-400 to-purple-500 text-white py-2 rounded-lg"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
