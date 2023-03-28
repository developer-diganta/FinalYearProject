const app = require('../index');
const request = require('supertest');
const assert = require('assert');
describe('langauge retrieval', () => {
  it('returns status code 200', async () => {
    const res = await request(app).get('/languages');

    expect(res.statusCode).toEqual(200);
  });
});

describe('university retrieval', () => {
  it('returns university with id 64176c294ca5172ae9a6b1c3', async () => {
    const res = await (await request(app).post('/university/details').
      send({ universityId: '64176c294ca5172ae9a6b1c3' }).set('Accept', 'application/json').
      expect('Content-Type', /json/).
      expect(200).
      then(response => {
        assert(response._body.universityDetails.email, 'makautwb@gmail.com')
      })
    )
  })
})