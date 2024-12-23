import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <h1>SpotIt!!</h1>

      <button onClick={() => navigate('/settings/practice')}>
        <h3>Practice Mode</h3>
      </button>

      <button onClick={() => navigate('/settings/practice')}>
        <h3>Time Scramble</h3>
      </button>

      <button onClick={() => navigate('/settings/practice')}>
        <h3>Online, (double & multiplayer)</h3>
      </button>
    </div>
  );
};

export default MainMenu;
