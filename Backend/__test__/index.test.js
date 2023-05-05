const app = require('../index');
const request = require('supertest');
const assert = require('assert');
const models = require("../Database/models");
// const models = require('../models'); // assuming you have defined the University model in a models file
const bcrypt = require('bcrypt');
const saltRounds = 10; // assuming you are using 10 salt rounds for hashing
const sampleId = "64176c294ca5172ae9a6b1c3";
const jwt = require("jsonwebtoken");
// describe('langauge retrieval', () => {
//   it('returns status code 200', async () => {
//     const res = await request(app).get('/languages');

//     expect(res.statusCode).toEqual(200);
//   });
// });


describe('universitySignUp', () => {
  beforeAll(async () => {
    // connect to the database here if necessary
  });

  afterAll(async () => {
    // disconnect from the database here if necessary
  });

  afterEach(async () => {
    // clear the University collection after each test
    await models.University.deleteMany();
  });

  it('returns 200 and token for a new university', async () => {
    const res = await request(app)
      .post('/university/signup')
      .send({
        name: 'Test University',
        email: 'testuniversity@example.com',
        password: 'password123',
        phone: '1234567890'
      })
      .expect(200);

    expect(res.body.auth).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body._id).toBeDefined();
  });

  it('returns 400 for an existing university', async () => {
    const existingUniversity = new models.University({
      name: 'Test University',
      email: 'testuniversity@example.com',
      password: await bcrypt.hash('password123', saltRounds),
      phone: '1234567890',
      contract: [{ status: 'waitlist' }]
    });
    await existingUniversity.save();

    const res = await request(app)
      .post('/university/signup')
      .send({
        name: 'Test University',
        email: 'testuniversity@example.com',
        password: 'password123',
        phone: '1234567890'
      })
      .expect(400);

    expect(res.body.message).toBe('University already exists');
  });

  it('returns 403 for a deleted university', async () => {
    const deletedUniversity = new models.University({
      name: 'Test University',
      email: 'testuniversity@exampl22e.com',
      password: await bcrypt.hash('password123', saltRounds),
      phone: '1234567890',
      isdeleted: true,
      contract: [{ status: 'waitlist' }]
    });
    await deletedUniversity.save();

    const res = await request(app)
      .post('/university/signup')
      .send({
        name: 'Test University',
        email: 'testuniversity@exampl22e.com',
        password: 'password123',
        phone: '1234567890'
      })
      .expect(403);

    expect(res.body.message).toBe('University Currently Moved To Trash. Please contact administrator');
  });
});



describe("universityLogin function", () => {
  beforeAll(async () => {
    // create a university for testing
    const password = "password123"; // password to hash
    const saltRounds = 10; // number of salt rounds for password hashing
    const hash = await bcrypt.hash(password, saltRounds); // hash the password
    const university = new models.University({
      name: "Test University",
      email: "testuniversity@gmail.com",
      password: hash,
      phone: "1234567890",
      contract: [{ status: "waitlist" }],
    });
    await university.save(); // save the university to the database
  });

  afterAll(async () => {
    // remove the university after testing
    await models.University.deleteOne({ email: "testuniversity@gmail.com" });
  });

  it("should return a token when valid credentials are provided", async () => {
    const response = await request(app)
      .post("/university/signin")
      .send({
        email: "testuniversity@gmail.com",
        password: "password123",
      })
      .expect(200);

    expect(response.body.auth).toBeTruthy();
    expect(response.body.token).toBeDefined();
  });

  it("should return an error when invalid password is provided", async () => {
    const response = await request(app)
      .post("/university/signin")
      .send({
        email: "testuniversity@gmail.com",
        password: "wrongpassword",
      })
      .expect(400);

    expect(response.body.message).toBe("Invalid password");
  });

  it("should return an error when invalid email is provided", async () => {
    const response = await request(app)
      .post("/university/signin")
      .send({
        email: "invalidemail@gmail.com",
        password: "password123",
      })
      .expect(400);

    expect(response.body.message).toBe("Invalid email");
  });

  it("should return an error when university is deleted", async () => {
    // set isdeleted property of the university to true
    await models.University.updateOne(
      { email: "testuniversity@gmail.com" },
      { isdeleted: true }
    );

    const response = await request(app)
      .post("/university/signin")
      .send({
        email: "testuniversity@gmail.com",
        password: "password123",
      })
      .expect(403);

    expect(response.body.message).toBe(
      "University Currently Moved To Trash. Please contact administrator"
    );
  });
});


describe("POST /university/addSchool", () => {
  let university, token;

  beforeAll(async () => {
    // Create a test university and generate a JWT token for it
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
    console.log({ token })
  });

  afterAll(async () => {
    // Delete the test university and its associated schools
    await models.University.findByIdAndDelete(university._id);
    await models.School.deleteMany({ university: university._id });
  });

  it("should add a new school to a valid university", async () => {
    const response = await request(app)
      .post("/university/addSchool")
      .set("Content-Type", "application/json")
      .set('x-auth-token', token)
      .send({ email: university.email, schoolName: "Test School", universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("School added successfully");

    const school = await models.School.findOne({ name: "Test School" });
    expect(school).toBeDefined();
    expect(school.university).toEqual(university._id.toString());
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/addSchool")
      .set("x-auth-token", token)
      .send({ email: university.email, schoolName: "Test School", universityId: "64176c294ca5172ae9a6b1c3" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/addSchool")
      .send({ schoolName: "Test School", universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});



describe("POST /university/addDepartment", () => {
  let university, school, token;

  beforeAll(async () => {
    // Create a test university, school and generate a JWT token for it
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    school = await models.School.create({
      name: "Test School",
      university: university._id,
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university, school and its associated departments
    await models.University.findByIdAndDelete(university._id);
    await models.School.findByIdAndDelete(school._id);
    await models.Department.deleteMany({ university: university._id });
  });

  it("should add a new department to a valid university and school", async () => {
    const response = await request(app)
      .post("/university/addDepartment")
      .set("x-auth-token", token)
      .send({ email: university.email, departmentName: "Test Department", universityId: university._id, schoolId: school._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Department added successfully");

    const department = await models.Department.findOne({ name: "Test Department" });
    expect(department).toBeDefined();
    expect(department.university).toEqual(university._id.toString());
    expect(department.school).toEqual(school._id.toString());
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/addDepartment")
      .set("x-auth-token", token)
      .send({ email: university.email, departmentName: "Test Department", universityId: sampleId, schoolId: school._id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an invalid school ID", async () => {
    const response = await request(app)
      .post("/university/addDepartment")
      .set("x-auth-token", token)
      .send({ email: university.email, departmentName: "Test Department", universityId: university._id, schoolId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid School Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/addDepartment")
      .send({ email: university.email, departmentName: "Test Department", universityId: university._id, schoolId: school._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});