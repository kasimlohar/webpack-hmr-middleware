const HmrServer = require('./HmrServer');

/**
 * @typedef {Object} HmrOptions
 * @property {number} [port=3001] - WebSocket server port
 * @property {number} [updateCount=0] - Number of updates processed
 * @property {boolean} [injectClient=true] - Whether to inject client script
 */

const hmrServer = new HmrServer(3001);

/**
 * Creates an Express middleware for Hot Module Replacement
 * @param {HmrOptions} options - Configuration options
 */
function hmrMiddleware(options = {}) {
  const {
    port = 3001,
    updateCount = 0,
    injectClient = true
  } = options;

  return (req, res, next) => {
    if (req.path === '/hmr-status') {
      return res.json({
        active: true,
        port,
        clients: hmrServer.clients.size,
        updateCount,
        timestamp: Date.now()
      });
    }

    // Inject client script for HTML responses
    const originalSend = res.send;
    res.send = function(body) {
      if (injectClient && 
          typeof body === 'string' && 
          res.get('Content-Type')?.includes('html')) {
        const script = `
          <script>
            const ws = new WebSocket('ws://localhost:${port}');
            ws.onmessage = (event) => {
              const message = JSON.parse(event.data);
              if (message.type === 'reload') {
                window.location.reload();
              }
            };
          </script>
        `;
        body = body.replace('</head>', script + '</head>');
      }
      return originalSend.call(this, body);
    };

    next();
  };
}

module.exports = hmrMiddleware;
