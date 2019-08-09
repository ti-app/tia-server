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

  getCurrentTreeHealth(allTrees) {
    allTrees.forEach((tree) => {
      const currentDate = new Date().getTime();
      const { healthCycle, lastActivityDate, health } = tree;
      const cycleHours = healthCycle * 24;
      const hoursDiff = (currentDate - lastActivityDate) / 36e5;
    });

    return allTrees;
  }
}

module.exports = new TreeService();
