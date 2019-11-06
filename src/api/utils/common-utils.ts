import constants from '../../constants';

const { treeHealthValue } = constants;

const invertObject = (object: any): any => {
  return Object.keys(object).reduce(
    (obj: any, key: string) => Object.assign({}, obj, { [object[key]]: key }),
    {}
  );
};

export const toTreeHealth = (healthValue: number): string => {
  return invertObject(treeHealthValue)[healthValue];
};

export const toTreeHealthValue = (health: string): number => {
  return treeHealthValue[health];
};
