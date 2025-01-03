# mnr-logger

Opinionated logger for Node.js

## You may not need it!

This is a highly opinionated solution aimed at code reuse for a few private projects. You'd be better off using something popular, like [winston](https://www.npmjs.com/package/winston) and friends.

## v3 Breaking Changes

* From v3, `mnr-logger` is an ESM-only module - you are not able to import it with `require()`.

* Bump minimum supported version of Node.js to v20.

* Change type of `meta` parameter from `any` to `unknown`.

Archive documentation:
* [v1](https://github.com/AlexeyGorokhov/mnr-logger/blob/master/docs-archives/v1.md);
* [v2](https://github.com/AlexeyGorokhov/mnr-logger/blob/master/docs-archives/v2.md);

## Installation

```bash
$ npm install --save mnr-logger
```

## Usage example

```javascript
import mnrLogger from 'mnr-logger';

const logger = mnrLogger({
  appName: 'my-cool-app',
  deploymentEnv: 'production'
});

const ERR = new Error('something went wrong');

logger.error(ERR, { transactionId: '12345' });
logger.warn(ERR, { transactionId: '12345' });
logger.info('take a look at foo stuff', { transactionId: '12345' });
```

## What It Does

`mnr-logger` sends log messages to stderr (for `error` method), or stdout (for `warn` and `info` methods).

When `process.env.NODE_ENV !== 'production'`, `mnr-logger` logs directly to stdout/stderr without any care how many lines it occupies. This is for development mode.

When `process.env.NODE_ENV === 'production'`, `mnr-logger` creates a POJO with all the pieces of information it has received, then JSON.stringifies it, and sends to stdout/stderr a single line of text. This allows to treat every single line in your logs storage as one logging item and automate processing. After JSON.parsing this string, you'll get a POJO of the following form:

* `{ISO Date string} timestamp` - Timestamp of the moment mnr-logger received the message.

* `{String} appName` - Application name that mnr-logger was initialized with.

* `{String} deploymentEnv` - Application deployment environment label that mnr-logger was initialized with.

* `{String} level` - "error" for `error()` method; "warn" for `warn()` method; "info" for `info()` method.

* `{String} error` - JSON.stringified `Error` object that was sent to `error()` or `warn()` methods. You can JSON.parse it further to get a pretty formatted representation of the error.

* `{Any} meta` - Optional. Additional information that was sent to the logger.

* `{String} message` - Message passed to `info()` method.


## API Reference

### `mnrLogger(opts: object)`

Create a logger instance. You can create as many logger instances as you need in your app.

* `{String} opts.appName` - [optional] Application name tag. Defaults to an empty string

* `{String} deploymentEnv` - [optional] Application deployment environment tag. Defaults to an empty string

Returns logger instance with `error`, `warn`, and `info` methods.


### `logger.error(error, [meta])`

Logs an error (with some meta data) into stderr.

Parameters:

* `{Error} error` - Error to log

* `{Any} [meta]` - [optional] Any JSON-serializable data.


### `logger.warn(error, [meta])`

Logs an error (with some meta data) into stdout.

Parameters:

* `{Error} error` - Error to log

* `{Any} [meta]` - [optional] Any JSON-serializable data.


## `logger.info(message, [meta])`

Logs an arbitrary text message (with some meta data) into stdout.

Parameters:

* `{String} message`

* `{Any} [meta]` - [optional] Any JSON-serializable data.
