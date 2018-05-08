# seq-browser

#### Log to [Seq](https://getseq.net/) from the browser

[![Build Status](https://travis-ci.org/ChrisH91/seq-browser.svg?branch=master)](https://travis-ci.org/ChrisH91/seq-browser)
[![Coverage Status](https://coveralls.io/repos/github/ChrisH91/seq-browser/badge.svg?branch=master)](https://coveralls.io/github/ChrisH91/seq-browser?branch=master)

## Usage

Include the Javascript file under `dist/seq-browser.js`. The project uses WebPack so it supports CommonJS/AMD/RequireJS.

If none of these are detected then it will be available under `window.seq`. A
_seq-browser_ instance is pre-instantiated for you.

#### Specify your Seq server url

```javascript
seq.serverUrl = "https://seq.logs";
```

If your Seq server requires an API key you can set this up here as well

```javascript
seq.apiKey = "12345-api-key-54321";
```

#### Logging

Any time you log with _seq-browser_ it will automatically be sent to Seq.

```javascript
seq.information('{User} logged in to {Service} at {Date}', {
  User: 'Test User',
  Service: 'My Awesome Service',
  Date: new Date()
});
```

The following log levels are available

```javascript
log.verbose();
log.debug();
log.information();
log.warning();
log.error();
log.fatal();
```
