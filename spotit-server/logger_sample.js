// const winston = require('winston');
// const path = require('path');

// // logger.js

// class GameLogger {
//   constructor() {
//     this.logger = winston.createLogger({
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json(),
//       ),
//       transports: [
//         new winston.transports.File({
//           filename: path.join(__dirname, 'logs', 'error.log'),
//           level: 'error',
//         }),
//         new winston.transports.File({
//           filename: path.join(__dirname, 'logs', 'combined.log'),
//         }),
//       ],
//     });

//     if (process.env.NODE_ENV !== 'production') {
//       this.logger.add(
//         new winston.transports.Console({
//           format: winston.format.simple(),
//         }),
//       );
//     }
//   }

//   logRoom(roomId, event, data) {
//     this.logger.info({
//       type: 'room',
//       roomId,
//       event,
//       data,
//     });
//   }

//   logGame(gameId, roomId, event, data) {
//     this.logger.info({
//       type: 'game',
//       gameId,
//       roomId,
//       event,
//       data,
//     });
//   }

//   logError(context, error) {
//     this.logger.error({
//       type: 'error',
//       context,
//       error: error.message,
//       stack: error.stack,
//     });
//   }

//   getLogsByRoom(roomId) {
//     // Implementation to filter logs by roomId
//     return new Promise((resolve, reject) => {
//       // Read log file and filter by roomId
//     });
//   }

//   getLogsByGame(gameId) {
//     // Implementation to filter logs by gameId
//     return new Promise((resolve, reject) => {
//       // Read log file and filter by gameId
//     });
//   }
// }

// const gameLogger = new GameLogger();
// module.exports = gameLogger;
