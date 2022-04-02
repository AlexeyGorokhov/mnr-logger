declare type MnrLogger = {
  /**
   * Log error
   *
   * @param err
   * @param meta Any JSON-serializable data. Optional. Defaults to an empty object
   */
  error: (err: Error, meta?: any) => void;

  /**
   * Log warning
   *
   * @param err
   * @param meta Any JSON-serializable data. Optional. Defaults to an empty object
   */
  warn: (err: Error, meta?: any) => void;

  /**
   * Log info
   * @param message
   * @param meta Any JSON-serializable data. Optional. Defaults to an empty object
   */
  info: (message: string, meta?: any) => void;
};

declare type MnrLoggerOptions = {
  /**
   * Application name tag. Optional. Defaults to an empty string
   */
  appName?: string;

  /**
   * Application deployment environment tag. Optional. Defaults to an empty string
   */
  deploymentEnv?: string;
};

export default function mnrLogger(opts: MnrLoggerOptions): MnrLogger;
