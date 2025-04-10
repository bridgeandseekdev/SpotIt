import { Routes, Route } from 'react-router-dom';
import RoomHome from './RoomHome';
import CreateRoom from './CreateRoom';
import OnlineGamePlay from './OnlineGamePlay';
import { useSocketConnection } from '../../hooks/useSocketConnection';

function OnlineRouter() {
  useSocketConnection();
  // This hook handles the socket connection and listens for events
  // related to the online game.
  return (
    <Routes>
      <Route path="/" element={<RoomHome />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/play" element={<OnlineGamePlay />} />
    </Routes>
  );
}

export default OnlineRouter;
