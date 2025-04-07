import { Routes, Route } from 'react-router-dom';
import RoomHome from './RoomHome';
import CreateRoom from './CreateRoom';
import OnlineGamePlay from './OnlineGamePlay';

function OnlineRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoomHome />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/play" element={<OnlineGamePlay />} />
    </Routes>
  );
}

export default OnlineRouter;
