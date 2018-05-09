const logLevel = require('./log-level');
const Transport = require('./transport');

module.exports = class Logger {
  constructor() {
    this.createLogger = () => new Logger();
    this.transport = new Transport();
  }

  set serverUrl(url) {
    this.transport.serverUrl = url;
  }

  set apiKey(key) {
    this.transport.apiKey = key;
  }

  verbose(template, data) {
    this.log(logLevel.VERBOSE, template, data);
  }

  debug(template, data) {
    this.log(logLevel.DEBUG, template, data);
  }

  information(template, data) {
    this.log(logLevel.INFORMATION, template, data);
  }

  warning(template, data) {
    this.log(logLevel.WARNING, template, data);
  }

  error(template, data) {
    this.log(logLevel.ERROR, template, data);
  }

  fatal(template, data) {
    this.log(logLevel.FATAL, template, data);
  }

  log(level, template, data = {}) {
    try {
      Logger.writeToConsole(level, template, data);
      this.transport.writeToSeq(level, template, data);
    } catch (err) {
      /* eslint-disable no-console */
      console.warn('Failed to send logs to Seq', err);
      /* eslint-enable no-console */
    }
  }

  static writeToConsole(level, template, data) {
    /* eslint-disable no-console */
    switch (level) {
      case logLevel.VERBOSE:
      case logLevel.DEBUG:
        console.debug(template, data);
        break;
      case logLevel.WARNING:
        console.warn(template, data);
        break;
      case logLevel.ERROR:
      case logLevel.FATAL:
        console.error(template, data);
        break;
      default:
        console.log(template, data);
        break;
    }
    /* eslint-enable no-console */
  }
};
