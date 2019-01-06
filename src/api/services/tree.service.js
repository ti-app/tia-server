const repository = require('../repository');

class TreeService {
  /**
   * This function is the partial mock of haversine formula.
   * ky is used to structure the cosine properly
   */
  arePointsNear(checkPoint, centerPoint, km) {
    /**
     * Earth's equitorial circumferance is approx 40000km
     * latitude/longitude breaks at 360 degrees
     * So, one degree is 40000 / 360 approx 111 .
     * CONCEPT: For short distances we are calculating flat surface calculations.
     * TODO:  We have to calculate how to manage terrains lat lng
     */

    const ky = 40000 / 360;
    const kx = Math.cos((Math.PI * centerPoint.lat) / 180.0) * ky;
    const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
  }

  createMultiple(trees) {
    return repository.addNewTree(trees);
  }

  allTrees() {
    return repository.fetchAllTrees();
  }

  allTreesLocation(lng, lat) {
    return repository.fetchAllTreesByLocation(lng, lat);
  }

  allTreesByLocation(location, radius = 1) {
    return new Promise(async (resolve, reject) => {
      repository
        .fetchAllTrees()
        .then((tree) => {
          const boolArray = tree.map((treeLocation) =>
            this.arePointsNear(treeLocation.location, location, radius)
          );
          const filteredTree = tree.filter((obj, i) => boolArray[i] === true);
          return filteredTree;
        })
        .then(resolve);
    });
  }
}

module.exports = new TreeService();
