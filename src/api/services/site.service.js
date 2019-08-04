const repository = require('../repository');

class SiteService {
  static create(site) {
    repository.addNewSite(site);
  }

  static allSites() {
    return repository.allSites();
  }
}

module.exports = { SiteService };
