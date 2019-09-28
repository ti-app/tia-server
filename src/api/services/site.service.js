const repository = require('../repository');
const SiteActivityService = require('../services/site-activity.service');
const common = require('../../constants/constants.common');

class SiteService {
  create(site) {
    repository.addNewSite(site);
  }

  allSites() {
    return repository.allSites();
  }

  fetchSites(lat, lng, radius, uid) {
    return repository.fetchSites(lat, lng, radius, uid);
  }
  async updateSite(siteID, updateBody, activityType) {
    const activityRes = await SiteActivityService.addSiteActivity([siteID], activityType);
    return repository.updateSite(siteID, updateBody);
  }
  addedByModerator(role) {
    return role === common.roles.MODERATOR;
  }

  deletedByModerator(role) {
    return role === common.roles.MODERATOR;
  }

  updateModDeleteStatus(siteID, deleteApprove) {
    return repository.updateModDeleteStatus(siteID, deleteApprove);
  }

  rejectSiteDelete(siteID) {
    return repository.rejectTreeDelete(siteID);
  }
}

module.exports = new SiteService();
