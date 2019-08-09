const repository = require('../repository');

class TreeGroupService {
  createTreeGroup(treeGroup) {
    return repository.addNewTreeGroup(treeGroup);
  }

  addTreesToGroup(treeIds, groupId) {
    return repository.addTreesToGroup(treeIds, groupId);
  }

  fetchTreeGroups(lat, lng, radius, health) {
    return repository.fetchTreeGroups(lat, lng, radius, health);
  }

  isTreeExistOnCoordinate(lat, lng) {
    return repository.isTreeExistOnCoordinate(lat, lng);
  }
}

module.exports = new TreeGroupService();
