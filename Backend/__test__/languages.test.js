const app = require('../index');
const request = require('supertest');

describe('langauge retrieval', () => {
  it('returns status code 200', async () => {
    const res = await request(app).get('/languages');

      expect(res.statusCode).toEqual(200);
  });
});
