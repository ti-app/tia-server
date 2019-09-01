const repository = require('../repository');
const Context = require('../services/context.service');
const { activityType: treeActivityTypes } = require('../../constants');

class TreeActivityService {
  addTreeActivity(treeIDs, activityType, insert = false) {
    console.log('TCL: TreeActivityService -> addTreeActivity -> activityType', activityType);
    return repository.addActivity(treeIDs, this._toTreeActivity(activityType), insert);
  }

  _toTreeActivity(activityType) {
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

module.exports = new TreeActivityService();
