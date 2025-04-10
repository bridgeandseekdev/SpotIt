import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNewGameContext } from '../context';

export function useSocketConnection() {
  const [socket, setSocket] = useState(null);
  const {
    handleSocketConnectionAction,
    handleRoomCreatedAction,
    handleRoomJoinedAction,
    handleOpponentJoinedAction,
  } = useNewGameContext();

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000',
    );
    socket.on('connect', () => {
      setSocket(socket);
      handleSocketConnectionAction(socket);
    });

    socket.on('room_created', handleRoomCreated);

    socket.on('room_joined', handleRoomJoined);

    socket.on('player_joined', handlePlayerJoined);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRoomCreated = ({ roomInfo: { hostId, players }, roomId }) => {
    handleRoomCreatedAction({ hostId, players, roomId });
  };

  const handleRoomJoined = ({ roomId, player, hostId }) => {
    handleRoomJoinedAction({ roomId, player, hostId });
  };

  const handlePlayerJoined = ({ players }) => {
    handleOpponentJoinedAction({ players });
  };

  const createRoom = useCallback(
    ({ username }) => {
      socket.emit('create_room', { username });
    },
    [socket],
  );

  const joinRoom = useCallback(
    ({ roomId, username }) => {
      socket.emit('join_room', { roomId, username });
    },
    [socket],
  );

  return {
    createRoom,
    joinRoom,
    isConnected: socket && socket.connected,
  };
}
