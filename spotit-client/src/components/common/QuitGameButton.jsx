import { PowerIcon as PowerOffIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuitGameButton = () => {
  //handle online quitting
  const navigate = useNavigate();

  function handleQuitGame() {
    navigate('/');
  }
  return (
    <button
      className="absolute top-8 left-6 flex gap-2 justify-center items-end"
      onClick={handleQuitGame}
    >
      <PowerOffIcon size={24} />
      <span>Quit</span>
    </button>
  );
};

export default QuitGameButton;
