'use strict';

const util = require('util');
const sinon = require('sinon');

let _appName;
let _deploymentEnv;

module.exports = mnrLogger;

/**
 * Create and initialize an instance of the logger
 *
 * @param {Object} opts
 *     @prop {String} appName [optional] Application name tag. Defaults to an empty string
 *     @prop {String} deploymentEnv [optional] Application deployment environment tag.
 *         Defaults to an empty string
 *
 * @return {Object}
 *     @prop {Function} error
 *     @prop {Function} warn
 *     @prop {Function} info
 *
 * @public
 */
function mnrLogger (opts) {
  const { appName = '', deploymentEnv = '' } = opts;
  _appName = appName;
  _deploymentEnv = deploymentEnv;

  return { error, warn, info };
}

/**
 * Factory of testing stubs
 *
 * @return {Object}
 *     @prop {Spy} error
 *     @prop {Spy} warn
 *     @prop {Spy} info
 *
 * @static
 * @public
 */
mnrLogger.createStubs = () => ({
  error: sinon.spy(),
  warn: sinon.spy(),
  info: sinon.spy()
});

/**
 * Log error
 *
 * @param {Error} error
 * @param {Any} [meta] Any JSON-serializable data. Defaults to an empty object
 *
 * @return {Void}
 *
 * @public
 */
function error (error, meta = {}) {
  const logItem = createLogItem({
    level: 'error',
    meta,
    error
  });

  log(console.error, logItem);
}

/**
 * Log warning
 *
 * @param {Error} error
 * @param {Any} [meta] Any JSON-serializable data. Defaults to an empty object
 *
 * @return {Void}
 *
 * @public
 */
function warn (error, meta = {}) {
  const logItem = createLogItem({
    level: 'warn',
    meta,
    error
  });

  log(console.log, logItem);
}

/**
 * Log info
 *
 * @param {String} message
 * @param {Any} [meta] Any JSON-serializable data. Defaults to an empty object
 *
 * @return {Void}
 *
 * @public
 */
function info (message, meta = {}) {
  const logItem = createLogItem({
    level: 'info',
    message,
    meta
  });

  log(console.log, logItem);
}

/**
 * Create log item
 *
 * @param {Object} opts
 *     @prop {String} level
 *     @prop {Any} meta
 *     @prop {Error} error [optional]
 *     @prop {String} message [optional]
 *
 * @return {String|Array<Any>}
 *
 * @private
 */
function createLogItem (opts) {
  const {
    level,
    meta,
    error,
    message
  } = opts;
  const timestamp = new Date().toISOString();

  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify({
      timestamp,
      appName: _appName,
      deploymentEnv: _deploymentEnv,
      level,
      meta,
      ...(error ? { error: JSON.stringify(util.inspect(error, { depth: null })) } : {}),
      ...(message ? { message } : {})
    });
  } else {
    const prefix = `${timestamp} [${_appName}][${_deploymentEnv}][${level}]`;
    return [
      prefix,
      ...(message ? ['\n', message] : []),
      ...(error ? ['\n', error] : []),
      '\n',
      meta
    ];
  }
}

/**
 * Send log message to the given stream
 *
 * @param {Function} destination
 * @param {Array<Any>|String} logItem
 *
 * @return {Void}
 *
 * @private
 */
function log (destination, logItem) {
  Array.isArray(logItem)
    ? destination(...logItem)
    : destination(logItem);
}
