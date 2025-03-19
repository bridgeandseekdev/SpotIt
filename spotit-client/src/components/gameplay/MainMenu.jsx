import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <h1>SpotIt!!</h1>

      <button onClick={() => navigate('/settings/practice')}>
        <h3>Practice Mode</h3>
        <p>Train at your own pace</p>
      </button>

      <button onClick={() => navigate('/settings/timed')}>
        <h3>Timed Challenge</h3>
        <p>Race against the clock!</p>
      </button>

      <button onClick={() => navigate('/settings/practice')}>
        <h3>2 Players</h3>
        <p>Challenge a friend</p>
      </button>

      <button onClick={() => navigate('/settings/bot')}>
        <h3>Computer</h3>
        <p>Play with a bot</p>
      </button>
    </div>
  );
};

export default MainMenu;
