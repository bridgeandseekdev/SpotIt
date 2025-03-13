import { useNavigate } from 'react-router-dom';
import GameBoard from './GameBoard';
import GameHeader from './GameHeader';
import GameStatus from './GameStatus';
import { useGameSetup } from '../../hooks/useGameSetup';

const LoadingState = ({ message }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-xl font-semibold">{message}</div>
  </div>
);

const GameContainer = () => {
  const navigate = useNavigate();
  const { isLoading, error, gameState } = useGameSetup();

  if (isLoading) return <LoadingState message="Loading..." />;
  if (error) return <LoadingState message={error} />;
  if (!gameState) return <LoadingState message="Initializing game..." />;

  return (
    <div className="relative flex flex-col" style={{ height: '100dvh' }}>
      <GameHeader onQuit={() => navigate('/')} />
      <GameBoard />
      <GameStatus />
    </div>
  );
};

export default GameContainer;
