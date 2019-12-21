import { request } from './import-helper';

describe('Server Status', () => {
  it('should check server status', async () => {
    const res = await request.get('/status');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('OK');
  });
});
