/* eslint-disable react/prop-types */
import { Route, Routes } from 'react-router-dom';
import { GameProvider } from './context';

import DarkModeSwitch from './components/DarkModeSwitch';
import GameSettings from './components/gameplay/GameSettings';
import MainMenu from './components/gameplay/MainMenu';
import GameContainer from './components/gameplay/GameContainer';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-purple-100 dark:bg-none dark:bg-bg-dark-tertiary dark:text-text-dark-primary">
      <DarkModeSwitch />
      {children}
    </div>
  );
};

function App() {
  return (
    <AppLayout>
      <GameProvider>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/settings/:mode" element={<GameSettings />} />
          <Route path="/game" element={<GameContainer />} />
        </Routes>
      </GameProvider>
    </AppLayout>
  );
}

export default App;
