import PropTypes from 'prop-types';

const GameHeader = ({ onQuit }) => (
  <div className="absolute left-2 top-4">
    <button onClick={onQuit}>Quit</button>
  </div>
);

GameHeader.propTypes = {
  onQuit: PropTypes.func.isRequired,
};

export default GameHeader;
