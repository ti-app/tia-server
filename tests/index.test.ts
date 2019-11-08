import request from 'supertest';
import app from '../src/config/express';

describe('Pass', () => {
  it('should true be equal to true', () => {
    expect(true).toEqual(true);
  });
});

describe('Server Status', () => {
  it('should check server status', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('OK');
  });
});
