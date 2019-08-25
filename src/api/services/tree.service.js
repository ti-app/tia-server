const repository = require('../repository');
const { treeHealth } = require('../../constants');

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

  updateTreeHealthByID(treeID) {
    return repository.updateTreeAfterWatering(treeID);
  }

  deleteTree(treeID) {
    return repository.deleteTree(treeID);
  }

  fetchTreeForIds(treeIDs) {
    return repository.fetchTreeForIds(treeIDs);
  }

  updateTree(treeDetails) {
    return repository.updateTree(treeDetails);
  }

  getCurrentTreeHealth(allTrees) {
    const numColors = 5;
    allTrees.forEach((tree) => {
      const currentDate = new Date().getTime();
      const { healthCycle, lastActivityDate } = tree;

      // Temporary condition: Remove once all healthCycle is in Integer
      let healthCycleInt;
      if (typeof healthCycle === 'string') {
        const str = healthCycle.match(/\d+/g, '') + '';
        healthCycleInt = str.split(',').join('');
      } else {
        healthCycleInt = healthCycle;
      }
      // TODO: Remove till here and change the variable healthCycleInt to healthCycle on line 48.
      const cycleHours = healthCycleInt * 24;
      const hours = (currentDate - lastActivityDate) / 36e5;

      if (hours < cycleHours / numColors) {
        tree.health = treeHealth.HEALTHY;
      } else if (cycleHours / numColors < hours && hours < (2 * cycleHours) / numColors) {
        tree.health = treeHealth.ADEQUATE;
      } else if ((2 * cycleHours) / numColors < hours && hours < (3 * cycleHours) / numColors) {
        tree.health = treeHealth.AVERAGE;
      } else if ((3 * cycleHours) / numColors < hours && hours < (4 * cycleHours) / numColors) {
        tree.health = treeHealth.WEAK;
      } else {
        tree.health = treeHealth.DEAD;
      }
      repository.updateTree(tree);
    });

    return allTrees;
  }
}

module.exports = new TreeService();
