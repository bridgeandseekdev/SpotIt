import { useNavigate } from 'react-router-dom';
import GameBoard from './GameBoard';
import GameHeader from './GameHeader';
import GameStatus from './GameStatus';
import { useGameSetup } from '../../hooks/useGameSetup';

const GameContainer = () => {
  const navigate = useNavigate();
  const { isLoading, error, gameState, handleMatch, gameSettings } =
    useGameSetup();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative flex flex-col" style={{ height: '100dvh' }}>
      <GameHeader onQuit={() => navigate('/')} />
      <GameBoard
        gameState={gameState}
        gameSettings={gameSettings}
        onMatch={handleMatch}
      />
      <GameStatus cardsRemaining={gameState.cardsRemaining} />
    </div>
  );
};

export default GameContainer;
