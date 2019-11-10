import * as repository from '@repository/mongo/tree-activity.collection';
import Context from '@services/context.service';

class UserService {
  getUserActivity(userId: string) {
    console.log('TCL: UserActivityService -> getUserActivity', userId);
    return repository.getUserActivity(userId);
  }
}

export default new UserService();
