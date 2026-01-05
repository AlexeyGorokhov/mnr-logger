// To test production environment run this file as:
// $ NODE_ENV=production npx tsx ./examples/verror.ts

import mnrLogger from '../src/index.js';
import VError from '@peassoft/verror';

const logger = mnrLogger({
  appName: 'example',
  deploymentEnv: 'local',
});

const meta = { a: 1, b: 'baz' };

const err1 = new VError(
  {
    name: 'CustomError',
    info: {
      infoField1: 'info_1',
      infoField2: 2,
    },
  },
  'foo',
);

console.log('*** Simple VError ***\n');
logger.error(err1, meta);

const originalError = new Error('original error');

const err2 = new VError(
  {
    name: 'CustomError',
    cause: originalError,
    info: {
      infoField1: 'info_1',
      infoField2: 2,
    },
  },
  'foo',
);

console.log('\n*** VError with "cause" ***\n');
logger.error(err2, meta);
