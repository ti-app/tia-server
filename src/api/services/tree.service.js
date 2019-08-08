const repository = require('../repository');

class TreeService {
  addMultipleTrees(trees) {
    return repository.addNewTrees(trees);
  }

  allTrees(lat, lng, radius, health) {
    return repository.fetchAllTrees(lat, lng, radius, health);
  }

  allTreesByLocation(lng, lat, distance) {
    return repository.fetchAllTreesByLocation(lng, lat, distance);
  }

  updateTreeHealthByID(treeID) {
    return repository.updateTreeAfterWatering(treeID);
  }

  deleteTree(treeID) {
    return repository.deleteTree(treeID);
  }

  fetchTreeForIds(treeIDs) {
    return repository.fetchTreeForIds(treeIDs);
  }

  updateTree(treeDetails) {
    return repository.updateTree(treeDetails);
  }
}

module.exports = new TreeService();
