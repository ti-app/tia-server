import * as repository from '@repository/mongo/tree.collection';
import TreeActivityService from '@services/tree-activity.service';
import constants from '@constants';

const { roles } = constants;

class TreeService {
  async addMultipleTrees(trees: any[]) {
    return repository.addNewTrees(trees);
  }

  async updateTree(treeId: string, updateBody: {}, activityType: string) {
    const activityRes = await TreeActivityService.addTreeActivity([treeId], activityType);
    return repository.updateTree(treeId, updateBody);
  }

  deletedByModerator(role: string) {
    return role === roles.MODERATOR;
  }

  updateModDeleteStatus(treeId: string, deleteApprove: boolean) {
    return repository.updateModDeleteStatus(treeId, deleteApprove);
  }

  rejectTreeDelete(treeId: string) {
    return repository.rejectTreeDelete(treeId);
  }

  getTreeDetail(treeId: string) {
    return repository.singleTreeDetail(treeId);
  }
}

export default new TreeService();
