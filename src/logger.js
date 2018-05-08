const logLevel = require('./log-level');
const Transport = require('./transport');

module.exports = class Logger {
  constructor() {
    this.createLogger = () => new Logger();
    this.transport = new Transport();

    this.verbose = this.log.bind(this, logLevel.VERBOSE);
    this.debug = this.log.bind(this, logLevel.DEBUG);
    this.information = this.log.bind(this, logLevel.INFORMATION);
    this.warning = this.log.bind(this, logLevel.WARNING);
    this.error = this.log.bind(this, logLevel.ERROR);
    this.fatal = this.log.bind(this, logLevel.FATAL);
  }

  set serverUrl(url) {
    this.transport.serverUrl = url;
  }

  set apiKey(key) {
    this.transport.apiKey = key;
  }

  log(level, template, data = {}) {
    try {
      this.writeToConsole(level, template, data);
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
