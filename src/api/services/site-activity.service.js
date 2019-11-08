const repository = require('../repository');
const Context = require('../services/context.service');

class SiteActivityService {
  addSiteActivity(siteIDs, activityType, insert = false) {
    console.log('TCL: SiteActivityService -> addsiteActivity -> activityType', activityType);
    return repository.addActivity(siteIDs, this._tositeActivity(activityType), insert);
  }

  _tositeActivity(activityType) {
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

module.exports = new SiteActivityService();
