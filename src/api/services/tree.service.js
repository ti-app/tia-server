const repository = require('../repository');

class TreeService {
  createMultiple(trees) {
    return repository.addNewTree(trees);
  }

  allTrees() {
    return repository.fetchAllTrees();
  }
}

module.exports = new TreeService();
