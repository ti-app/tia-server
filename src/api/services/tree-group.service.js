const repository = require('../repository');
const common = require('../../constants/constants.common');

class TreeGroupService {
  createTreeGroup(treeGroup) {
    return repository.addNewTreeGroup(treeGroup);
  }

  addTreesToGroup(treeIds, groupId) {
    return repository.addTreesToGroup(treeIds, groupId);
  }

  fetchTreeGroups(lat, lng, radius, health, uid) {
    return repository.fetchTreeGroups(lat, lng, radius, health, uid);
  }

  isTreeExistOnCoordinate(lat, lng) {
    return repository.isTreeExistOnCoordinate(lat, lng);
  }

  addedByModerator(role) {
    return role === common.roles.MODERATOR;
  }
}

module.exports = new TreeGroupService();
