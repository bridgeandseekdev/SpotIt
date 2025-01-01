import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    theme: 'classic',
    difficulty: 'easy',
    symbolsPerCard: '8',
  });

  const handleChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStartGame = () => {
    navigate('/game', { state: settings });
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 onClick={() => navigate(-1)}>Back</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="theme" className="block text-lg font-medium">
            Theme
          </label>
          <select
            name="theme"
            id="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-background text-text-primary"
          >
            <option value="classic">Classic</option>
            <option value="nature">Nature</option>
            <option value="animals">Animals</option>
            <option value="adult">Adult</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className="block text-lg font-medium">
            Difficulty
          </label>
          <select
            name="difficulty"
            id="difficulty"
            value={settings.difficulty}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-background text-text-primary"
          >
            <option value="easy">Easy - Fixed positions and sizes</option>
            <option value="medium">Medium - Size variations</option>
            <option value="hard">Hard - Size and rotation variations</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="symbolsPerCard" className="block text-lg font-medium">
            Symbols per Card
          </label>
          <select
            name="symbolsPerCard"
            id="symbolsPerCard"
            value={settings.symbolsPerCard}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-background text-text-primary"
          >
            <option value="3">3 Symbols (Beginner)</option>
            <option value="5">5 Symbols (Intermediate)</option>
            <option value="8">8 Symbols (Advanced)</option>
          </select>
        </div>
      </div>

      <button onClick={handleStartGame}>
        <h3>Start play!</h3>
      </button>
    </div>
  );
};

export default GameSettings;
