/**
 * Input: {
 *  'key-one':'value-one',
 *  'key-two':'value-two',
 *  'key-three':'value-three'
 * }
 * Output: ['value-one', 'value-two', 'value-three']
 */
module.exports = (obj) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  if (typeof obj === 'object') return Object.keys(obj).map((aKey) => obj[aKey]);
  throw new Error(`to-array requires an object. got: '${typeof obj}'`);
};
