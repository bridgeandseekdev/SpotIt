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
      className="absolute left-2 top-1.5 md:top-8 md:left-6 flex gap-2 justify-center items-center"
      onClick={handleQuitGame}
    >
      <PowerOffIcon className="w-4 h-4 md:w-8 md:h-8" />
      <span className="text-sm md:text-base">Quit</span>
    </button>
  );
};

export default QuitGameButton;
