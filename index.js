'use strict';

const winston = require('winston');

let logger;

module.exports = { error, warn, info, debug };

function error (message, stack) {
  log('error', message, stack);
}

function warn (message, meta) {
  log('warn', message, meta);
}

function info (message, meta) {
  log('info', message, meta);
}

function debug (message, meta) {
  log('debug', message, meta);
}

function log (level, message, meta) {
  if (!logger) logger = createLogger();
  logger.log(level, message, meta);
}

function createLogger () {
  let level;

  if (process.env.NODE_ENV === 'production') {
    level = 'info';
  } else {
    level = 'debug';
  }

  logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: level,
        stderrLevels: ['error', 'warn'],
        timestamp () { return (new Date()).toISOString(); }
      })
    ]
  });

  return logger;
}
