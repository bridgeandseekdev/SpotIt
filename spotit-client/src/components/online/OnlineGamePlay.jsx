import { useEffect } from 'react';
import { useSocketContext } from '../../context';
import GamePlay from '../pages/GamePlay';

function OnlineGamePlay() {
  const { startOnlineCountdown, checkMatch } = useSocketContext();
  useEffect(() => {
    startOnlineCountdown();
  }, []);
  return <GamePlay onlineCheckMatch={checkMatch} />;
}

export default OnlineGamePlay;
