/**
 * Repository Factory
 * Creates and manages repository instances
 * Isolates database operations from business logic
 */

const UserRepository = require('./userRepository');
const AuthRepository = require('./authRepository');

class RepositoryFactory {
  static repositories = {};

  static getRepository(entityName) {
    if (!this.repositories[entityName]) {
      this.repositories[entityName] = this.createRepository(entityName);
    }
    return this.repositories[entityName];
  }

  static createRepository(entityName) {
    switch (entityName) {
      case 'User':
        return new UserRepository();
      case 'Auth':
        return new AuthRepository();
      default:
        throw new Error(`Repository for ${entityName} not found`);
    }
  }

  static registerRepository(entityName, RepositoryClass) {
    this.repositories[entityName] = new RepositoryClass();
  }
}

module.exports = RepositoryFactory;
