const WebSocket = require('ws');
const HmrServer = require('../src/HmrServer');
const path = require('path');
const fs = require('fs').promises;

describe('HMR Server Tests', () => {
  let hmrServer;
  let wsClient;
  const TEST_PORT = 3002;
  const TEST_FILE = path.join(__dirname, 'test-file.js');

  beforeAll((done) => {
    hmrServer = new HmrServer(TEST_PORT);
    wsClient = new WebSocket(`ws://localhost:${TEST_PORT}`);
    wsClient.on('open', () => done());
  });

  afterAll(async () => {
    wsClient.close();
    hmrServer.close();
    try {
      await fs.unlink(TEST_FILE);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  test('Broadcasts file change event', (done) => {
    wsClient.on('message', (data) => {
      const msg = JSON.parse(data);
      expect(msg).toEqual({
        type: 'file-change',
        path: 'test-file.js'
      });
      done();
    });

    hmrServer.broadcast({ type: 'file-change', path: 'test-file.js' });
  });

  test('Handles connection errors gracefully', (done) => {
    const badClient = new WebSocket(`ws://localhost:${TEST_PORT}`);
    
    badClient.on('open', () => {
      badClient.terminate(); // Force an error
    });

    badClient.on('error', () => {
      expect(hmrServer.clients.size).toBe(1); // Only original client remains
      done();
    });
  });

  test('Maintains active client connections', () => {
    expect(hmrServer.clients.size).toBe(1);
    expect(wsClient.readyState).toBe(WebSocket.OPEN);
  });
});
