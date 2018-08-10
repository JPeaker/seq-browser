module.exports = class Transport {
  constructor(serverUrl, apiKey = null) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;

    this.logBuffer = [];
  }

  writeToSeq(level, template, data) {
    const seqLog = {
      '@t': (new Date()).toISOString(),
      '@l': level,
      '@mt': template,
    };

    Object.keys(data).forEach((key) => {
      seqLog[key] = data[key];
    });

    this.logBuffer.push(seqLog);
    this.send();
  }

  convertLogBufferToString() {
    const jsonString = this.logBuffer.map(l => JSON.stringify(l)).join('\n');
    this.logBuffer = [];

    return jsonString;
  }

  send() {
    if (!this.serverUrl || this.logBuffer.length === 0) {
      return;
    }

    const jsonString = this.convertLogBufferToString();

    const apiKeyParam = this.apiKey ? `&apiKey=${this.apiKey}` : '';

    fetch(`${this.serverUrl}/api/events/raw?clef${apiKeyParam}`, {
      method: 'POST',
      body: jsonString,
    });
  }
};
