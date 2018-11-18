const repository = require('../repository');

class TreeService {
  static create(tree) {
    repository.addNewTree(tree);
  }
}

module.exports = { TreeService };
