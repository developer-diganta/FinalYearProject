const express = require("express");
const router = express.Router();
const axios = require("axios");
const { base64encode, base64decode } = require('nodejs-base64');
const models = require("../Database/models");
const programmingLanguageIds = require("../assets/programmingLanguageIds");
const { addSubmissionLog } = require("../utils/logger");
const saltRounds = require("../configs/saltRounds");
const bcrypt = require("bcrypt");
const { signUpSchema } = require("../configs/joi-configs.js");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/Auth/jwtGeneration");
const { model } = require("mongoose");
const PlagiarismChecker = require("../utils/PlagarismChecker/plagarismChecker");

// const passport = require("passport");
let languageIds = null;


const adminLogin = {}

const getProgrammingLanguageIds = async () => {
    languageIds = await programmingLanguageIds();
}

getProgrammingLanguageIds();

require('dotenv').config();

const home = (req, res) => {
    res.status(200).send("Hello World!");
}

const languages = async (req, res) => {
    if (!languageIds)
        languageIds = await programmingLanguageIds();
    try {
        res.status(200).json(languageIds);
    } catch (error) {
        res.status(500).json(error);
    }
}


// for running a code from the client
const submit = async (req, res) => {
    console.log(req.body.sourceCode)
    let encoded = base64encode(req.body.sourceCode);
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'true', fields: '*' },
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': `122${process.env.COMPILER_API_KEY}`,
            'X-RapidAPI-Host': `${process.env.COMPILER_API_HOST}`
        },
        data: {
            "source_code": encoded,
            "language_id": req.body.languageId,
            "stdin": req.body.sampleInput,
            "expected_output": req.body.sampleOutput
        }
    };

    axios.request(options).then(function (response) {
        const newSubmission = new models.Submission({
            token: response.data.token,
        });
        newSubmission.save((err) => {
            if (err)
                console.log(err)
            else {
                const options = {
                    method: 'GET',
                    url: 'https://judge0-ce.p.rapidapi.com/submissions/' + response.data.token,
                    params: { base64_encoded: 'true', fields: '*' },
                    headers: {
                        'X-RapidAPI-Key': `122${process.env.COMPILER_API_KEY}`,
                        'X-RapidAPI-Host': `${process.env.COMPILER_API_HOST}`
                    }
                };
                axios.request(options).then(function (response) {
                    addSubmissionLog(response.data.token);
                    res.status(200).json((response.data));
                }).catch(function (error) {
                    console.error(error);
                });
            }
        });
    }).catch(function (error) {
        console.error(error);
    });
}


const universitySignUp = async (req, res) => {
    console.log(req.body);
    const { name, email, password, phone } = req.body;
    try {
        // const validate = await signUpSchema.validateAsync({ username, password, email });
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                res.status(500).json(err);
            } else {
                models.University.find({ $or: [{ email: email }, { phone: phone }] }, async (err, university) => {
                    if (err) {
                        res.status(500).json(err);
                    } else if (university.length) {
                        console.log(university);
                        res.status(400).json({ message: "University already exists" });
                    } else {
                        const newUniversity = new models.University({
                            name: name,
                            email: email,
                            password: hash,
                            phone: phone,
                            contract: [
                                { status: "waitlist" }
                            ]
                        });
                        console.log(newUniversity);
                        newUniversity.save((err) => {
                            if (err)
                                res.status(500).json(err);
                            else {
                                const token = generateToken(email);
                                res.status(200).json({ auth: true, token: token, _id: newUniversity._id });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(422).json(error);
    }
}

const universityLogin = async (req, res) => {
    console.log(req.body.password)
    const { email, password } = req.body;
    try {
        // const validate = await signUpSchema.validateAsync({ username, password });
        models.University.find({ email: email }, async (err, university) => {
            console.log(university)
            if (err) {
                res.status(500).json(err);
            } else if (university.length) {
                bcrypt.compare(password, university[0].password, (err, result) => {
                    if (err) {
                        res.status(500).json(err);
                    } else if (result) {
                        console.log("RRR", university)
                        const token = generateToken(email);
                        res.status(200).json({ auth: true, token: token, _id: university[0]._id });
                    } else {
                        res.status(400).json({ message: "Invalid password" });
                    }
                });
            } else {
                res.status(400).json({ message: "Invalid email" });
            }
        });
    } catch (error) {
        res.status(422).json(error);
    }
}


const universityAddSchool = async (req, res) => {
    const { schoolName, universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const school = new models.School({
            name: schoolName,
            university: universityId
        });

        const savedSchool = await school.save();
        res.status(200).json({ _id: savedSchool._id, message: "School added successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
}

const universityAddDepartment = async (req, res) => {
    const { departmentName, schoolId, universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const school = await models.School.findById(schoolId).exec();
        if (!school) {
            res.status(400).json({ message: "Invalid School Id" });
            return;
        }

        const department = new models.Department({
            name: departmentName,
            school: schoolId,
            university: universityId
        });

        const savedDepartment = await department.save();
        res.status(200).json({ _id: savedDepartment._id, message: "Department added successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
}

const addUniversityProgram = async (req, res) => {
    const { programName, departmentId, universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();

        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const department = await models.Department.findById(departmentId).exec();
        if (!department) {
            res.status(400).json({ message: "Invalid Department Id" });
            return;
        }

        const program = new models.Program({
            name: programName,
            department: departmentId,
            university: universityId
        });

        const savedProgram = await program.save();
        res.status(200).json({ _id: savedProgram._id, message: "Program added successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
}

const universityVerifyCourse = async (req, res) => {
    const { courseId, universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const course = await models.Course.findById(courseId).exec();
        if (!course) {
            res.status(400).json({ message: "Invalid Course Id" });
            return;
        }

        course.approvalStatus = "verified";
        await course.save();
        res.status(200).json({ message: "Course verified successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
}


const universityRejectCourse = async (req, res) => {
    const { courseId, universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const course = await models.Course.findById(courseId).exec();
        if (!course) {
            res.status(400).json({ message: "Invalid Course Id" });
            return;
        }

        course.approvalStatus = "rejected";
        await course.save();
        res.status(200).json({ message: "Course rejected successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
}

const getUniversityDetails = async (req, res) => {
    const { universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const schools = await models.School.find({ university: universityId }).exec();
        console.log({ schools })
        const schoolArray = [];
        for (let i = 0; i < schools.length; i++) {
            const departments = await models.Department.find({ school: schools[i]._id }).exec();
            const departmentArray = [];
            for (let j = 0; j < departments.length; j++) {
                const programs = await models.Program.find({ department: departments[j]._id }).exec();
                const programArray = [];
                for (let k = 0; k < programs.length; k++) {
                    const courses = await models.Course.find({ program: programs[k]._id }).exec();
                    const courseArray = [];
                    for (let l = 0; l < courses.length; l++) {
                        const course = {
                            id: courses[l]._id,
                            name: courses[l].name
                        }
                        courseArray.push(course);
                    }
                    const program = {
                        id: programs[k]._id,
                        name: programs[k].name,
                        courses: courseArray
                    }
                    programArray.push(program);
                }
                const department = {
                    id: departments[j]._id,
                    name: departments[j].name,
                    programs: programArray
                }
                departmentArray.push(department);
            }
            const school = {
                id: schools[i]._id,
                name: schools[i].name,
                departments: departmentArray
            }
            schoolArray.push(school);
        }
        const universityDetails = {
            ...university._doc,
            schools: schoolArray
        }
        console.log(universityDetails)

        res.status(200).json({ universityDetails });
    } catch (error) {
        console.log(error)
        res.status(422).json(error);
    }
}


const universityTeacherData = async (req, res) => {
    const { universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const teachers = await models.Teacher.find({ university: universityId }).exec();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(422).json(error);
    }
}

const universityTeacherCount = async (req, res) => {
    const { universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const teachers = await models.Teacher.find({ university: universityId }).exec();
        res.status(200).json({ count: teachers.length });
    } catch (error) {
        res.status(422).json(error);
    }
}

const getUniversityContract = async (req, res) => {
    const { universityId } = req.body.universityId;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        res.status(200).json(university.contract);
    } catch (error) {
        res.status(422).json(error);
    }
}

const contractExpiryDetails = async (req, res) => {
    const { universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const contractExpiry = {
            contractExpiry: university.contract[0].contractExpiry,
            contractExpiryDate: university.contract[0].contractExpiryDate,
            contractExpiryTimeRemaining: new Date(university.contract[0].contractExpiryDate).getTime() - new Date().getTime()
        }

        res.status(200).json(contractExpiry);
    } catch (error) {
        res.status(422).json(error);
    }
}


const getUniversityStudentData = async (req, res) => {
    const { universityId } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const students = await models.Student.find({ university: universityId }).exec();
        res.status(200).json(students);
    }

    catch (error) {
        res.status(500).json(error);
    }
}


// -------------------------------------------------------------------------------------------- Teacher Section --------------------------------------------------------------------------------------------


const signupTeacher = async (req, res) => {
    const { name, username, email, password, uniId, departmentId } = req.body;
    try {
        // const validate = await signUpSchema.validateAsync({ username, password, email });
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                res.status(500).json(err);
            } else {
                const university = await models.University.findById(uniId).exec();
                if (!university) {
                    res.status(400).json({ message: "Invalid University Id" });
                    return;
                }

                const teacherSearch = await models.Teacher.find({ $or: [{ username: username }, { email: email }] }).exec();
                if (teacherSearch.length > 0) {
                    res.status(400).json({ message: "Username or Email already exists" });
                    return;
                }


                const department = await models.Department.findById(departmentId).exec();
                if (!department) {
                    res.status(400).json({ message: "Invalid department Id" });
                    return;
                }

                const teacher = new models.Teacher({
                    name: name,
                    username: username,
                    email: email,
                    password: hash,
                    university: uniId,
                    department: departmentId,
                    status: 'waitlist',
                });

                const savedTeacher = await teacher.save();
                res.status(200).json({
                    _id: savedTeacher._id,
                    email: savedTeacher.email,
                    username: savedTeacher.username
                });
            }
        });
    } catch (error) {
        res.status(422).json(error);
    }
}

const addCourse = async (req, res) => {
    const {
        universityId,
        name,
        description,
        courseCode,
        courseType,
        expectedCourseDuration,
        courseCompilers,
        courseStartDate,
        programId,
        teacherId,
    } = req.body;
    try {

        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const program = await models.Program.findById(programId).exec();
        if (!program) {
            res.status(400).json({ message: "Invalid Program Id" });
            return;
        }

        const teacher = await models.Teacher.findById(teacherId).exec();
        if (!teacher) {
            res.status(400).json({ message: "Invalid Teacher Id" });
            return;
        }


        const course = new models.Course({
            name: name,
            description: description,
            courseCode: courseCode,
            courseType: courseType,
            expectedCourseDuration: expectedCourseDuration,
            courseCompilers: courseCompilers,
            courseStartDate: courseStartDate,
            program: programId,
            university: universityId,
            teacher: teacherId,
            approvalStatus: "pending"
        });

        const savedCourse = await course.save();
        res.status(200).json({ message: "Course added successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
}


const addAssignment = async (req, res) => {
    const {
        universityId,
        courseId,
        name,
        description
    } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const course = await models.Course.findById(courseId).exec();
        if (!course) {
            res.status(400).json({ message: "Invalid Course Id" });
            return;
        }

        const assignment = new models.Assignment({
            name: name,
            description: description,
            course: courseId,
            university: universityId,
        });

        const savedAssignment = await assignment.save();
        res.status(200).json({ _id: savedAssignment._id });
    } catch (error) {
        res.status(422).json(error);
    }
}

const addQuestion = async (req, res) => {
    const {
        courseId,
        universityId,
        assignmentId,
        title,
        question,
        input,
        output,
        sampleInput,
        sampleOutput,
        difficulty,
        category,
        tags,
        score
    } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const course = await models.Course.findById(courseId).exec();
        if (!course) {
            res.status(400).json({ message: "Invalid Course Id" });
            return;
        }

        const assignment = await models.Assignment.findById(assignmentId).exec();
        if (!assignment) {
            res.status(400).json({ message: "Invalid Assignment Id" });
            return;
        }

        const newQuestion = new models.Question({
            title: title,
            question: question,
            input: input,
            output: output,
            sampleInput: sampleInput,
            sampleOutput: sampleOutput,
            difficulty: difficulty,
            category: category,
            tags: tags,
            score: score,
            assignment: assignmentId,
            course: courseId,
            university: universityId,
            studentsAttempted: [],
            studentsCorrect: [],
            studentsIncorrect: [],
            studentsUnattempted: [],
            plagarismAnalysis: []
        });

        const savedQuestion = await newQuestion.save();
        res.status(200).json({ _id: savedQuestion._id });
    } catch (error) {
        res.status(422).json(error);
    }
}

const addStudentToCourse = async (req, res) => {
    const { courseId, studentId } = req.body;
    try {
        const course = await models.Course.findById(courseId).exec();
        if (!course) {
            res.status(400).json({ message: "Invalid Course Id" });
            return;
        }

        const student = await models.Student.findById(studentId).exec();
        if (!student) {
            res.status(400).json({ message: "Invalid Student Id" });
            return;
        }




        student.courses.push({
            course: courseId,
            courseScore: 0,
            completed: false,
            completedDate: null,
            startDate: null,
            progress: 0,
        });

        const savedStudent = await student.save();
        res.status(200).json({ message: "Student added to course successfully" });
    } catch (error) {
        res.status(422).json(error);
    }
}

const getCoursesOfTeacher = async (req, res) => {
    const { teacherId } = req.body;
    try {
        const teacher = await models.Teacher.findById(teacherId).exec();
        if (!teacher) {
            res.status(400).json({ message: "Invalid Teacher Id" });
            return;
        }
        const courses = await models.Course.find({ teacher: teacherId }).exec();
        res.status(200).json({ courses })
    } catch (err) {
        res.status(500).json({ message: "ERROR" });
    }

}

const getAssignmentsFromCourse = async (req, res) => {
    const { courseId } = req.body;
    try {
        const assignments = await models.Assignment.find({ course: courseId }).exec();
        res.status(200).json({ assignments })
    }
    catch (err) {
        res.status(500).json({ message: "error" })
    }
}

const getQuestionById = async (req, res) => {
    const { questionId } = req.body;
    try {
        models.Question.findById(questionId, (err, question) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (question) {
                    const result = {
                        _id: question._id,
                        title: question.title,
                        question: question.question,
                        course: question.course,
                        sampleInput: question.sampleInput,
                        sampleOutput: question.sampleOutput,
                        difficulty: question.difficulty,
                        category: question.category,
                        tags: question.tags,
                        dateCreated: question.dateCreated,
                    }
                } else {
                    res.status(200).json({ message: "Invalid question id" });
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const getQuestionsInAssignment = async (req, res) => {
    const { assignmentId } = req.body;
    try {
        const questions = await models.Question.find({ assignment: assignmentId }).exec();
        res.status(200).json({ questions })
    } catch (err) {
        res.status(500).json({ message: "ERROR" })
    }
}

const getCourseDetails = async (req, res) => {
    const { universityId, courseId } = req.body;
    try {

        models.University.find({ _id: universityId }, (err, university) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (university.length > 0) {
                    models.Course.find({ _id: courseId }, (err, course) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            if (course.length > 0) {
                                res.status(200).json(course[0]);
                            }
                            else {
                                res.status(200).json({ message: "Invalid course id" });
                            }
                        }
                    });
                } else {
                    res.status(200).json({ message: "Invalid university id" });
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }

}


const showCoursesToTeacher = async (req, res) => {
    const { teacherId } = req.body;
    try {
        const teacher = await models.Teacher.findById(teacherId).exec();
        if (!teacher) {
            res.status(400).json({ message: "Invalid Teacher Id" });
            return;
        }
        const courses = await models.Course.find({ teacher: teacherId }).exec();
        // const moocs = await models.Mooc.find({ teacher: teacherId }).exec();
        moocs: "EMPTY";
        res.status(200).json({ courses: courses, moocs: moocs });
    } catch (error) {
        res.status(422).json(error);
    }
}

const getStudentDetails = async (req, res) => {
    const { courseId } = req.body;
    try {
        const student = await models.Student.find().exec();
        const result = [];
        for (let i = 0; i < student.length; i++) {
            for (let j = 0; j < student[i].courses.length; j++) {
                if (JSON.stringify(student[i].courses[j].course) === JSON.stringify(courseId)) {
                    result.push(student[i]);
                    break;
                }
            }
        }
        res.status(200).json({ result });
    } catch (err) {
        res.status(500).json({ "message": "error" })
    }
}


// --------------------------------------------------------------------------------------------- End Teacher Controllers --------------------------------------------------------------------------------------------- //

//  --------------------------------------------------------------------------------------------- Student Controllers --------------------------------------------------------------------------------------------- //



const studentSignUp = async (req, res) => {
    const { name, email, password, uniId, programId } = req.body;
    console.log(uniId)
    try {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                res.status(500).json(err);
            else {
                // check if valid uniId
                models.University.find({ _id: uniId }, (err, university) => {
                    if (err)
                        res.status(500).json(err);
                    else {
                        if (university.length > 0) {
                            //    check if student exists
                            models.Student.find({ email: email }, (err, student) => {
                                if (err)
                                    res.status(500).json(err);
                                else {
                                    if (student.length > 0) {
                                        res.status(200).json({ message: "Student already exists" });
                                    }
                                    else {
                                        const student = new models.Student({
                                            name: name,
                                            email: email,
                                            password: hash,
                                            university: uniId,
                                            status: "waitlist",
                                            program: programId
                                        });
                                        student.save((err) => {
                                            if (err)
                                                res.status(500).json(err);
                                            else {
                                                const token = generateToken(email);
                                                res.status(200).json({ auth: true, token: token, _id: student._id });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else {
                            console.log("here")
                            res.status(200).json({ message: "Invalid university id" });

                        }
                    }
                });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const getCoursesOfStudent = async (req, res) => {
    const { studentId } = req.body;
    try {
        const student = await models.Student.findById(studentId).exec();
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json(err);
    }
}

const getAssignmentsOfStudent = async (req, res) => {
    const { studentId } = req.body;
    try {

        const student = await models.Student.findById(studentId).exec();
        const courses = [];
        for (var i = 0; i < student.courses.length; i++) {
            courses.push(student.courses[i].course);
        }

        const assignments = [];

        for (var i = 0; i < courses.length; i++) {
            const assignmentCurrent = await models.Assignment.find({ course: courses[i] }).exec();

            const obj = {

                course: courses[i],
                assignment: assignmentCurrent
            }
            assignments.push(obj)

        }

        res.status(200).json({
            assignments
        })

    } catch (err) {
        res.status(500).json(err)
    }
}

const getQuestionsFromAssignmentForStudent = async (req, res) => {
    const { studentId, assignmentId } = req.body;
    try {
        const questions = await models.Question.find({ assignment: assignmentId }).exec();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json(err);
    }
}



//  --------------------------------------------------------------------------------------------- End Student Controllers --------------------------------------------------------------------------------------------- //





// ---------------------------------------------------------------------------------------------Moocs Controllers --------------------------------------------------------------------------------------------- //

const addMoocs = async (req, res) => {
    const { universityId, teacherId, program, name, description, courseCode, courseType, expectedCourseDuration, courseCompilers, courseStartDate, approvalStatus } = req.body;
    try {
        const university = await models.University.findById(universityId).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const program = await models.Program.findById(programId).exec();
        if (!program) {
            res.status(400).json({ message: "Invalid Program Id" });
            return;
        }

        const teacher = await models.Teacher.findById(teacherId).exec();
        if (!teacher) {
            res.status(400).json({ message: "Invalid Teacher Id" });
            return;
        }


        const moocs = new models.Moocs({
            name: name,
            description: description,
            courseCode: courseCode,
            courseType: courseType,
            expectedCourseDuration: expectedCourseDuration,
            courseCompilers: courseCompilers,
            courseStartDate: courseStartDate,
            program: programId,
            university: universityId,
            teacher: teacherId,
            approvalStatus: "pending"
        });

        const savedMoocs = await moocs.save();
        res.status(200).json({ message: "Public Lab added successfully" });

    } catch (err) {
        res.status(500).json({ "message": "internal server error" })
    }
}


const approveMoocs = async (req, res) => {
    const { moocsId } = req.body;
    try {
        const moocs = await models.Moocs.findById(moocsId).exec();
        if (!moocs.length) {
            res.status(404).json({ "message": "No Moocs Found" })
        }

        moocs.approvalStatus = "verified";
        await moocs.save();
        res.status(200).json({ message: "Public Lab verified successfully" });

    } catch (error) {
        res.status(422).json(error);
    }

}


const rejectMoocs = async (req, res) => {
    const { moocsId } = req.body;
    try {
        const moocs = await models.Moocs.findById(moocsId).exec();
        if (!moocs.length) {
            res.status(404).json({ "message": "No Moocs Found" })
        }

        moocs.approvalStatus = "rejected";
        await moocs.save();
        res.status(200).json({ message: "Public Lab rejected successfully" });

    } catch (error) {
        res.status(422).json(error);
    }
}

const getMoocs = async (req, res) => {
    try {
        const moocs = await models.Moocs.find({}).exec();
        res.status(200).json({ moocs });
    } catch (err) {
        res.status(500).json({ err });
    }
}

const getMoocsById = async (req, res) => {
    try {
        const moocs = await models.Moocs.findById(req.body.moocsId).exec();
        const moocsResponse = moocs.filter((mooc) => mooc.approvalStatus === 'verified');
        res.status(200).json({ moocsResponse });
    } catch (err) {
        res.status(500).json({ err });
    }
}

const getMoocsOfStudent = async (req, res) => {
    try {

        const { studentId } = req.body;
        const student = await models.Student.findById(studentId).exec();
        const moocsList = student.moocs;
        res.status(200).json({ moocsList });

    } catch (err) {
        res.status(500).json({ err });
    }
}

const enrollStudentToMooc = async (req, res) => {
    try {
        const { studentId, moocId } = req.body;

        const student = await models.Student.findById(studentId).exec();

        student.moocs.push({
            mooc: moocId,
            moocScore: 0,
            completed: false,
            completedDate: null,
            startDate: null,
            progress: 0,
        });

        const savedStudent = await student.save();
        res.status(200).json({ message: "Saved!" })

    } catch (err) {
        res.status(500).json({ err });
    }
}

const addAssignmentToMooc = async (req, res) => {
    const {

        moocId,
        name,
        description
    } = req.body;
    try {

        const moocCourse = await models.Moocs.findById(moocId).exec();
        if (!moocCourse) {
            res.status(400).json({ message: "Invalid Course Id" });
            return;
        }

        const assignment = new models.MoocsAssignment({
            name: name,
            description: description,
            mooc: moocId,
        });

        const savedAssignment = await assignment.save();
        res.status(200).json({ _id: savedAssignment._id });
    } catch (error) {
        res.status(422).json(error);
    }
}

const addQuestionToMoocs = async (req, res) => {
    const {
        moocId,
        moocAssignmentId,
        title,
        question,
        input,
        output,
        sampleInput,
        sampleOutput,
        difficulty,
        category,
        tags,
        score
    } = req.body;
    try {


        const mooc = await models.Moocs.findById(moocId).exec();
        if (!course) {
            res.status(400).json({ message: "Invalid Course Id" });
            return;
        }

        const assignment = await models.MoocsAssignment.findById(moocAssignmentId).exec();
        if (!assignment) {
            res.status(400).json({ message: "Invalid Assignment Id" });
            return;
        }

        const newQuestion = new models.MoocsQuestion({
            title: title,
            question: question,
            input: input,
            output: output,
            sampleInput: sampleInput,
            sampleOutput: sampleOutput,
            difficulty: difficulty,
            category: category,
            tags: tags,
            score: score,
            moocassignment: moocAssignmentId,
            mooc: moocId,
            university: universityId,
            studentsAttempted: [],
            studentsCorrect: [],
            studentsIncorrect: [],
            studentsUnattempted: [],
            plagarismAnalysis: []
        });

        const savedQuestion = await newQuestion.save();
        res.status(200).json({ _id: savedQuestion._id });
    } catch (error) {
        res.status(422).json(error);
    }
}



// -------------------------------------------------------------------------------------------

const adminSignIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const validate = await signUpSchema.validateAsync({ username, password });
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const time = new Date.getTime() / 1000();
            const token = generateToken(username, time);
            adminLogin = {
                token: token,
                ip: req.ip
            }
            res.status(200).json({ auth: true, token: token });
        }
    }
    catch (error) {
        res.status(422).json(error);
    }
}

const adminUniversityData = async (req, res) => {
    await models.University.find({}, (err, universities) => {
        if (err)
            res.status(500).json(err);
        else
            res.status(200).json(universities);
    });
}


const getRemainingStudents = async (req, res) => {
    const { universityId, courseId } = req.body;
    let allStudents = [];
    const results = [];
    try {
        const students = await models.Student.find({ university: universityId });
        for (let i = 0; i < students.length; i++) {
            const currentStudent = students[i];
            for (let j = 0; j < currentStudent.courses.length; j++) {
                if (currentStudent.courses[j].course !== courseId) {
                    results.push(currentStudent);
                    break;
                }
            }
        }
        res.status(200).json(results);
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const getUniversityStudentCount = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        models.Student.find({ university: universityId }, (err, students) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json({ count: students.length });
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}


// POST route
const getUniversityTeacherData = async (req, res) => {
    const teacherId = req.body.teacherId;
    const universityId = req.body.universityId;
    try {
        models.Teacher.find({ _id: teacherId, university: universityId }, (err, teacher) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(teacher);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// POST route
const getUniversityTeacherWaitlist = async (req, res) => {
    const universityId = req.body.universityId;

    try {
        models.Teacher.find({ university: universityId, status: "waitlist" }, (err, teachers) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(teachers);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// POST route
const getUniversityTeacherWaitlistById = async (req, res) => {
    const teacherId = req.body.teacherId;
    const universityId = req.body.universityId;
    try {
        models.Teacher.find({ _id: teacherId, university: universityId, status: "waitlist" }, (err, teacher) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(teacher);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// Patch route
const acceptTeacherWaitlist = async (req, res) => {
    const teacherId = req.body.teacherId;
    const universityId = req.body.universityId;
    try {
        models.Teacher.find({ _id: teacherId, university: universityId, status: "waitlist" }, (err, teacher) => {
            if (err)
                res.status(500).json(err);
            else {
                teacher[0].status = "active";
                teacher[0].save((err) => {
                    if (err)
                        res.status(500).json(err);
                    else
                        res.status(200).json({ message: "Teacher accepted" });
                });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// Patch route
const rejectTeacherWaitlist = async (req, res) => {
    const teacherId = req.body.teacherId;
    const universityId = req.body.universityId;
    try {
        models.Teacher.find({ _id: teacherId, university: universityId, status: "waitlist" }, (err, teacher) => {
            if (err)
                res.status(500).json(err);
            else {
                teacher[0].status = "rejected";
                teacher[0].save((err) => {
                    if (err)
                        res.status(500).json(err);
                    else
                        res.status(200).json({ message: "Teacher rejected" });
                });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// POST route

const getUniversityStudentWaitlist = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        models.Student.find({ university: universityId, status: "waitlist" }, (err, students) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(students);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// POST route
const getUniversityStudentWaitlistById = async (req, res) => {
    const studentId = req.body.studentId;
    const universityId = req.body.universityId;
    try {
        models.Student.find({ _id: studentId, university: universityId, status: "waitlist" }, (err, student) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(student);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// Patch  route
const acceptStudentWaitlist = async (req, res) => {
    const studentId = req.body.studentId;
    const universityId = req.body.universityId;
    try {
        models.Student.find({ _id: studentId, university: universityId, status: "waitlist" }, (err, student) => {
            if (err)
                res.status(500).json(err);
            else {
                student[0].status = "active";
                student[0].save((err) => {
                    if (err)
                        res.status(500).json(err);
                    else
                        res.status(200).json({ message: "Student accepted" });
                });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// Patch route
const rejectStudentWaitlist = async (req, res) => {
    const studentId = req.body.studentId;
    const universityId = req.body.universityId;
    try {
        models.Student.find({ _id: studentId, university: universityId, status: "waitlist" }, (err, student) => {
            if (err)
                res.status(500).json(err);
            else {
                student[0].status = "rejected";
                student[0].save((err) => {
                    if (err)
                        res.status(500).json(err);
                    else
                        res.status(200).json({ message: "Student rejected" });
                });
            }
        });
    }
    catch (error) {

        res.status(500).json(error);
    }
}

// Patch route
const acceptAllStudentWaitlist = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        models.Student.find({ university: universityId, status: "waitlist" }, (err, students) => {
            if (err)
                res.status(500).json(err);
            else {
                students.forEach(student => {
                    student.status = "active";
                    student.save((err) => {
                        if (err)
                            res.status(500).json(err);
                    });
                });
                res.status(200).json({ message: "All students accepted" });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// Patch route
const rejectAllStudentWaitlist = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        models.Student.find({ university: universityId, status: "waitlist" }, (err, students) => {
            if (err)
                res.status(500).json(err);
            else {
                students.forEach(student => {
                    student.status = "rejected";
                    student.save((err) => {
                        if (err)
                            res.status(500).json(err);
                    });
                });
                res.status(200).json({ message: "All students rejected" });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

//  GET route
const getUniversityCourse = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        models.Course.find({ university: universityId }, (err, courses) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(courses);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// GET route
const getUniversityCourseByTeacherId = async (req, res) => {
    const teacherId = req.body.teacherId;
    const universityId = req.body.universityId;
    try {
        models.Course.find({ teacher: teacherId, university: universityId }, (err, courses) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(courses);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}
// POST route


const getAllUniversities = async (req, res) => {
    try {
        models.University.find({}, { _id: 1, name: 1 }, (err, universities) => {
            if (err) {
                res.status(500).json(err);
            }
            else
                res.status(200).json(universities);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const teacherLogin = async (req, res) => {
    const { email, password } = req.body;
    try {

        models.Teacher.find({ email: email }, (err, teacher) => {
            if (err)
                res.status(500).json(err);
            else {
                if (teacher.length > 0) {
                    bcrypt.compare(password, teacher[0].password, (err, result) => {
                        if (err)
                            res.status(500).json(err);
                        else {
                            if (result) {
                                const token = generateToken(teacher[0].name, teacher[0].email);
                                res.status(200).json({ auth: true, token: token, _id: teacher[0]._id });
                            }
                            else
                                res.status(200).json({ message: "Invalid password" });
                        }
                    });
                }
                else
                    res.status(200).json({ message: "Invalid email" });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}





const addCourseTeacher = async (req, res) => {
    const {
        universityId,
        courseId,
        teacherId,
    } = req.body;
    console.log(req.body)
    try {
        models.University.find({ _id: universityId }, (err, university) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (university.length > 0) {
                    models.Course.find({ _id: courseId }, (err, course) => {
                        if (err)
                            res.status(500).json(err);
                        else {
                            if (course.length > 0) {
                                if (course[0].university == universityId) {
                                    console.log("ETT")
                                    models.Teacher.find({ _id: teacherId }, (err, teacher) => {
                                        if (err)
                                            res.status(500).json(err);
                                        else {
                                            if (teacher.length > 0) {
                                                console.log('12421421')
                                                models.Teacher.updateOne({ _id: teacherId }, { $push: { courses: courseId } }, (err) => {
                                                    if (err) {
                                                        console.log(err)
                                                        res.status(500).json(err);

                                                    }
                                                    else {
                                                        console.log("HERERE")
                                                        res.status(200).json({ message: "Course added successfully" });
                                                    }
                                                });
                                            } else {
                                                res.status(200).json({ message: "Invalid teacher id" });
                                            }
                                        }
                                    });
                                } else {
                                    res.status(200).json({ message: "Invalid course id" });
                                }
                            } else {
                                res.status(200).json({ message: "Invalid course id" });
                            }
                        }
                    });
                } else {
                    res.status(200).json({ message: "Invalid university id" });
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}


const getCoursesForTeacher = async (req, res) => {
    const { teacherId } = req.body;
    try {
        models.Teacher.find({ _id: teacherId }, (err, teacher) => {
            if (err)
                res.status(500).json(err);
            else {
                if (teacher.length > 0) {
                    //    find all course details from course array
                    models.Course.find({ _id: { $in: teacher[0].courses } }, (err, courses) => {
                        if (err)
                            res.status(500).json(err);
                        else {
                            console.log(courses.length)
                            res.status(200).json(courses);
                        }
                    });

                } else {
                    res.status(200).json({ message: "Invalid teacher id" });
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}




const checkUniversityIdValidity = async (universityId) => {
    console.log("CHECK HERE")
    let val = false;
    models.University.find({ _id: universityId }, (err, university) => {
        if (err)
            return false;
        else {
            if (university.length > 0) {
                console.log("IIIIIIIIIIIIIIIIII")
                val = true;
            }
            else
                return false;
        }
    });
    return val
}

const checkCourseIdValidity = async (universityId, courseId) => {
    const checkUniId = await checkUniversityIdValidity(universityId);
    console.log({ checkUniId })
    if (checkUniId) {
        models.Course.find({ _id: courseId }, (err, course) => {
            if (err)
                return false;
            else {
                if (course.length > 0 && course[0].university === universityId)
                    return true;
                else
                    return false;
            }
        });
    } else {
        return false;
    }
}

const checkTeacherIdValidity = async (universityId, teacherId) => {
    const checkUniId = await checkUniversityIdValidity(universityId);
    if (checkUniId) {
        models.Teacher.find({ _id: teacherId }, (err, teacher) => {
            if (err)
                return false;
            else {
                if (teacher.length > 0 && teacher[0].university === universityId)
                    return true;
                else
                    return false;
            }
        });
    } else {
        return false;
    }
}


const submitStudent = async (req, res) => {
    const { student_id, code, question_id, language_id } = req.body;
    let plagarized = false;
    try {

        const question = await models.Question.findById(question_id).exec();
        console.log("1.Retrieved question");
        let encoded = base64encode(code);
        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': `122${process.env.COMPILER_API_KEY}`,
                'X-RapidAPI-Host': `${process.env.COMPILER_API_HOST}`
            },
            data: {
                "source_code": encoded,
                "language_id": language_id,
                "stdin": base64encode(question.input),
                "expected_output": base64encode(question.output)
            }
        };

        const response = await axios.request(options);
        console.log("2.Received response from compiler");
        const { token } = response.data;
        const getSubmissionOptions = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'X-RapidAPI-Key': `122${process.env.COMPILER_API_KEY}`,
                'X-RapidAPI-Host': `${process.env.COMPILER_API_HOST}`
            }
        };

        const submissionResponse = await axios.request(getSubmissionOptions);
        // console.log(submissionResponse)
        console.log("3.Received submission response from compiler");

        addSubmissionLog(submissionResponse.data.token);

        const newSubmission = new models.Submission({
            student: student_id,
            question: question_id,
            code: code,
            language: language_id,
            status: submissionResponse.data.status.id,
            dateCreated: new Date().toISOString(),
            plagarized: false
        });


        const submissionToDB = await newSubmission.save();
        console.log("4.Saved to Submission DB");

        question.studentsAttempted.push(student_id);

        if (submissionResponse.data.status.id === 3) {
            question.studentsCorrect.push(student_id);
        } else {
            question.studentsIncorrect.push(student_id);
        }

        const getSubmissionData = await models.Submission.find({ question: question_id }).exec();
        console.log(getSubmissionData)
        console.log("5.Retrieved submission data from DB");

        const checker = new PlagiarismChecker(getSubmissionData, student_id);
        const plagarismCheck = checker.check();

        question.plagarismAnalysis = plagarismCheck;

        if (plagarismCheck[plagarismCheck.length - 1].isPlagiarized) {
            plagarized = true;
        }

        const questionSave = await question.save();

        console.log("6.Saved to Question DB");


        if (plagarized) {
            const submissionByIdUpdate = await models.Submission.findByIdAndUpdate(submissionToDB._id, { plagarized: true }).exec();
            console.log("Plagarism Detected");
            if (!submissionByIdUpdate) {
                res.status(500).json({ message: "Error updating submission" });
            }
        }
        console.log("7.Updated submission DB");
        res.status(200).json(submissionResponse.data);
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
    }

}



const getTeacherData = async (req, res) => {
    const { teacherId } = req.body;
    try {
        models.Teacher.find({ _id: teacherId }, (err, teacher) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (teacher.length > 0) {
                    res.status(200).json(teacher[0]);
                } else {
                    res.status(200).json({ message: "Invalid teacher id" });
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const addCourseStudent = async (req, res) => {

    const { courseId, studentId } = req.body;
    try {
        models.Student.findByIdAndUpdate(studentId, {
            $push: {
                courses: { course_id: courseId, course_grade: 'I', completed: false, progress: 0 }
            }
        }, (err, student) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json({ message: "Student added to course successfully" });
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const removeCourseStudent = async (req, res) => {
    const { courseId, studentId, universityId } = req.body;
    try {
        const checkUniId = await checkUniversityIdValidity(universityId);
        if (checkUniId) {
            const checkCourseId = await checkCourseIdValidity(courseId);
            if (checkCourseId) {

                models.Course.findByIdAndUpdate(courseId, { $pull: { students: studentId } }, (err, course) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        if (course) {
                            res.status(200).json({ message: "Student removed from course successfully" });
                        } else {
                            res.status(200).json({ message: "Invalid course id" });
                        }
                    }
                });
            } else {
                res.status(200).json({ message: "Invalid course id" });
            }
        } else {
            res.status(200).json({ message: "Invalid university id" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const getMultiCourses = async (req, res) => {
    const { teacherId, courseIds } = req.body;
    console.log(teacherId);
    try {

        const checkTeacherId = true
        const courses = [];
        if (checkTeacherId) {
            const y = JSON.parse(courseIds);
            console.log("HELLO")
            console.log(y);
            for (let i = 0; i < courseIds.length; i++) {
                models.Course.find({
                    _id: new ObjectId(courseIds[i]),
                }, (err, course) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (course.length > 0) {
                            console.log("LLLLL")
                            courses.push(course[0]);
                            if (i === courseIds.length - 1) {
                                res.status(200).json(courses);
                            }
                        } else {
                            res.status(200).json({ message: "Invalid course ids" });
                        }
                    }
                });
            }
        } else {
            res.status(200).json({ message: "Invalid teacher id" });
        }

        //     models.Course.find({ _id: { $in: courseIds } }, (err, courses) => {
        //         if (err) {
        //             res.status(500).json(err);
        //         } else {
        //             if (courses.length > 0) {
        //                 res.status(200).json(courses);
        //             } else {
        //                 res.status(200).json({ message: "Invalid course ids" });
        //             }
        //         }
        //     });
        // } else {
        //     res.status(200).json({ message: "Invalid teacher id" });
        // }

    } catch (error) {
        res.status(500).json(error);
    }
}





const getQuestionAnalysis = async (req, res) => {
    const { questionId } = req.body;
    try {
        models.Question.find(
            { _id: questionId },
            {
                _id: 1,
                studentsAttempted: 1,
                studentsCorrect: 1,
                studentsIncorrect: 1,
                studentsUnattempted: 1,
            },
            (err, question) => {
                if (err)
                    res.status(500).json(err);
                else {
                    if (question.length > 0) {
                        res.status(200).json(question[0]);
                    } else {
                        res.status(200).json({ message: "Invalid question id" });
                    }
                }
            }
        )
    } catch (error) {
        res.status(500).json(error);
    }
}

const getStudents = async (req, res) => {
    const { universityId } = req.body;
    try {
        models.University.findById({ _id: universityId }, (err, university) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (university) {
                    models.Student.find(
                        { universityId: universityId },
                        (err, students) => {
                            if (err) {
                                res.status(500).json(err);
                            }
                            else {
                                if (students.length > 0) {
                                    res.status(200).json(students);
                                } else {
                                    res.status(200).json({ message: "No students found" });
                                }
                            }
                        })
                } else {
                    res.status(200).json({ message: "Invalid university id" });
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}





const studentLogin = async (req, res) => {
    const { email, password } = req.body;
    try {

        models.Student.find({ email: email }, (err, student) => {
            if (err)
                res.status(500).json(err);
            else {
                if (student.length > 0) {
                    bcrypt.compare(password, student[0].password, (err, result) => {
                        if (err)
                            res.status(500).json(err);
                        else {
                            if (result) {
                                const token = generateToken(student[0].name, student[0].email);
                                res.status(200).json({ auth: true, token: token, _id: student[0]._id });
                            }
                            else
                                res.status(200).json({ message: "Invalid password" });
                        }
                    });
                }
                else
                    res.status(200).json({ message: "Invalid email" });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const getStudentData = async (req, res) => {
    const { studentId } = req.body;
    try {
        models.Student.find({ _id: studentId }, (err, student) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (student.length > 0) {
                    res.status(200).json(student[0]);
                } else {
                    res.status(200).json({ message: "Invalid student id" });
                }
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const getQuestionForStudent = async (req, res) => {

    try {
        const { questionId, universityId, courseId, studentId } = req.body;
        const student = await models.Student.findById({ _id: studentId }).exec();
        if (!student) {
            res.status(404).json({ message: "Invalid student id" });
            return;
        }

        const university = await models.University.findById({ _id: universityId }).exec();
        if (!university) {
            res.status(404).json({ message: "Invalid university id" });
            return;
        }

        if (student.university !== universityId) {
            console.log("line 1576");
            console.log(student.university);
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }


        const course = await models.Course.findById({ _id: courseId }).exec();

        if (!course) {
            console.log("line 1584");
            res.status(404).json({ message: "Invalid course id" });
            return;
        }

        if (course.university !== universityId) {
            console.log("line 1590");
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

        let enrolled = false;

        for (var courseOfStudent of student.courses) {
            if (courseOfStudent.course_id === courseId) {
                console.log("line 1596");
                enrolled = true;
            }
        }

        if (!enrolled) {
            console.log("line 1600");
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

        const question = await models.Question.findById({ _id: questionId }).exec();

        if (question.course !== courseId) {
            console.log("line 1604");
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }
        console.log({ questionId });

        const questionForStudent = await models.Question.findById(questionId, {
            title: 1,
            question: 1,
            course: 1,
            sampleInput: 1,
            sampleOutput: 1,
            difficulty: 1,
            category: 1,
            tags: 1,
            dateCreated: 1,
        }).exec();

        res.status(200).json(questionForStudent);
        return;

    } catch (error) {
        res.status(500).json(error);
    }
}

const showQuestionsToStudent = async (req, res) => {
    try {
        const { questionId, universityId, courseId, studentId } = req.body;
        const student = await models.Student.findById({ _id: studentId }).exec();
        if (!student) {
            res.status(404).json({ message: "Invalid student id" });
            return;
        }

        const university = await models.University.findById({ _id: universityId }).exec();
        if (!university) {
            res.status(404).json({ message: "Invalid university id" });
            return;
        }

        if (student.university !== universityId) {
            console.log("line 1576");
            console.log(student.university);
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }


        const course = await models.Course.findById({ _id: courseId }).exec();

        if (!course) {
            console.log("line 1584");
            res.status(404).json({ message: "Invalid course id" });
            return;
        }

        if (course.university !== universityId) {
            console.log("line 1590");
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

        let enrolled = false;

        for (var courseOfStudent of student.courses) {
            if (courseOfStudent.course_id === courseId) {
                console.log("line 1596");
                enrolled = true;
            }
        }

        if (!enrolled) {
            console.log("line 1600");
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

        const questions = await models.Question.find({ course: courseId }, {
            title: 1,
            question: 1,
            course: 1,
            sampleInput: 1,
            sampleOutput: 1,
            difficulty: 1,
            category: 1,
            tags: 1,
            dateCreated: 1,
        }).exec();

        res.status(200).json(questions);
        return;
    } catch (error) {
        res.status(500).json(error);
    }
}

const getStudentPerformance = async (req, res) => {
    let studentDataMap = new Map();
    const { studentId } = req.body;
    try {
        const student = await models.Student.findById({ _id: studentId }).exec();
        if (!student) {
            res.status(404).json({ message: "Invalid student id" });
            return;
        }
        const studentMap = new Map();
        const studentSubmissions = await models.Submission.find({ student: studentId }).exec();
        if (studentSubmissions.length === 0) {
            res.status(200).json({ message: "No submissions found" });
            return;
        }
        // console.log(studentSubmissions);
        const question = await models.Question.find({}).exec();
        const questionMap = new Map();

        question.forEach((question) => {
            questionMap.set(JSON.stringify(question._id), question);
        });


        studentDataMap.set("easy", 0);
        studentDataMap.set("easyAccepted", 0);
        studentDataMap.set("easyRejected", 0);
        studentDataMap.set("medium", 0);
        studentDataMap.set("mediumAccepted", 0);
        studentDataMap.set("mediumRejected", 0);
        studentDataMap.set("hard", 0);
        studentDataMap.set("hardAccepted", 0);
        studentDataMap.set("hardRejected", 0);
        studentDataMap.set("accepted", [])
        studentDataMap.set("rejected", [])
        studentSubmissions.forEach((submission) => {

            console.log(questionMap.get(JSON.stringify(submission.question)).title);

            if (submission.status.id === 3) {
                switch (questionMap.get(JSON.stringify(submission.question)).difficulty) {
                    case "easy":
                        studentDataMap.set("easy", studentDataMap.get("easy") + 1);
                        studentDataMap.set("easyAccepted", studentDataMap.get("easyAccepted") + 1);
                        studentDataMap.get("accepted").push({ title: questionMap.get(JSON.stringify(submission.question)).title, _id: submission.question });
                        break;
                    case "medium":
                        studentDataMap.set("medium", studentDataMap.get("medium") + 1);
                        studentDataMap.set("mediumAccepted", studentDataMap.get("mediumAccepted") + 1);
                        studentDataMap.get("accepted").push({ title: questionMap.get(JSON.stringify(submission.question)).title, _id: submission.question });
                        break;
                    case "hard":
                        studentDataMap.set("hard", studentDataMap.get("hard") + 1);
                        studentDataMap.set("hardAccepted", studentDataMap.get("hardAccepted") + 1);
                        studentDataMap.get("accepted").push({ title: questionMap.get(JSON.stringify(submission.question)).title, _id: submission.question });
                        break;
                }
            } else {
                switch (questionMap.get(JSON.stringify(submission.question)).difficulty) {
                    case "easy":
                        studentDataMap.set("easy", studentDataMap.get("easy") + 1);
                        studentDataMap.set("easyRejected", studentDataMap.get("easyRejected") + 1);
                        studentDataMap.get("rejected").push({ title: questionMap.get(JSON.stringify(submission.question)).title, _id: submission.question });
                        break;
                    case "medium":
                        studentDataMap.set("medium", studentDataMap.get("medium") + 1);
                        studentDataMap.set("mediumRejected", studentDataMap.get("mediumRejected") + 1);
                        studentDataMap.get("rejected").push({ title: questionMap.get(JSON.stringify(submission.question)).title, _id: submission.question });
                        break;
                    case "hard":
                        studentDataMap.set("hard", studentDataMap.get("hard") + 1);
                        studentDataMap.set("hardRejected", studentDataMap.get("hardRejected") + 1);
                        studentDataMap.get("rejected").push({ title: questionMap.get(JSON.stringify(submission.question)).title, _id: submission.question });
                        break;
                }
            }

        });
        studentDataMap.set("total", studentDataMap.get("easy") + studentDataMap.get("medium") + studentDataMap.get("hard"));
        res.status(200).json(Object.fromEntries(studentDataMap));

        return;
    } catch (error) {
        res.status(500).json(error);
    }
}

// const checkSubmission = async (req, res) => {
//     const { submissionId } = req.body;
//     try {
//         const submission = await models.Submission.findById({ _id: submissionId }).exec();

//         if (!submission) {
//             res.status(404).json({ message: "Invalid submission id" });
//             return;
//         }



//     }catch(error){
//         res.status(500).json(error);
//     }
// }

const getCourseByStudentId = async (req, res) => {
    const { studentId } = req.body;
    try {
        const student = await models.Student.findById({ _id: studentId }).exec();
        if (!student) {
            res.status(404).json({ message: "Invalid student id" });
            return;
        }
        const courseIds = [];
        student.courses.forEach((course) => {
            courseIds.push(course.course);
        });
        const courses = await models.Course.find({ _id: { $in: courseIds } }).exec();
        res.status(200).json(courses);
        return;
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    home,
    languages,
    submit,
    signupTeacher,
    adminSignIn,
    universityLogin,
    universitySignUp,
    universityTeacherData,
    universityTeacherCount,
    // universityEdit,
    getUniversityContract,
    contractExpiryDetails,
    getUniversityStudentData,
    getUniversityStudentCount,
    getUniversityTeacherData,
    getUniversityStudentWaitlist,
    getUniversityStudentWaitlistById,
    acceptStudentWaitlist,
    rejectStudentWaitlist,
    acceptAllStudentWaitlist,
    rejectAllStudentWaitlist,
    getUniversityCourse,
    getUniversityCourseByTeacherId,
    getUniversityTeacherWaitlist,
    getUniversityTeacherWaitlistById,
    acceptTeacherWaitlist,
    rejectTeacherWaitlist,
    studentSignUp,
    getAllUniversities,
    teacherLogin,
    submitStudent,
    addCourse,
    addCourseTeacher,
    getCoursesForTeacher,
    addQuestion,
    addCourseStudent,
    removeCourseStudent,
    getTeacherData,
    getMultiCourses,
    getCourseDetails,
    getQuestionById,
    getQuestionAnalysis,
    getStudents,
    addStudentToCourse,
    getRemainingStudents,
    getStudentData,
    studentLogin,
    getQuestionForStudent,
    showQuestionsToStudent,
    getStudentPerformance,
    getCourseByStudentId,
    universityAddDepartment,
    universityAddSchool,
    universityVerifyCourse,
    addUniversityProgram,
    universityRejectCourse,
    showCoursesToTeacher,
    getUniversityDetails,
    addAssignment,
    getCoursesOfTeacher,
    getAssignmentsFromCourse,
    getQuestionsInAssignment,
    getStudentDetails,
    getCoursesOfStudent,
    getAssignmentsOfStudent,
    getQuestionsFromAssignmentForStudent,
    //moocs 
    addMoocs,
    approveMoocs,
    rejectMoocs,
    getMoocs,
    getMoocsById,
    getMoocsOfStudent,
    enrollStudentToMooc,
    addAssignmentToMooc,
    addQuestionToMoocs
};
