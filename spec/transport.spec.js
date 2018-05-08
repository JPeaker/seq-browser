const sinon = require('sinon');
require('chai').should();

const logLevel = require('../src/log-level');
const Transport = require('../src/transport');

describe('Transport', () => {
  describe('#writeToSeq', () => {
    it('calls send', () => {
      const transport = new Transport();
      sinon.spy(transport, 'send');

      transport.writeToSeq(logLevel.ERROR, 'Testing', {});
      transport.send.called.should.equal(true);
    });

    it('adds correct log to buffer', () => {
      global.fetch = sinon.spy();

      const transport = new Transport();
      sinon.stub(transport, 'send');
      const before = new Date();
      transport.writeToSeq(logLevel.WARNING, 'Testing Hi', {});
      const after = new Date();

      Date.parse(transport.logBuffer[0]['@t']).should.be.at.least(before.getTime());
      Date.parse(transport.logBuffer[0]['@t']).should.be.at.most(after.getTime());
      transport.logBuffer[0].should.include({
        '@l': 'Warning',
        '@mt': 'Testing Hi',
      });
    });

    it('adds correct structured data to buffer', () => {
      global.fetch = sinon.spy();

      const transport = new Transport();
      sinon.stub(transport, 'send');
      transport.writeToSeq(logLevel.WARNING, 'Stuff', {
        Test: 0,
        'More Testing': false,
        Another: 12345.54321,
      });

      transport.logBuffer[0].should.include({
        Test: 0,
        'More Testing': false,
        Another: 12345.54321,
      });
    });
  });

  describe('#convertLogBufferToString', () => {
    it('clears the log buffer', () => {
      const transport = new Transport();
      transport.writeToSeq(logLevel.INFORMATION, 'Testing', {});
      transport.convertLogBufferToString();

      transport.logBuffer.length.should.equal(0);
    });

    it('correctly parses the log buffer', () => {
      const expected =
        '{"@t":"2018-05-08T23:00:05.123Z","@l":"Debug","@mt":"Test {User}","User":"Test"}\n' +
        '{"@t":"2018-05-08T23:10:15.321Z","@l":"Fatal","@mt":"{Type}","Type":"Exception"}';

      const transport = new Transport();
      transport.logBuffer = [
        {
          '@t': '2018-05-08T23:00:05.123Z',
          '@l': 'Debug',
          '@mt': 'Test {User}',
          User: 'Test',
        },
        {
          '@t': '2018-05-08T23:10:15.321Z',
          '@l': 'Fatal',
          '@mt': '{Type}',
          Type: 'Exception',
        },
      ];

      transport.convertLogBufferToString().should.eql(expected);
    });
  });

  describe('#send', () => {
    it('doesn\'t send if serverUrl is not set', () => {
      global.fetch = sinon.spy();

      const transport = new Transport();
      transport.writeToSeq(logLevel.INFORMATION, 'Testing', {});
      transport.send();

      global.fetch.called.should.equal(false);
    });

    it('doesn\'t send if the logBugger is empty', () => {
      global.fetch = sinon.spy();

      const transport = new Transport();
      transport.serverUrl = 'https://seq.test';
      transport.send();

      global.fetch.called.should.equal(false);
    });

    it('sends logs to the correct url', () => {
      global.fetch = sinon.spy();

      const transport = new Transport();
      transport.serverUrl = 'https://seq.test';
      transport.writeToSeq(logLevel.INFORMATION, 'Testing', {});
      transport.send();

      global.fetch
        .calledWith('https://seq.test/api/events/raw?clef')
        .should.equal(true);
    });

    it('sends correct body to Seq', () => {
      global.fetch = sinon.spy();

      const transport = new Transport();
      transport.serverUrl = 'https://seq.test';
      transport.logBuffer = [
        {
          '@t': '2018-05-08T23:00:05.123Z',
          '@l': 'Debug',
          '@mt': 'Test {User}',
          User: 'Test',
        },
        {
          '@t': '2018-05-08T23:10:15.321Z',
          '@l': 'Fatal',
          '@mt': '{Type}',
          Type: 'Exception',
        },
      ];
      const expected = transport.convertLogBufferToString();

      transport.logBuffer = [
        {
          '@t': '2018-05-08T23:00:05.123Z',
          '@l': 'Debug',
          '@mt': 'Test {User}',
          User: 'Test',
        },
        {
          '@t': '2018-05-08T23:10:15.321Z',
          '@l': 'Fatal',
          '@mt': '{Type}',
          Type: 'Exception',
        },
      ];
      transport.send();

      global.fetch
        .calledWith(sinon.match.any, sinon.match({
          method: 'POST',
          body: expected,
        }))
        .should.equal(true);
    });
  });
});
