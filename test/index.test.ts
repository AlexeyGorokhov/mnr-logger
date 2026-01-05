import { describe, test, expect } from 'vitest';

import mnrLogger from '../src/index.js';

describe('initializing the logger instance', () => {
  const logger = mnrLogger({
    appName: 'bar',
    deploymentEnv: 'baz',
  });

  test('should create an instance of logger', () => {
    expect(logger).toBeDefined();
  });
});
