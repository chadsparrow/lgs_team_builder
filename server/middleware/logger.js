const winston = require('winston');
require('winston-daily-rotate-file');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: new Date().toISOString(),
      colorize: true
    })
  ]
});

// setup winston
logger.add(winston.transports.DailyRotateFile, {
  filename: './server/logs/teambuilder-%DATE%.log',
  maxFiles: '14d'
});

module.exports = logger;
