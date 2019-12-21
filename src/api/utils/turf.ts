// @ts-ignore
import turfCenter from '@turf/center';
import { point, featureCollection } from '@turf/helpers';

export const getCenterOfCoordinates = (coordinates: any[]) => {
  const turfPoints = coordinates.map((coordinate) => {
    return point([coordinate.lng, coordinate.lat]);
  });

  const pointsCollection = featureCollection(turfPoints);
  return turfCenter(pointsCollection).geometry.coordinates;
};
