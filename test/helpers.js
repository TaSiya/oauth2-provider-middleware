const puppeteer = require('puppeteer');

const buildApp = require('../sample/app');
const buildClient = require('../sample-client/client');
const buildCodeClient = require('../code-sample-client/client');

const tryToListenOnPort = (app, port) =>
  new Promise(res =>
    app
      .listen(port)
      .on('error', () => res(false))
      .on('listening', () => res(true))
  );

async function runSampleServer({ store }) {
  const app = buildApp({ store });
  let port = 2999;
  /* eslint-disable-next-line no-await-in-loop, no-plusplus, no-empty */
  while (!(await tryToListenOnPort(app, ++port))) {}
  return { app, port };
}

async function runSampleClient({ provider, clientId }) {
  const app = buildClient({ provider, clientId });
  let port = 2999;
  /* eslint-disable-next-line no-await-in-loop, no-plusplus, no-empty */
  while (!(await tryToListenOnPort(app, ++port))) {}
  return { app, port };
}

async function runCodeSampleClient({ provider, client }) {
  const app = buildCodeClient({ provider, client });
  let port = 2999;
  /* eslint-disable-next-line no-await-in-loop, no-plusplus, no-empty */
  while (!(await tryToListenOnPort(app, ++port))) {}
  return { app, port };
}

function createRandomId() {
  return Math.random()
    .toString()
    .split('.')[1];
}

let browser;
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch();
  }
  return browser;
}

module.exports = {
  runSampleServer,
  runSampleClient,
  runCodeSampleClient,
  createRandomId,
  getBrowser
};
