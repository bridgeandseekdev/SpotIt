import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useGameContext } from '../GameContext/useGameContext';
import { loadDeck } from '../../utils/gameUtils';
import SocketContext from './SocketContext';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const initialState = {
    isConnected: false,
    roomId: null,
    hostId: null,
    players: [],
    myPlayerId: null,
  };
  const [onlineState, setOnlineState] = useState(initialState);
  const onlineStateRef = useRef(initialState);

  const {
    difficulty,
    handleOnlineGameInitialized,
    handleOnlineGameStarted,
    online: { gameId },
    handleOnlineMatchFound,
    handleOnlineGameover,
  } = useGameContext();

  useEffect(() => {
    // Update ref whenever state changes
    onlineStateRef.current = onlineState;
  }, [onlineState]);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000',
    );

    newSocket.on('connect', () => {
      setOnlineState((prev) => ({ ...prev, isConnected: true }));
    });

    newSocket.on('room_created', handleRoomCreated);

    newSocket.on('room_joined', handleRoomJoined);
    newSocket.on('player_joined', handlePlayerJoined);
    newSocket.on('game_initialized', (payload) =>
      handleOnlineGameInitialized(payload, onlineStateRef.current.myPlayerId),
    );
    newSocket.on('game_started', handleOnlineGameStarted);
    newSocket.on('match_success', (payload) =>
      handleOnlineMatchFound(payload, onlineStateRef.current.myPlayerId),
    );
    newSocket.on('match_failed', (data) => console.log(data));
    newSocket.on('game_over', (payload) =>
      handleOnlineGameover(
        payload,
        onlineStateRef.current.myPlayerId,
        onlineStateRef.current.players,
      ),
    );
    newSocket.on('error', (err) => console.log(err));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleRoomCreated = ({ roomInfo: { hostId, players }, roomId }) => {
    setOnlineState((prev) => ({
      ...prev,
      roomId,
      hostId,
      players,
      myPlayerId: hostId,
    }));
  };

  const handleRoomJoined = ({ roomId, player, hostId }) => {
    setOnlineState((prev) => ({
      ...prev,
      roomId,
      myPlayerId: player.id,
      hostId,
    }));
  };

  const handlePlayerJoined = ({ players }) => {
    setOnlineState((prev) => ({
      ...prev,
      players,
    }));
  };

  const createRoom = ({ username }) => {
    socket.emit('create_room', { username });
  };

  const joinRoom = ({ roomId, username }) => {
    socket.emit('join_room', { roomId, username });
  };

  const startGame = async () => {
    const deck = await loadDeck(difficulty);
    socket.emit('initialize_game', { roomId: onlineState.roomId, deck });
  };

  const startOnlineCountdown = () => {
    socket.emit('start_countdown', { roomId: onlineState.roomId, gameId });
  };

  const checkMatch = (symbol) => {
    console.log('sending data', gameId, symbol);
    socket.emit('check_match', { gameId, symbol });
  };

  const resetSocket = () => {
    setSocket(null);
    setOnlineState(initialState);
  };

  return (
    <SocketContext.Provider
      value={{
        onlineState,
        createRoom,
        joinRoom,
        resetSocket,
        startGame,
        startOnlineCountdown,
        checkMatch,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
