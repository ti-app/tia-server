const repository = require('../repository');
const common = require('../../constants/constants.common');
const Context = require('../services/context.service');

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

  updateModApprovalStatus(groupID, approve) {
    return repository.updateModApprovalStatus(groupID, approve);
  }

  getTreesOfGroup(groupId) {
    return repository.getTreesOfGroup(groupId);
  }

  updateTreeGroup(groupId, updateBody) {
    return repository.updateTreeGroup(groupId, updateBody);
  }

  deleteTreeGroup(groupId) {
    const user = Context.get('user');
    const isRequestModApproved = user.role === common.roles.MODERATOR;
    return repository.deleteTreeGroup(groupId, user.user_id, isRequestModApproved);
  }

  updateModDeleteStatus(groupId, deleteApprove) {
    return repository.updateModDeleteStatus(groupId, deleteApprove);
  }

  rejectTreeGroupDelete(groupId) {
    return repository.rejectTreeGroupDelete(groupId);
  }
}

module.exports = new TreeGroupService();
