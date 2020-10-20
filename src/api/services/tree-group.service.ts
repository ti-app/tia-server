import * as repository from '@repository/mongo/tree-group.collection';
import constants from '@constants';
import Context from '@services/context.service';
import { toTreeHealthValue } from '@utils/common-utils';

const { roles, treeHealth, activityType } = constants;

class TreeGroupService {
  createTreeGroup(treeGroup: any) {
    return repository.addNewTreeGroup(treeGroup);
  }

  addTreesToGroup(treeIds: string[], groupId: string) {
    return repository.addTreesToGroup(treeIds, groupId);
  }

  fetchTreeGroups(lat: number, lng: number, radius: number, health: string, user: any) {
    return repository.fetchTreeGroups(lat, lng, radius, health, user);
  }

  isTreeExistOnCoordinate(lat: number, lng: number) {
    return repository.isTreeExistOnCoordinate(lat, lng);
  }

  addedByModerator(role: string) {
    return role === roles.MODERATOR;
  }

  updateModApprovalStatus(groupId: string, approve: boolean) {
    return repository.updateModApprovalStatus(groupId, approve);
  }

  getTreesOfGroup(treeId: string) {
    return repository.getTreesOfGroup(treeId);
  }

  updateTreeGroup(groupId: string, updateBody: any) {
    return repository.updateTreeGroup(groupId, updateBody);
  }

  updateMultipleTreeGroup(groupIds: any, updateBody: any) {
    return repository.updateMultipleTreeGroup(groupIds, updateBody);
  }

  deleteTreeGroup(groupId: any) {
    const user = Context.get('user');
    const isRequestModApproved = user.role === roles.MODERATOR;
    return repository.deleteTreeGroup(groupId, user.user_id, isRequestModApproved);
  }

  updateModDeleteStatus(groupId: string, deleteApprove: boolean) {
    return repository.updateModDeleteStatus(groupId, deleteApprove);
  }

  rejectTreeGroupDelete(groupId: string) {
    return repository.rejectTreeGroupDelete(groupId);
  }

  waterTreesOfGroup(groupId: string) {
    const treeHealthObj = {
      health: treeHealth.HEALTHY,
      healthValue: toTreeHealthValue(treeHealth.HEALTHY),
      lastActivityDate: new Date().getTime(),
      lastActivityType: activityType.WATER_TREE,
    };

    return repository.waterTreesOfGroup(groupId, treeHealthObj);
  }

  fetchTreeGroupClusters(bbox: string, zoom: number, user: any) {
    return repository.fetchTreeGroupsV2(bbox, zoom, user);
  }

  waterTreesOfMultipleGroups(groupIds: [{ id: string }]) {
    const treeHealthObj = {
      health: treeHealth.HEALTHY,
      healthValue: toTreeHealthValue(treeHealth.HEALTHY),
      lastActivityDate: new Date().getTime(),
      lastActivityType: activityType.WATER_TREE,
    };

    return repository.waterTreesOfMultipleGroups(groupIds, treeHealthObj);
  }
}

export default new TreeGroupService();
