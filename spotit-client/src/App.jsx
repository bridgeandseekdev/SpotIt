import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NewGameProvider, SocketProvider } from './context';
import MainMenu from './components/pages/MainMenu';
import DifficultySelect from './components/pages/DifficultySelect';
import OnlineRouter from './components/online/OnlineRouter';

const GamePlay = lazy(() => import('./components/pages/GamePlay'));

function App() {
  return (
    <NewGameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/difficulty" element={<DifficultySelect />} />
          <Route
            path="/play"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <GamePlay />
              </Suspense>
            }
          />
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
    </NewGameProvider>
  );
}

export default App;
