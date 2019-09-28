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
    return repository.updateTree(siteID, updateBody);
  }
  addedByModerator(role) {
    return role === common.roles.MODERATOR;
  }

  deletedByModerator(role) {
    return role === common.roles.MODERATOR;
  }

  updateModDeleteStatus(treeID, deleteApprove) {
    return repository.updateModDeleteStatus(treeID, deleteApprove);
  }

  rejectSiteDelete(treeID) {
    return repository.rejectTreeDelete(treeID);
  }
}

module.exports = new SiteService();
