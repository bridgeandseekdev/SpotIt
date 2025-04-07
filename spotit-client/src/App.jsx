import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context';
import { SocketProvider } from './context';
import MainMenu from './components/pages/MainMenu';
import DifficultySelect from './components/pages/DifficultySelect';
import GamePlay from './components/pages/GamePlay';
import OnlineRouter from './components/online/OnlineRouter';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/difficulty" element={<DifficultySelect />} />
          <Route path="/play" element={<GamePlay />} />
          <Route
            path="/online/*"
            element={
              <SocketProvider>
                <OnlineRouter />
              </SocketProvider>
            }
          />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
