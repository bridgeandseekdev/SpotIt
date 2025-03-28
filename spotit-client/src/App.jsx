import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BotGameProvider, GameProvider } from './context';

import GameSettings from './components/gameplay/GameSettings';
import MainMenu from './components/gameplay/MainMenu';
import GameContainer from './components/gameplay/GameContainer';
import GameRouteWrapper from './components/gameplay/GameRouteWrapper';
import BotGameContainer from './components/gameplay/BotGameContainer';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
