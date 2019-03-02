const repository = require('../repository');

class TreeService {
  addMultipleTrees(trees) {
    return repository.addNewTrees(trees);
  }

  allTrees(lat, lng, radius, health) {
    return repository.fetchAllTrees(lat, lng, radius, health);
  }

  allTreesByLocation(lng, lat, distance) {
    return repository.fetchAllTreesByLocation(lng, lat, distance);
  }
}

module.exports = new TreeService();
