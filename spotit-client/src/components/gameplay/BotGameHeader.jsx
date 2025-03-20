const BotGameHeader = ({ onQuit }) => (
  <div className="absolute left-2 top-4">
    <button onClick={onQuit}>Quit</button>
  </div>
);

export default BotGameHeader;
