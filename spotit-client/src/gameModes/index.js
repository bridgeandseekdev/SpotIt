import practiceMode from './practice';
import timedMode from './timed';
import botMode from './bot';
import onlineMode from './online';

const gameModes = {
  practice: practiceMode,
  timed: timedMode,
  bot: botMode,
  online: onlineMode,
};

export default gameModes;
