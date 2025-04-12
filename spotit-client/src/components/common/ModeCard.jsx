function ModeCard({ onClick, Icon, iconColor, title, description }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 md:p-6 bg-white dark:bg-bg-dark-secondary rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-neutral-200 dark:border-neutral-700"
    >
      <div className="mr-6">
        <Icon className={`w-4 h-4 md:w-8 md:h-8 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-base md:text-lg font-semibold mb-2">{title}</h3>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ModeCard;
