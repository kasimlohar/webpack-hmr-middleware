const WebSocket = require('ws');

/**
 * Hot Module Replacement Server using WebSocket
 */
class HmrServer {
  /**
   * Creates a new HMR WebSocket server
   * @param {number} port - The port to listen on
   */
  constructor(port = 3001) {
    this.wss = new WebSocket.Server({ port });
    this.clients = new Set();

    this.wss.on('connection', (client) => {
      this.clients.add(client);
      
      client.on('close', () => this.clients.delete(client));
      
      client.on('error', (error) => {
        console.error('WebSocket client error:', error);
        this.clients.delete(client);
      });
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });
  }

  /**
   * Broadcasts a message to all connected clients
   * @param {Object} message - The message to broadcast
   */
  broadcast(message) {
    const msgString = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(msgString);
        } catch (error) {
          console.error('Error broadcasting to client:', error);
          this.clients.delete(client);
        }
      }
    });
  }

  /**
   * Closes the WebSocket server
   */
  close() {
    this.wss.close();
  }
}

module.exports = HmrServer;
