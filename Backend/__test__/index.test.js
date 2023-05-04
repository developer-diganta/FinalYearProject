const app = require('../index');
const request = require('supertest');
const assert = require('assert');
// const models = require("../Database/models");

describe('langauge retrieval', () => {
  it('returns status code 200', async () => {
    const res = await request(app).get('/languages');

    expect(res.statusCode).toEqual(200);
  });
});

