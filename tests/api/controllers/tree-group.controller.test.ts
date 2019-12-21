import { request } from '../../import-helper';
import { initDB, disconnectDB, authorizeRequestAs } from '../../test-helper';
import { MOD_USER, defaultHeaders } from '../../test-constants';

const TREE_GROUP_ROUTE = '/v1/tree_group';

beforeAll(async () => {
  await initDB();
});

describe('Tree Group', () => {
  describe('Fetch tree groups', () => {
    beforeEach(() => {
      authorizeRequestAs(MOD_USER);
    });

    it('Fetch nearby tree groups', async (done) => {
      const res = await request
        .get(`${TREE_GROUP_ROUTE}?lat=52.2946464&lng=4.8491735&radius=50000`)
        .set(defaultHeaders)
        .send();
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      done();
    });
  });
});

afterAll(async () => {
  await disconnectDB();
});
