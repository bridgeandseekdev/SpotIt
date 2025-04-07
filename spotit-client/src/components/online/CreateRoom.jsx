import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../context';

function CreateRoom() {
  const {
    createRoom,
    joinRoom,
    onlineState: { roomId },
  } = useSocketContext();
  const navigate = useNavigate();

  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');

  const handleCreate = () => {
    createRoom({ username: createName });
  };

  const handleJoin = () => {
    joinRoom({ roomId: joinCode, username: joinName });
  };

  useEffect(() => {
    if (roomId) navigate('/online');
  }, [roomId, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-36">
      <div className="flex flex-col gap-4 items-center">
        <h1>Create a private game room</h1>
        <input
          type="text"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          placeholder="Enter your game name"
        />
        <button onClick={handleCreate}>Create Room</button>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h2>Join room</h2>
        <p>If you already have an invite code, join here</p>
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter invite code"
        />
        <input
          type="text"
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
          placeholder="Enter your game name"
        />
        <button onClick={handleJoin}>Join Room</button>
      </div>
    </div>
  );
}

export default CreateRoom;
