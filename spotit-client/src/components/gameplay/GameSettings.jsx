import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    theme: 'classic',
    symbolSet: 'basic',
    difficulty: 'easy',
    symbolsPerCard: '8',
  });

  const handleStartGame = () => {
    navigate('/game', { state: settings });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 onClick={() => navigate(-1)}>Back</h1>

      <h3>Theme</h3>
      <select
        name="settingsTheme"
        id="settingsTheme"
        defaultValue={settings.theme}
        onChange={(e) => setSettings(e.target.value)}
        className="text-black"
      >
        <option value="classic">Classic</option>
        <option value="nature">Nature</option>
        <option value="animals">Animals</option>
        <option value="adult">Adult</option>
      </select>

      <button onClick={handleStartGame}>
        <h3>Start play!</h3>
      </button>
    </div>
  );
};

export default GameSettings;
