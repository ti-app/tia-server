const treeHealth = {
  HEALTHY: 'healthy',
  ADEQUATE: 'adequate',
  AVERAGE: 'average',
  WEAK: 'weak',
  DEAD: 'almostDead',
};

const activityType = {
  addPlant: 'PLANT_ADDED',
  deletePlant: 'PLANT_DELETED',
  waterPlant: 'PLANT_WATERED',
  updatePlant: 'PLANT_UPDATED',
  fertilizePlant: 'PLANT_FERTILIZED',
};

module.exports = {
  treeHealth,
  activityType,
};
