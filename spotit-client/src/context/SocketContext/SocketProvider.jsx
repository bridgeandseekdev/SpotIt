import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import SocketContext from './SocketContext';
import { useNewGameContext } from '../../context';
import { loadDeck } from '../../utils/gameUtils';
import { preloadIcons } from '../../assets/icons';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const {
    handleSocketConnectionAction,
    handleRoomCreatedAction,
    handleRoomJoinedAction,
    handleOpponentJoinedAction,
    handleOnlineGameInitializedAction,
    handleOnlineGameStartedAction,
    handleOnlineMatchSuccessAction,
    handleOnlineGameOverAction,
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

    socket.on('game_initialized', async (payload) => {
      const uniqueSymbols = [
        ...new Set(payload.deck.flat().map((obj) => obj.symbol)),
      ];
      await preloadIcons(uniqueSymbols);
      handleOnlineGameInitializedAction(payload);
    });

    socket.on('game_started', (payload) =>
      handleOnlineGameStartedAction(payload),
    );

    socket.on('match_success', (payload) =>
      handleOnlineMatchSuccessAction(payload),
    );

    socket.on('game_over', (payload) => {
      handleOnlineGameOverAction(payload);
    });

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

  const startGame = useCallback(
    async (difficulty, roomId) => {
      const deck = await loadDeck(difficulty);
      socket.emit('initialize_game', { roomId, deck, difficulty });
    },
    [socket],
  );

  const startOnlineCountdown = (roomId, gameId) => {
    socket.emit('start_countdown', { roomId, gameId });
  };

  const checkMatch = (gameId, symbol) => {
    socket.emit('check_match', { gameId, symbol });
  };

  // const resetSocket = () => {
  //   setSocket(null);
  //   setOnlineState(initialState);
  // };

  return (
    <SocketContext.Provider
      value={{
        createRoom,
        joinRoom,
        isConnected: socket && socket.connected,
        startGame,
        startOnlineCountdown,
        checkMatch,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
