import { User2, Layers } from 'lucide-react';

function PlayerInfo({ name, deckCount }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm md:text-base">
        <User2 className="h-4 w-4 md:w-5 md:h-5" />
        <span className="font-medium">{name}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm md:text-base">
        <Layers className="h-4 w-4 md:w-5 md:h-5" />
        <span>{deckCount}</span>
      </div>
    </div>
  );
}

export default PlayerInfo;
