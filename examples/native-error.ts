// To test production environment run this file as:
// $ NODE_ENV=production npx tsx ./examples/native-error.ts

import mnrLogger from '../src/index.js';

const logger = mnrLogger({
  appName: 'example',
  deploymentEnv: 'local',
});

const meta = { a: 1, b: 'baz' };

const err1 = new Error('foo');

console.log('*** Simple native error ***\n');
logger.error(err1, meta);

const err2 = new Error('bar', { cause: err1 });

console.log('\n*** Native error with "cause" ***\n');
logger.error(err2, meta);
