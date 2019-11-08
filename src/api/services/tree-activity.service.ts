import * as repository from '@repository/mongo/tree-activity.collection';
import Context from '@services/context.service';

class TreeActivityService {
  addTreeActivity(treeIds: string[], activityType: string, insert: boolean = false) {
    console.log('TCL: TreeActivityService -> addTreeActivity -> activityType', activityType);
    return repository.addActivity(treeIds, this.toTreeActivity(activityType), insert);
  }

  private toTreeActivity(activityType: string) {
    return {
      activity: activityType,
      date: new Date().getTime(),
      user: {
        id: Context.get('user').user_id,
        name: Context.get('user').displayName,
      },
    };
  }
}

export default new TreeActivityService();
