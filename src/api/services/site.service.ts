import * as repository from '@repository/mongo/site.collection';
import SiteActivityService from '@services/site-activity.service';

import constants from '@constants';

const { roles } = constants;

class SiteService {
  create(site: any) {
    repository.addNewSite(site);
  }

  allSites() {
    return repository.allSites();
  }

  fetchSites(lat: number, lng: number, radius: number, user: any) {
    return repository.fetchSites(lat, lng, radius, user);
  }

  async updateSite(siteId: string, updateBody: any, activityType: string) {
    const activityRes = await SiteActivityService.addSiteActivity([siteId], activityType);
    return repository.updateSite(siteId, updateBody);
  }

  updateModApprovalStatus(siteId: string, approve: boolean) {
    return repository.updateSiteModApprovalStatus(siteId, approve);
  }

  addedByModerator(role: string) {
    return role === roles.MODERATOR;
  }

  deletedByModerator(role: string) {
    return role === roles.MODERATOR;
  }

  updateModDeleteStatus(siteId: string, deleteApprove: boolean) {
    return repository.updateModDeleteStatus(siteId, deleteApprove);
  }

  rejectSiteDelete(siteId: string) {
    return repository.rejectSiteDelete(siteId);
  }
}

export default new SiteService();
