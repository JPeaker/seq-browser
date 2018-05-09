const sinon = require('sinon');
require('chai').should();

const logLevel = require('../src/log-level');
const Logger = require('../src/logger');

describe('Logger', () => {
  describe('set #serverUrl', () => {
    it('gets passed through to the transport', () => {
      const logger = new Logger();
      logger.serverUrl = 'https://test.logs';

      logger.transport.serverUrl.should.equal('https://test.logs');
    });
  });

  describe('set #apiKey', () => {
    it('gets passed through to the transport', () => {
      const logger = new Logger();
      logger.apiKey = '12345';

      logger.transport.apiKey.should.equal('12345');
    });
  });

  describe('#writeToConsole', () => {
    it('calls correct console.x function', () => {
      /* eslint-disable no-console */
      sinon.spy(console, 'debug');
      sinon.spy(console, 'warn');
      sinon.spy(console, 'error');
      sinon.spy(console, 'log');

      Logger.writeToConsole(logLevel.VERBOSE, 'Template', {});
      console.debug.callCount.should.equal(1);
      Logger.writeToConsole(logLevel.DEBUG, 'Template', {});
      console.debug.callCount.should.equal(2);
      Logger.writeToConsole(logLevel.WARNING, 'Template', {});
      console.warn.callCount.should.equal(1);
      Logger.writeToConsole(logLevel.ERROR, 'Template', {});
      console.error.callCount.should.equal(1);
      Logger.writeToConsole(logLevel.FATAL, 'Template', {});
      console.error.callCount.should.equal(2);
      Logger.writeToConsole(logLevel.INFORMATION, 'Template', {});
      console.log.callCount.should.equal(1);
      /* eslint-enable no-console */
    });
  });

  describe('#log', () => {
    it('passes through context by default', () => {
      const logger = new Logger();
      sinon.spy(logger.transport, 'writeToSeq');

      logger.context.test = 'TEST';
      logger.context.number = 12345;

      logger.log(logLevel.INFORMATION, 'Testing');

      logger.transport.writeToSeq.calledWith(sinon.match.any, sinon.match.any, sinon.match({
        test: 'TEST',
        number: 12345,
      })).should.equal(true);
    });

    it('context gets combined with additional data', () => {
      const logger = new Logger();
      sinon.spy(logger.transport, 'writeToSeq');

      logger.context.test = 'TEST';
      logger.context.number = 12345;

      logger.log(logLevel.INFORMATION, 'Testing', { hello: 'world' });

      logger.transport.writeToSeq.calledWith(sinon.match.any, sinon.match.any, sinon.match({
        test: 'TEST',
        number: 12345,
        hello: 'world',
      })).should.equal(true);
    });
  });

  describe('#verbose', () => {
    it('calls #log with correct level', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.verbose('Testing');
      logger.log.calledWith(logLevel.VERBOSE).should.equal(true);
    });

    it('calls #log with correct properties', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.verbose('Testing', { Test: 1 });
      logger.log.calledWith(
        sinon.match.any,
        'Testing',
        sinon.match({
          Test: 1,
        }),
      ).should.equal(true);
    });
  });

  describe('#debug', () => {
    it('calls #log with correct level', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.debug('Testing');
      logger.log.calledWith(logLevel.DEBUG).should.equal(true);
    });

    it('calls #log with correct properties', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.debug('Testing', { Test: 1 });
      logger.log.calledWith(
        sinon.match.any,
        'Testing',
        sinon.match({
          Test: 1,
        }),
      ).should.equal(true);
    });
  });

  describe('#information', () => {
    it('calls #log with correct level', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.information('Testing');
      logger.log.calledWith(logLevel.INFORMATION).should.equal(true);
    });

    it('calls #log with correct properties', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.information('Testing', { Test: 1 });
      logger.log.calledWith(
        sinon.match.any,
        'Testing',
        sinon.match({
          Test: 1,
        }),
      ).should.equal(true);
    });
  });

  describe('#warning', () => {
    it('calls #log with correct level', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.warning('Testing');
      logger.log.calledWith(logLevel.WARNING).should.equal(true);
    });

    it('calls #log with correct properties', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.warning('Testing', { Test: 1 });
      logger.log.calledWith(
        sinon.match.any,
        'Testing',
        sinon.match({
          Test: 1,
        }),
      ).should.equal(true);
    });
  });

  describe('#error', () => {
    it('calls #log with correct level', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.error('Testing');
      logger.log.calledWith(logLevel.ERROR).should.equal(true);
    });

    it('calls #log with correct properties', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.error('Testing', { Test: 1 });
      logger.log.calledWith(
        sinon.match.any,
        'Testing',
        sinon.match({
          Test: 1,
        }),
      ).should.equal(true);
    });
  });

  describe('#fatal', () => {
    it('calls #log with correct level', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.fatal('Testing');
      logger.log.calledWith(logLevel.FATAL).should.equal(true);
    });

    it('calls #log with correct properties', () => {
      const logger = new Logger();
      sinon.spy(logger, 'log');

      logger.fatal('Testing', { Test: 1 });
      logger.log.calledWith(
        sinon.match.any,
        'Testing',
        sinon.match({
          Test: 1,
        }),
      ).should.equal(true);
    });
  });
});
