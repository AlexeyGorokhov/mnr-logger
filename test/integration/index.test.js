'use strict';

const test = require('tape');

const logger = require('../../index');

test(`log error`, t => {
  const ERR = new Error('foo');

  logger.error('my_error', ERR);

  t.equal(true, true, 'foo');

  t.end();
});
