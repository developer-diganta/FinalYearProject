const app = require('../index');
const request = require('supertest');
const assert = require('assert');
describe('langauge retrieval', () => {
  it('returns status code 200', async () => {
    const res = await request(app).get('/languages');

    expect(res.statusCode).toEqual(200);
  });
});

// describe('university retrieval', () => {
//   it('returns university with id 64176c294ca5172ae9a6b1c3', async () => {
//     const res = await (await request(app).post('/university/details').
//       send({ universityId: '64176c294ca5172ae9a6b1c3' }).set('Accept', 'application/json').
//       expect('Content-Type', /json/).
//       expect(200).
//       then(response => {
//         assert(response._body.universityDetails.email, 'makautwb@gmail.com')
//       })
//     )
//   })
// })

describe('universitySignUp', () => {
  it('should create a new university with valid input', async () => {
    const res = await request(app)
      .post('/university/signup')
      .send({
        name: 'Test University',
        email: 'test@example.com',
        password: 'password',
        phone: '555-555-5555'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.auth).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body._id).toBeTruthy();
  });

  it('should return a 400 error if university already exists', async () => {
    const res = await request(app)
      .post('/university/signup')
      .send({
        name: 'Existing University',
        email: 'existing@example.com',
        password: 'password',
        phone: '555-555-5555'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('University already exists');
  });
  // Test to be included after activating JOI validation
  // it('should return a 422 error if input is invalid', async () => {
  //   const res = await request(app)
  //     .post('/university/signup')
  //     .send({
  //       name: 'Invalid University',
  //       email: 'invalidemail',
  //       password: '',
  //       phone: ''
  //     });
  //   expect(res.statusCode).toEqual(422);
  // });
});

describe('universityLogin', () => {
  it('should log in a university with valid credentials', async () => {
    const res = await request(app)
      .post('/university/signin')
      .send({
        email: 'test@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.auth).toBe(true);
    expect(res.body.token).toBeTruthy();
    expect(res.body._id).toBeTruthy();
  });

  it('should return a 400 error if email is invalid', async () => {
    const res = await request(app)
      .post('/university/signin')
      .send({
        email: 'invalidemail',
        password: 'password'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid email');
  });

  it('should return a 400 error if password is invalid', async () => {
    const res = await request(app)
      .post('/university/signin')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid password');
  });

  it('should return a 403 error if university is deleted', async () => {
    // Assuming there is a deleted university with the email 'deleted@example.com'
    const res = await request(app)
      .post('/university/signin')
      .send({
        email: 'deleted@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('University Currently Moved To Trash. Please contact administrator');
  });
});