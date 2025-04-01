const HmrServer = require('./HmrServer');

/**
 * Webpack plugin for Hot Module Replacement
 */
class HmrWebpackPlugin {
  /**
   * @param {Object} options
   * @param {number} [options.port=3001] - WebSocket server port
   */
  constructor(options = {}) {
    this.port = options.port || 3001;
    this.hmrServer = new HmrServer(this.port);
    this.previousModules = new Set();
  }

  apply(compiler) {
    // Track compilation start
    compiler.hooks.invalid.tap('HmrWebpackPlugin', (filePath) => {
      try {
        this.hmrServer.broadcast({
          type: 'compile-start',
          file: filePath,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error broadcasting compile start:', error);
      }
    });

    // Handle compilation completion
    compiler.hooks.done.tap('HmrWebpackPlugin', (stats) => {
      try {
        const compilation = stats.compilation;
        const changedModules = this.getChangedModules(compilation);

        this.hmrServer.broadcast({
          type: 'update',
          hash: stats.hash,
          modules: changedModules,
          errors: stats.hasErrors() ? stats.toString('errors-only') : null,
          timestamp: Date.now()
        });

        this.updatePreviousModules(compilation);
      } catch (error) {
        console.error('Error processing compilation:', error);
      }
    });
  }

  /**
   * Identifies changed modules in the compilation
   * @private
   */
  getChangedModules(compilation) {
    const currentModules = new Set();
    const changedModules = [];

    compilation.modules.forEach(module => {
      const moduleId = module.identifier();
      currentModules.add(moduleId);

      if (!this.previousModules.has(moduleId)) {
        changedModules.push({
          id: moduleId,
          name: module.readableIdentifier(compilation.requestShortener),
          hash: module.hash
        });
      }
    });

    return changedModules;
  }

  /**
   * Updates the set of tracked modules
   * @private
   */
  updatePreviousModules(compilation) {
    this.previousModules.clear();
    compilation.modules.forEach(module => {
      this.previousModules.add(module.identifier());
    });
  }
}

module.exports = HmrWebpackPlugin;
