const treeHealth = {
  HEALTHY: 'healthy',
  ADEQUATE: 'adequate',
  AVERAGE: 'average',
  WEAK: 'weak',
  DEAD: 'almostDead',
  SITE: 'plantation site',
};

const activityType = {
  addPlant: 'Plant added',
  deletePlant: 'Plant deleted',
  waterPlant: 'Plant Watered',
  updatePlant: 'Plant updated',
  fertilizePlant: 'Plant Fertilized',
};

module.exports = {
  treeHealth,
  activityType,
};
