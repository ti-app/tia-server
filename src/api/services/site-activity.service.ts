import * as repository from '@repository/mongo/tree-activity.collection'; // change it to site-activity.collection
import Context from '@services/context.service';

class SiteActivityService {
  addSiteActivity(siteIds: string[], activityType: string, insert = false) {
    console.log('TCL: SiteActivityService -> addSiteActivity -> activityType', activityType);
    return repository.addActivity(siteIds, this.toSiteActivity(activityType), insert);
  }

  private toSiteActivity(activityType: string) {
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

export default new SiteActivityService();
