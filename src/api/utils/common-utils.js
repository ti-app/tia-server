const { treeHealthValue } = require('../../constants');

const invertObject = (object) => {
  return Object.keys(object).reduce(
    (obj, key) => Object.assign({}, obj, { [object[key]]: key }),
    {}
  );
};

const toTreeHealth = (healthValue) => {
  return invertObject(treeHealthValue)[healthValue];
};

const toTreeHealthValue = (health) => {
  return treeHealthValue[health];
};

module.exports = {
  toTreeHealth,
  toTreeHealthValue,
};
