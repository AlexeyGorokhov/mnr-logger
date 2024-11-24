/**
 * Opinionated logger for Node.js.
 *
 * @packageDocumentation
 */

import util from 'node:util';

/**
 * Logger options
 *
 * @public
 */
export type MnrLoggerOptions = {
  /** Application name tag. Optional. Defaults to an empty string */
  appName?: string;
  /** Application deployment environment tag. Optional. Defaults to an empty string */
  deploymentEnv?: string;
};

/**
 * Logger instance
 *
 * @public
 */
export type MnrLogger = {
  /**
   * Log error
   *
   * @param err - Error object.
   * @param meta - Any JSON-serializable data. Optional.
   */
  error: (err: Error, meta?: unknown) => void;

  /**
   * Log warning
   *
   * @param err - Error object.
   * @param meta - Any JSON-serializable data. Optional.
   */
  warn: (err: Error, meta?: unknown) => void;

  /**
   * Log info
   *
   * @param message - Informational message.
   * @param meta - Any JSON-serializable data. Optional.
   */
  info: (message: string, meta?: unknown) => void;
};

type LogItemOptions =
  | {
    level: 'error' | 'warn';
    meta?: unknown;
    error: Error;
  }
  | {
    level: 'info';
    meta?: unknown;
    message: string;
  };

let _appName: string = '';
let _deploymentEnv: string = '';

/**
 * Create and initialize an instance of the logger.
 *
 * @public
 */
export default function mnrLogger(opts: MnrLoggerOptions): MnrLogger {
  const { appName = '', deploymentEnv = '' } = opts;

  _appName = appName;
  _deploymentEnv = deploymentEnv;

  return { error, warn, info };
}

/**
 * Log error
 */
function error(error: Error, meta?: unknown): void {
  const logItem = createLogItem({
    level: 'error',
    meta,
    error,
  });

  log(console.error, logItem);
}

/**
 * Log warning
 */
function warn(error: Error, meta?: unknown) {
  const logItem = createLogItem({
    level: 'warn',
    meta,
    error,
  });

  log(console.log, logItem);
}

/**
 * Log info
 */
function info(message: string, meta?: unknown) {
  const logItem = createLogItem({
    level: 'info',
    message,
    meta,
  });

  log(console.log, logItem);
}

/**
 * Create log item
 */
function createLogItem(opts: LogItemOptions): string | string[] {
  const timestamp = new Date().toISOString();

  if (process.env['NODE_ENV'] === 'production') {
    return JSON.stringify({
      timestamp,
      appName: _appName,
      deploymentEnv: _deploymentEnv,
      level: opts.level,
      ...opts.meta
        ? { meta: opts.meta }
        : {},
      ...'error' in opts
        ? { error: JSON.stringify(util.inspect(opts.error, { depth: null })) }
        : {},
      ...'message' in opts
        ? { message: opts.message }
        : {},
    });
  } else {
    const prefix = `${timestamp} [${_appName}][${_deploymentEnv}][${opts.level}]`;

    return [
      prefix,
      ...'message' in opts
        ? ['\n', opts.message]
        : [],
      ...'error' in opts
        ? ['\n', JSON.stringify(util.inspect(opts.error, { depth: null }))]
        : [],
      ...opts.meta
        ? ['\n', JSON.stringify(opts.meta)]
        : [],
      '\n',
    ];
  }
}

/**
 * Send log message to the given stream
 */
function log(
  destination: (...data: unknown[]) => unknown,
  logItem: string | string[],
): void {
  if (Array.isArray(logItem)) {
    destination(...logItem);
  } else {
    destination(logItem);
  }
}
