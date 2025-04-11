import { User2, Layers } from 'lucide-react';

function PlayerInfo({ name, deckCount }) {
  return (
    <div className="flex items-center gap-4">
      <User2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      <span className="font-medium">{name}</span>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <Layers className="w-5 h-5" />
        <span>{deckCount}</span>
      </div>
    </div>
  );
}

export default PlayerInfo;
