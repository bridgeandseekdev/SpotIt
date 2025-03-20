import { useNavigate } from 'react-router-dom';
import BotGameBoard from './BotGameBoard';
import BotGameHeader from './BotGameHeader';
import BotGameStatus from './BotGameStatus';
import { useBotGameSetup } from '../../hooks/useBotGameSetup';

const LoadingState = ({ message }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-xl font-semibold">{message}</div>
  </div>
);

function BotGameContainer() {
  const navigate = useNavigate();
  const { isLoading, error, gameState } = useBotGameSetup();

  if (isLoading) return <LoadingState message="Loading..." />;
  if (error) return <LoadingState message={error} />;
  if (!gameState) return <LoadingState message="Initializing game..." />;
  return (
    <div className="relative flex flex-col" style={{ height: '100dvh' }}>
      <BotGameHeader onQuit={() => navigate('/')} />
      <BotGameBoard />
      <BotGameStatus />
    </div>
  );
}

export default BotGameContainer;
