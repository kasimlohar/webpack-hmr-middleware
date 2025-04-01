const chokidar = require('chokidar');
const path = require('path');
const HmrServer = require('./HmrServer');

class FileWatcher {
  constructor(options = {}) {
    const {
      watchDir = 'src',
      port = 3001,
      ignored = /node_modules/
    } = options;

    this.hmrServer = new HmrServer(port);
    this.watcher = chokidar.watch(watchDir, {
      ignored,
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100
      }
    });

    this.setupWatcher();
  }

  setupWatcher() {
    this.watcher
      .on('change', (filePath) => {
        console.log(`File changed: ${filePath}`);
        this.hmrServer.broadcast({
          type: 'file-change',
          path: filePath,
          timestamp: Date.now(),
          extension: path.extname(filePath)
        });
      })
      .on('error', error => {
        console.error('Watcher error:', error);
      });
  }

  close() {
    this.watcher.close();
    this.hmrServer.close();
  }
}

module.exports = FileWatcher;
