import * as repository from '@repository/mongo/tree-activity.collection';
import * as userCollection from '@repository/mongo/user.collection';
import Context from '@services/context.service';

class UserService {
  getUserActivity(userId: string) {
    console.log('TCL: UserActivityService -> getUserActivity', userId);
    return repository.getUserActivity(userId);
  }

  saveUserFCMToken(userId: string, fcmToken: string) {
    return userCollection.saveFCMToken(userId, fcmToken);
  }

  removeUserFCMToken(userId: string, fcmToken: string) {
    return userCollection.removeUserFCMToken(userId, fcmToken);
  }
}

export default new UserService();
