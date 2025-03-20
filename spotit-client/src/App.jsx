import { Route, Routes } from 'react-router-dom';
import { BotGameProvider, GameProvider } from './context';

import DarkModeSwitch from './components/DarkModeSwitch';
import GameSettings from './components/gameplay/GameSettings';
import MainMenu from './components/gameplay/MainMenu';
import GameContainer from './components/gameplay/GameContainer';
import GameRouteWrapper from './components/gameplay/GameRouteWrapper';
import BotGameContainer from './components/gameplay/BotGameContainer';

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
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/settings/:mode" element={<GameSettings />} />
        <Route
          path="/game/:mode"
          element={
            <GameRouteWrapper>
              {(params) => {
                const mode = params.mode;
                switch (mode) {
                  case 'bot':
                    return (
                      <BotGameProvider>
                        <BotGameContainer />
                      </BotGameProvider>
                    );

                  default:
                    return (
                      <GameProvider>
                        <GameContainer />
                      </GameProvider>
                    );
                }
              }}
            </GameRouteWrapper>
          }
        />
      </Routes>
    </AppLayout>
  );
}

export default App;
