# Webpack HMR Middleware

A lightweight Hot Module Replacement (HMR) middleware for Webpack that enables real-time module updates without full page reloads.

## Features

- 🔥 Hot Module Replacement
- 📡 WebSocket-based updates
- 🔄 File watching capability
- 🛠 Express middleware integration
- ⚡ Fast and lightweight
- 🧪 Well-tested components

## Installation

```bash
npm install webpack-hmr-middleware --save-dev
```

## Usage

### Basic Setup

```javascript
const express = require('express');
const hmrMiddleware = require('webpack-hmr-middleware');

const app = express();

// Add HMR middleware
app.use(hmrMiddleware({
  port: 3001,
  injectClient: true
}));
```

### Webpack Plugin Configuration

```javascript
const HmrWebpackPlugin = require('webpack-hmr-middleware/HmrWebpackPlugin');

module.exports = {
  // ... webpack config
  plugins: [
    new HmrWebpackPlugin({
      port: 3001
    })
  ]
};
```

## API Reference

### HmrMiddleware Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| port | number | 3001 | WebSocket server port |
| injectClient | boolean | true | Auto-inject client script |
| updateCount | number | 0 | Initial update counter |

### HmrWebpackPlugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| port | number | 3001 | WebSocket server port |

### FileWatcher Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| watchDir | string | 'src' | Directory to watch |
| port | number | 3001 | WebSocket server port |
| ignored | RegExp | /node_modules/ | Ignored patterns |

## Components

- **HmrServer**: WebSocket server managing client connections
- **HmrMiddleware**: Express middleware for serving HMR status and client script
- **FileWatcher**: File system watcher for detecting changes
- **HmrWebpackPlugin**: Webpack plugin for compilation updates

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Testing

The project includes comprehensive tests for all components:
- WebSocket server functionality
- Middleware behavior
- File watching capabilities
- Webpack plugin integration

Run tests with coverage:
```bash
npm test -- --coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Webpack](https://webpack.js.org/) for the amazing bundler
- [ws](https://github.com/websockets/ws) for the WebSocket implementation
- [chokidar](https://github.com/paulmillr/chokidar) for file watching
