import { useEffect } from 'react';
import { useNewGameContext, useSocketContext } from '../../context';
import GamePlay from '../pages/GamePlay';

function OnlineGamePlay() {
  const { startOnlineCountdown, checkMatch } = useSocketContext();
  const {
    gameState: {
      socketConnection: { roomId, gameId },
    },
  } = useNewGameContext();
  useEffect(() => {
    startOnlineCountdown(roomId, gameId);
  }, []);
  return <GamePlay onlineCheckMatch={checkMatch} />;
}

export default OnlineGamePlay;
