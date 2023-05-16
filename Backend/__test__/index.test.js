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


describe("POST /university/addProgram", () => {
  let university, department, token;

  beforeAll(async () => {
    // Create a test university, department, and generate a JWT token for it
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    department = await models.Department.create({
      name: "Test Department",
      school: "test-school-id",
      university: university._id
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university, department, and its associated programs
    await models.University.findByIdAndDelete(university._id);
    await models.Department.findByIdAndDelete(department._id);
    await models.Program.deleteMany({ university: university._id });
  });

  it("should add a new program to a valid department", async () => {
    const response = await request(app)
      .post("/university/addProgram")
      .set("x-auth-token", token)
      .send({ email: university.email, programName: "Test Program", departmentId: department._id, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Program added successfully");

    const program = await models.Program.findOne({ name: "Test Program" });
    expect(program).toBeDefined();
    expect(program.department).toEqual(department._id.toString());
    expect(program.university).toEqual(university._id.toString());
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/addProgram")
      .set("x-auth-token", token)
      .send({ email: university.email, programName: "Test Program", departmentId: department._id, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an invalid department ID", async () => {
    const response = await request(app)
      .post("/university/addProgram")
      .set("x-auth-token", token)
      .send({ email: university.email, programName: "Test Program", departmentId: sampleId, universityId: university._id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Department Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/addProgram")
      .send({ email: university.email, programName: "Test Program", departmentId: department._id, universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});

describe("POST /university/verifyCourse", () => {
  let university, course, token;

  beforeAll(async () => {
    // Create a test university, course and generate a JWT token for it
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    const department = await models.Department.create({
      name: "Test Department",
      university: university._id,
    });
    course = await models.Course.create({
      name: "Test Course",
      code: "TC101",
      description: "Test course description",
      department: department._id,
      university: university._id,
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university, course and its associated departments
    await models.University.findByIdAndDelete(university._id);
    await models.Department.deleteMany({ university: university._id });
    await models.Course.findByIdAndDelete(course._id);
  });

  it("should verify a course for a valid university", async () => {
    const response = await request(app)
      .post("/university/verifyCourse")
      .set("x-auth-token", token)
      .send({ email: university.email, courseId: course._id, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Course verified successfully");

    const verifiedCourse = await models.Course.findById(course._id);
    expect(verifiedCourse.approvalStatus).toEqual("verified");
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/verifyCourse")
      .set("x-auth-token", token)
      .send({ email: university.email, courseId: course._id, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an invalid course ID", async () => {
    const response = await request(app)
      .post("/university/verifyCourse")
      .set("x-auth-token", token)
      .send({ email: university.email, courseId: sampleId, universityId: university._id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Course Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/verifyCourse")
      .send({ email: university.email, courseId: course._id, universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});


describe("POST /university/rejectCourse", () => {
  let university, course, token;

  beforeAll(async () => {
    // Create a test university and course, and generate a JWT token for the university
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    const department = await models.Department.create({
      name: "Test Department",
      university: university._id,
    });
    course = await models.Course.create({
      name: "Test Course",
      department: department._id,
      university: university._id,
      approvalStatus: "pending",
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university, department, and course
    await models.University.findByIdAndDelete(university._id);
    await models.Department.findByIdAndDelete(course.department);
    await models.Course.findByIdAndDelete(course._id);
  });

  it("should reject a course for a valid university and course ID", async () => {
    const response = await request(app)
      .post("/university/rejectCourse")
      .set("x-auth-token", token)
      .send({ email: university.email, courseId: course._id, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Course rejected successfully");

    const updatedCourse = await models.Course.findById(course._id);
    expect(updatedCourse.approvalStatus).toBe("rejected");
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/rejectCourse")
      .set("x-auth-token", token)
      .send({ email: university.email, courseId: course._id, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an invalid course ID", async () => {
    const response = await request(app)
      .post("/university/rejectCourse")
      .set("x-auth-token", token)
      .send({ email: university.email, courseId: sampleId, universityId: university._id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Course Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/rejectCourse")
      .send({ email: university.email, courseId: course._id, universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});


describe("POST /university/details", () => {
  let university, school, department, program, course;

  beforeAll(async () => {
    // Create a test university, school, department, program, and course
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    school = await models.School.create({
      name: "Test School",
      university: university._id,
    });
    department = await models.Department.create({
      name: "Test Department",
      school: school._id,
    });
    program = await models.Program.create({
      name: "Test Program",
      department: department._id,
    });
    course = await models.Course.create({
      name: "Test Course",
      program: program._id,
      approvalStatus: "approved",
    });
  });

  afterAll(async () => {
    // Delete the test university, school, department, program, and course
    await models.University.findByIdAndDelete(university._id);
    await models.School.findByIdAndDelete(school._id);
    await models.Department.findByIdAndDelete(department._id);
    await models.Program.findByIdAndDelete(program._id);
    await models.Course.findByIdAndDelete(course._id);
  });

  it("should return the details of a university with its schools, departments, programs, and courses", async () => {
    const response = await request(app)
      .post("/university/details")
      .send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.universityDetails).toBeDefined();
    expect(response.body.universityDetails.name).toBe(university.name);
    expect(response.body.universityDetails.schools.length).toBe(1);
    expect(response.body.universityDetails.schools[0].name).toBe(school.name);
    expect(response.body.universityDetails.schools[0].departments.length).toBe(1);
    expect(response.body.universityDetails.schools[0].departments[0].name).toBe(department.name);
    expect(response.body.universityDetails.schools[0].departments[0].programs.length).toBe(1);
    expect(response.body.universityDetails.schools[0].departments[0].programs[0].name).toBe(program.name);
    expect(response.body.universityDetails.schools[0].departments[0].programs[0].courses.length).toBe(1);
    expect(response.body.universityDetails.schools[0].departments[0].programs[0].courses[0].name).toBe(course.name);
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/details")
      .send({ email: university.email, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

});

describe("POST /university/teacher", () => {
  let university, teachers, token;

  beforeAll(async () => {
    // Create a test university and teachers, and generate a JWT token for the university
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    teachers = await Promise.all([
      models.Teacher.create({
        name: "Teacher 1",
        email: "teacher1@example.com",
        university: university._id,
      }),
      models.Teacher.create({
        name: "Teacher 2",
        email: "teacher2@example.com",
        university: university._id,
      }),
    ]);
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university and teachers
    await models.University.findByIdAndDelete(university._id);
    await Promise.all(teachers.map((teacher) => models.Teacher.findByIdAndDelete(teacher._id)));
  });

  it("should return a list of teachers for a valid university ID", async () => {
    const response = await request(app)
      .post("/university/teacher")
      .set("x-auth-token", token)
      .send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe("Teacher 1");
    expect(response.body[0].email).toBe("teacher1@example.com");
    expect(response.body[1].name).toBe("Teacher 2");
    expect(response.body[1].email).toBe("teacher2@example.com");
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/teacher")
      .set("x-auth-token", token)
      .send({ email: university.email, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/teacher")
      .send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
})

describe("POST /university/teacher/count", () => {
  let university, teacher1, teacher2, token;

  beforeAll(async () => {
    // Create a test university, two teachers, and generate a JWT token for the university
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    teacher1 = await models.Teacher.create({
      name: "Test Teacher 1",
      university: university._id,
    });
    teacher2 = await models.Teacher.create({
      name: "Test Teacher 2",
      university: university._id,
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university and teachers
    await models.University.findByIdAndDelete(university._id);
    await models.Teacher.deleteMany({ university: university._id });
  });

  it("should return the correct count for a valid university ID", async () => {
    const response = await request(app)
      .post("/university/teacher/count")
      .set("x-auth-token", token)
      .send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(2);
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/teacher/count")
      .set("x-auth-token", token)
      .send({ email: university.email, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/teacher/count")
      .send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
})

describe("post /university/contract", () => {
  let university, token;

  beforeAll(async () => {
    // Create a test university and generate a JWT token for the university
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
  });

  afterAll(async () => {
    // Delete the test university
    await models.University.findByIdAndDelete(university._id);
  });

  it("should return the contract for a valid university", async () => {
    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", university._id)
    const response = await request(app)
      .post("/university/contract")
      .send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(university.contract);
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/contract")
      .send({ email: university.email, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });
});

describe("POST /university/student", () => {
  let university, token;

  beforeAll(async () => {
    // Create a test university and generate a JWT token for the university
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university
    await models.University.findByIdAndDelete(university._id);
  });

  it("should return the students for a valid university", async () => {
    // Create some test students for the university
    const students = [{ name: "John Doe", email: "johndoe@example.com", isdeleted: "false", university: university._id }, { name: "Jane Smith", email: "janesmith@example.com", university: university._id, isdeleted: "false" },];
    await models.Student.create(students);

    // Send a request to get the students for the university
    const response = await request(app)
      .post("/university/student")
      .set("x-auth-token", token)
      .send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(200);
    expect(response._body.length).toBe(2);

  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/student")
      .set("x-auth-token", token)
      .send({ email: university.email, universityId: sampleId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app).post("/university/student").send({ email: university.email, universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});

describe("POST /university/teacher/waitlist", () => {
  let token, university, teacher;

  beforeAll(async () => {
    // Create a test university
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });

    // Create a test teacher
    teacher = await models.Teacher.create({
      name: "Test Teacher",
      university: university._id,
      status: "waitlist",
      isdeleted: false,
    });

    // Generate a JWT token for the university
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university and teacher
    await models.University.findByIdAndDelete(university._id);
    await models.Teacher.findByIdAndDelete(teacher._id);
  });

  it("should return the waitlisted teachers for a valid university", async () => {
    const response = await request(app)
      .post("/university/teacher/waitlist")
      .set("x-auth-token", token)
      .send({ email: university.email,universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toEqual(teacher._id);
    expect(response.body[0].name).toEqual(teacher.name);
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/teacher/waitlist")
      .set("x-auth-token", token)
      .send({ email: university.email,universityId: "invalidId" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/teacher/waitlist")
      .send({ email: university.email,universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});


describe("POST /university/delete", () => {
  let university, token;

  beforeAll(async () => {
    // Create a test university and generate a JWT token for the university
    university = await models.University.create({
      email: "testuniversity@example.com",
      password: "password",
      name: "Test University",
    });
    token = jwt.sign({ email: university.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test university
    await models.University.findByIdAndDelete(university._id);
  });

  it("should delete a university and related data", async () => {
    const response = await request(app)
      .post("/university/delete")
      .set("x-auth-token", token)
      .send({ email: university.email,universityId: university._id });

    expect(response.status).toBe(200);
    expect(response.body.university).not.toBeNull();
    expect(response.body.teachers).not.toBeNull();
    expect(response.body.students).not.toBeNull();
    expect(response.body.program).not.toBeNull();
    expect(response.body.moocs).not.toBeNull();
    expect(response.body.department).not.toBeNull();
    expect(response.body.course).not.toBeNull();
  });

  it("should return an error for an invalid university ID", async () => {
    const response = await request(app)
      .post("/university/delete")
      .set("x-auth-token", token)
      .send({ email: university.email,universityId: "invalidId" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid University Id");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app).post("/university/delete").send({ email: university.email,universityId: university._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});


describe("POST /university/delete/teacher", () => {
  let teacher, token;

  beforeAll(async () => {
    // Create a test teacher and generate a JWT token for the university
    teacher = await models.Teacher.create({
      email: "testteacher@example.com",
      password: "password",
      name: "Test Teacher",
      university: "testuniversity@example.com",
      status: "active"
    });
    token = jwt.sign({ email: teacher.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test teacher
    await models.Teacher.findByIdAndDelete(teacher._id);
  });

  it("should delete the teacher for a valid teacher ID", async () => {
    const response = await request(app)
      .post("/university/delete/teacher")
      .set("x-auth-token", token)
      .send({ email: university.email,teacherId: teacher._id });

    expect(response.status).toBe(200);
    expect(response.body.teacher.isdeleted).toBe(true);
  });

  it("should return an error for an invalid teacher ID", async () => {
    const response = await request(app)
      .post("/university/delete/teacher")
      .set("x-auth-token", token)
      .send({ email: university.email,teacherId: "invalidId" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app).post("/university/delete/teacher").send({ email: university.email, teacherId: teacher._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});

describe("POST /university/delete/student", () => {
  let student, token;

  beforeAll(async () => {
    // Create a test student and generate a JWT token for the university
    student = await models.Student.create({
      email: "teststudent@example.com",
      password: "password",
      name: "Test Student",
      university: "test-university-id"
    });
    token = jwt.sign({ email: student.email }, process.env.SESSION_KEY);
  });

  afterAll(async () => {
    // Delete the test student
    await models.Student.findByIdAndDelete(student._id);
  });

  it("should delete the student for a valid student ID", async () => {
    const response = await request(app)
      .post("/university/delete/student")
      .set("x-auth-token", token)
      .send({ email: university.email, studentId: student._id });

    expect(response.status).toBe(200);
    expect(response.body.student.isdeleted).toBe(true);
  });

  it("should return an error for an invalid student ID", async () => {
    const response = await request(app)
      .post("/university/delete/student")
      .set("x-auth-token", token)
      .send({ email: university.email, studentId: "invalidId" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
  });

  it("should return an error for an unauthenticated user", async () => {
    const response = await request(app)
      .post("/university/delete/student")
      .send({ email: university.email, studentId: student._id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token detected");
  });
});
