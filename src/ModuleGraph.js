/**
 * Represents a graph of modules and their dependencies
 */
class ModuleGraph {
  constructor() {
    /**
     * Map of moduleId to module data (including version)
     * @type {Map<string, {version: number}>}
     */
    this.modules = new Map();

    /**
     * Map of moduleId to its dependencies
     * @type {Map<string, string[]>}
     */
    this.dependencies = new Map();
  }

  /**
   * Adds a new module to the graph
   * @param {string} moduleId - The unique identifier for the module
   * @param {string[]} dependencies - Array of module IDs this module depends on
   */
  addModule(moduleId, dependencies = []) {
    if (!this.modules.has(moduleId)) {
      this.modules.set(moduleId, { version: 1 });
      this.dependencies.set(moduleId, dependencies);
    }
  }

  /**
   * Updates the version of an existing module
   * @param {string} moduleId - The unique identifier for the module
   */
  updateModule(moduleId) {
    if (this.modules.has(moduleId)) {
      const moduleData = this.modules.get(moduleId);
      moduleData.version++;
      this.modules.set(moduleId, moduleData);
    }
  }

  /**
   * Checks if a module has circular dependencies
   * @param {string} moduleId - The module ID to check
   * @param {Set<string>} visited - Set of visited modules
   * @returns {boolean} - True if circular dependency found
   */
  hasCircularDependency(moduleId, visited = new Set()) {
    if (visited.has(moduleId)) return true;
    visited.add(moduleId);
    const deps = this.dependencies.get(moduleId) || [];
    for (const dep of deps) {
      if (this.hasCircularDependency(dep, visited)) {
        return true;
      }
    }
    visited.delete(moduleId);
    return false;
  }
}

module.exports = ModuleGraph;
