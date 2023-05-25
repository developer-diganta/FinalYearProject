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
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const generateOTP = require("../utils/OTP/otp");
// const passport = require("passport");
let languageIds = null;

const OTP = new Map();
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
                        if (university[0].isdeleted === true) {
                            res.status(403).json({ "message": "University Currently Moved To Trash. Please contact administrator" });
                            return;
                        }
                        res.status(400).json({ message: "University already exists" });
                    } else {
                        const newUniversity = new models.University({
                            name: name,
                            email: email,
                            password: hash,
                            phone: phone,
                            contract: {
                                contract_id: "",
                                contract_type: "",
                                contract_receipt: "",
                                contract_amount: "",
                                contract_status: "",
                                contract_billing_details: "",
                                contract_start_date: null,
                                contract_end_date: null
                            },
                            isdeleted: false,
                        });
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
    const { email, password } = req.body;
    try {
        // const validate = await signUpSchema.validateAsync({ username, password });
        models.University.find({ email: email }, async (err, university) => {
            if (err) {
                res.status(500).json(err);
            } else if (university.length) {
                bcrypt.compare(password, university[0].password, (err, result) => {
                    if (err) {
                        res.status(500).json(err);
                    } else if (result) {
                        if (university[0].isdeleted === true) {
                            res.status(403).json({ "message": "University Currently Moved To Trash. Please contact administrator" });
                            return;
                        }
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();

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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const schools = await models.School.find({ university: universityId }).exec();
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

        res.status(200).json({ universityDetails });
    } catch (error) {
        res.status(422).json(error);
    }
}


const universityTeacherData = async (req, res) => {
    const { universityId } = req.body;
    try {
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
    const { universityId } = req.body;

    try {
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const students = await models.Student.find({ university: universityId, isdeleted: false }).exec();
        res.status(200).json(students);
    }

    catch (error) {
        res.status(500).json(error);
    }
}

const deleteUniversity = async (req, res) => {
    try {
        const { universityId, } = req.body;
        const university = await models.University.updateOne({ _id: universityId }, { isdeleted: true }).exec();
        const teachers = await models.Teacher.updateMany({ university: universityId }, { isdeleted: true }).exec();
        const students = await models.Student.updateMany({ university: universityId }, { isdeleted: true }).exec();
        const program = await models.Program.updateMany({ university: universityId }, { isdeleted: true }).exec();
        // const moocs = await models.Moocs.updateMany({ university: universityId }, { isdeleted: true }).exec();
        const department = await models.Department.updateMany({ university: universityId }, { isdeleted: true }).exec();
        const course = await models.Course.updateMany({ university: universityId }, { isdeleted: true }).exec();

        res.status("200").json({
            university,
            teachers,
            students,
            program,
            moocs,
            department,
            course
        })

    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const teacher = await models.Teacher.updateOne({ _id: teacherId }, { isdeleted: true }).exec();
        res.status("200").json({
            teacher
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const student = await models.Student.updateOne({ _id: studentId }, { isdeleted: true }).exec();
        res.status("200").json({
            student
        })
    } catch (err) {
        res.status(500).json(err);
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
                const university = await models.University.findById({ _id: uniId, isdeleted: false }).exec();
                if (!university) {
                    res.status(400).json({ message: "Invalid University Id" });
                    return;
                }

                const teacherSearch = await models.Teacher.find({ $or: [{ username: username }, { email: email }] }).exec();
                if (teacherSearch.length > 0) {
                    if (teacherSearch[0].isdeleted === true) {
                        res.status(403).json({ "message": "Teacher Currently Moved To Trash. Please contact administrator" });
                        return;
                    }
                    else {
                        res.status(400).json({ message: "Username or Email already exists" });
                        return;

                    }

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
                    isdeleted: false
                });

                const savedTeacher = await teacher.save();
                const token = generateToken(teacher.email);
                res.status(200).json({
                    _id: savedTeacher._id,
                    email: savedTeacher.email,
                    username: savedTeacher.username,
                    university: uniId,
                    token: token
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

        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const program = await models.Program.findById(programId).exec();
        if (!program) {
            res.status(400).json({ message: "Invalid Program Id" });
            return;
        }

        const teacher = await models.Teacher.findById({ _id: teacherId, isdeleted: false }).exec();
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
            approvalStatus: "pending",
            rating: [],
            material: ""
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
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

        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
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
        const teacher = await models.Teacher.findById({ _id: teacherId, isdeleted: false }).exec();
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
    const { assignmentId, university, courseId } = req.body;
    try {
        const questions = await models.Question.find({ assignment: assignmentId }).exec();
        const { university, courseId } = req.body;
        const students = await models.Student.find({ university: university, isdeleted: false }).exec();
        let totalStudents = [];
        for (var i = 0; i < students.length; i++) {
            const courses = students[i].courses;
            for (var j = 0; j < courses.length; j++) {
                if (courses[j].course === courseId) {
                    totalStudents.push(students[i]._id);
                }
            }
        }
        res.status(200).json({ questions, totalStudents })
    } catch (err) {
        res.status(500).json({ message: "ERROR" })
    }
}

const getCourseDetails = async (req, res) => {
    const { universityId, courseId } = req.body;
    try {

        models.University.find({ _id: universityId, isdeleted: false }, (err, university) => {
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
        const teacher = await models.Teacher.findById({ _id: teacherId, isdeleted: false }).exec();
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
        const student = await models.Student.find({ isdeleted: false }).exec();
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

const analysisStudentAllSubmissions = async (req, res) => {
    try {
        const { studentId, questionId } = req.body;
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        if (!student) {
            res.status(404).json({ "message": "Invalid Student ID" });
        }
        const question = await models.Question.findById(questionId).exec();
        if (!question) {
            res.status(404).json({ "message": "Invalid Question ID" });
        }
        const submissions = await models.Submission.find({ student: studentId, question: questionId });
        res.status(200).json({ submissions });
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
}

const individualSubmission = async (req, res) => {
    try {
        const { submissionId } = req.body;
        const submission = await models.Submission.findById(submissionId);
        res.status(200).json({ submission });
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
}

const changePlagarism = async (req, res) => {
    try {
        const { submissionId, plagValue } = req.body;
        const submission = await models.Submission.findById(submissionId);
        submission.plagarized = plagValue === 0 ? false : true;
        await submission.save();
        res.status(200).json({ "message": "Plagarism Changed!" })
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

const analysisTeacherToStudentGrade = async (req, res) => {
    try {
        const { submissionId, review } = req.body;
        const submission = await models.Submission.findById(submissionId);
        submission.review = review;
        await submission.save();
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: `${req.body.email}`,
            from: 'digantabanik2000@gmail.com',
            subject: 'Your Question Has Been Graded!',
            text: 'Sample Data',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();
        res.status(200).json({ "message": "EMAIL SENT!" })
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

const teacherAnalysisGetStudentTotal = async (req, res) => {

    try {
        const { university, courseId } = req.body;
        const students = await models.Student.find({ university: university, isdeleted: false }).exec();
        let totalStudents = [];
        for (var i = 0; i < students.length; i++) {
            const courses = students[i].courses;
            for (var j = 0; j < courses.length; j++) {
                if (courses[i].course === courseId) {
                    totalStudents.push(students[i]._id);
                }
            }
        }
        res.status(200).json({ totalStudents });

    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" });

    }

}

const teacherAnalysisAllSubmissionsForAQuestion = async (req, res) => {
    try {
        const { questionId } = req.body;
        const submissions = await models.Submission.find({ question: questionId }).exec();
        res.status(200).json({ submissions });
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" });

    }
}

const teacherDelete = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
}

// --------------------------------------------------------------------------------------------- End Teacher Controllers --------------------------------------------------------------------------------------------- //

//  --------------------------------------------------------------------------------------------- Student Controllers --------------------------------------------------------------------------------------------- //



const studentSignUp = async (req, res) => {
    const { name, email, password, uniId, programId, registrationNumber, rollNumber, gender } = req.body;
    try {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                res.status(500).json(err);
            else {
                // check if valid uniId
                models.University.find({ _id: uniId, isdeleted: false }, (err, university) => {
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
                                        if (student[0].isdeleted === false) {
                                            res.status(403).json({ "message": "Student moved to Trash" });
                                            return;
                                        }
                                        res.status(200).json({ message: "Student already exists" });
                                    }
                                    else {
                                        const student = new models.Student({
                                            name: name,
                                            email: email,
                                            password: hash,
                                            university: uniId,
                                            status: "waitlist",
                                            program: programId,
                                            registrationNumber: registrationNumber,
                                            rollNumber: rollNumber,
                                            gender: gender,
                                            submissions: [],
                                            isdeleted: false
                                        });
                                        student.save((err) => {
                                            if (err)
                                                res.status(500).json(err);
                                            else {
                                                const token = generateToken(email);
                                                res.status(200).json({ auth: true, token: token, _id: student._id, university: uniId });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else {
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
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json(err);
    }
}

const getAssignmentsOfStudent = async (req, res) => {
    const { studentId } = req.body;
    try {

        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
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
    const { universityId, teacherId, programId, name, description, courseCode, courseType, expectedCourseDuration, courseCompilers, courseStartDate, approvalStatus } = req.body;
    try {
        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
        if (!university) {
            res.status(400).json({ message: "Invalid University Id" });
            return;
        }

        const program = await models.Program.findById(programId).exec();
        if (!program) {
            res.status(400).json({ message: "Invalid Program Id" });
            return;
        }

        const teacher = await models.Teacher.findById({ _id: teacherId, isdeleted: false }).exec();
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
            approvalStatus: "pending",
            rating: [],
            material: ""
        });

        const savedMoocs = await moocs.save();
        res.status(200).json({ message: "Public Lab added successfully" });

    } catch (err) {
        res.status(500).json({ message: "internal server error" })
    }
}


const approveMoocs = async (req, res) => {
    const { moocsId } = req.body;
    try {
        const moocs = await models.Moocs.findById(moocsId).exec();


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
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        const moocsList = student.moocs;
        res.status(200).json({ moocsList });

    } catch (err) {
        res.status(500).json({ err });
    }
}

const enrollStudentToMooc = async (req, res) => {
    try {
        const { studentId, moocId } = req.body;

        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();

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

const getAssignmentsFromMoocs = async (req, res) => {
    const { moocId } = req.body;
    try {
        const assignments = await models.MoocsAssignment.find({ mooc: moocId }).exec();
        res.status(200).json({ assignments })
    }
    catch (err) {
        res.status(500).json({ message: "error" })
    }
}
const getQuestionsInMooc = async (req, res) => {
    const { assignmentId } = req.body;
    try {
        const questions = await models.MoocsQuestion.find({ moocassignment: assignmentId }).exec();
        res.status(200).json({ questions })
    } catch (err) {
        res.status(500).json({ message: "ERROR" })
    }
}

const getMoocQuestionById = async (req, res) => {
    const { questionId } = req.body;
    try {
        models.MoocsQuestion.findById(questionId, (err, question) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (question) {
                    const result = {
                        _id: question._id,
                        title: question.title,
                        question: question.question,
                        mooc: question.course,
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

const submitCodeToMoocs = async (req, res) => {
    const { student_id, code, question_id, language_id } = req.body;
    let plagarized = false;
    try {

        const question = await models.MoocsQuestion.findById(question_id).exec();
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

        question.studentsAttempted.push(student_id);

        if (submissionResponse.data.status.id === 3) {
            question.studentsCorrect.push(student_id);
        } else {
            question.studentsIncorrect.push(student_id);
        }

        const getSubmissionData = await models.Submission.find({ question: question_id }).exec();

        const questionSave = await question.save();


        res.status(200).json(submissionResponse.data);
    }
    catch (error) {
        res.status(500).json(error);
    }

}

const getMoocsCreatedByTeacher = async (req, res) => {
    try {

        const { teacherId } = req.body;
        const teacher = await models.Teacher.findById({ _id: teacherId, isdeleted: false }).exec();
        if (!teacher)
            res.status(404).json({ "message": "No Teacher Found" })
        const moocs = await models.Moocs.find({ teacher: teacherId }).exec();
        res.status(200).json({ moocs });

    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
}
// ---------------------------------------------------------------------------------------------End Of Moocs Controllers --------------------------------------------------------------------------------------------- //



const getRemainingStudents = async (req, res) => {
    const { universityId, courseId } = req.body;
    let allStudents = [];
    const results = [];
    try {
        const students = await models.Student.find({ university: universityId, isdeleted: false });
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
        res.status(500).json(error);
    }
}

const getUniversityStudentCount = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        models.Student.find({ university: universityId, isdeleted: false }, (err, students) => {
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
        models.Teacher.find({ _id: teacherId, university: universityId, isdeleted: false }, (err, teacher) => {
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
        models.Teacher.find({ university: universityId, status: "waitlist", isdeleted: false }, (err, teachers) => {
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
        models.Teacher.find({ _id: teacherId, university: universityId, status: "waitlist", isdeleted: false }, (err, teacher) => {
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
        models.Teacher.find({ _id: teacherId, university: universityId, status: "waitlist", isdeleted: false }, (err, teacher) => {
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
        models.Student.find({ university: universityId, status: "waitlist", isdeleted: false }, (err, students) => {
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
        models.Student.find({ _id: studentId, university: universityId, status: "waitlist", isdeleted: false }, (err, student) => {
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
        models.Student.find({ _id: studentId, university: universityId, status: "waitlist", isdeleted: false }, (err, student) => {
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
        models.Student.find({ _id: studentId, university: universityId, status: "waitlist", isdeleted: false }, (err, student) => {
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
        models.Student.find({ university: universityId, status: "waitlist", isdeleted: false }, (err, students) => {
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
        models.Student.find({ university: universityId, status: "waitlist", isdeleted: false }, (err, students) => {
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
            else {
                res.status(200).json(universities);

            }
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
                                if (teacher[0].isdeleted === true) {
                                    res.status(403).json({ "message": "Teacher moved to trash" })
                                }
                                const token = generateToken(teacher[0].email);
                                res.status(200).json({ auth: true, token: token, _id: teacher[0]._id, universityId: teacher[0].university });
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
    try {
        models.University.find({ _id: universityId, isdeleted: false }, (err, university) => {
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
                                    models.Teacher.find({ _id: teacherId, isdeleted: false }, (err, teacher) => {
                                        if (err)
                                            res.status(500).json(err);
                                        else {
                                            if (teacher.length > 0) {
                                                models.Teacher.updateOne({ _id: teacherId, isdeleted: false }, { $push: { courses: courseId } }, (err) => {
                                                    if (err) {
                                                        res.status(500).json(err);

                                                    }
                                                    else {
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
        models.Teacher.find({ _id: teacherId, isdeleted: false }, (err, teacher) => {
            if (err)
                res.status(500).json(err);
            else {
                if (teacher.length > 0) {
                    //    find all course details from course array
                    models.Course.find({ _id: { $in: teacher[0].courses } }, (err, courses) => {
                        if (err)
                            res.status(500).json(err);
                        else {
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
    let val = false;
    models.University.find({ _id: universityId, isdeleted: false }, (err, university) => {
        if (err)
            return false;
        else {
            if (university.length > 0) {
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
        models.Teacher.find({ _id: teacherId, isdeleted: false }, (err, teacher) => {
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
                "stdin": question.input,
                "expected_output": question.output
            }
        };

        const response = await axios.request(options);
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

        addSubmissionLog(submissionResponse.data.token);

        const newSubmission = new models.Submission({
            student: student_id,
            question: question_id,
            code: code,
            language: language_id,
            status: submissionResponse.data.status.id,
            statusDescription: submissionResponse.data.status.description,
            dateCreated: new Date().toISOString(),
            plagarized: false
        });

        const submissionToDB = await newSubmission.save();

        question.studentsAttempted.push(student_id);
        if (submissionResponse.data.status.id === 3) {
            question.studentsCorrect.push(student_id);
        } else {
            question.studentsIncorrect.push(student_id);
        }

        const getSubmissionData = await models.Submission.find({ question: question_id }).exec();

        const checker = new PlagiarismChecker(getSubmissionData, student_id);
        const plagarismCheck = checker.check();

        question.plagarismAnalysis = plagarismCheck;

        if (plagarismCheck[plagarismCheck.length - 1].isPlagiarized) {
            plagarized = true;
        }

        const questionSave = await question.save();



        if (plagarized) {
            const submissionByIdUpdate = await models.Submission.findByIdAndUpdate(submissionToDB._id, { plagarized: true }).exec();
            if (!submissionByIdUpdate) {
                res.status(500).json({ message: "Error updating submission" });
            }
        }
        res.status(200).json(submissionResponse.data);
    }
    catch (error) {
        res.status(500).json(error);
    }

}





const getTeacherData = async (req, res) => {
    const { teacherId } = req.body;
    try {
        models.Teacher.find({ _id: teacherId, isdeleted: false }, (err, teacher) => {
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
    try {

        const checkTeacherId = true
        const courses = [];
        if (checkTeacherId) {
            const y = JSON.parse(courseIds);
            for (let i = 0; i < courseIds.length; i++) {
                models.Course.find({
                    _id: new ObjectId(courseIds[i]),
                }, (err, course) => {
                    if (err) {
                    } else {
                        if (course.length > 0) {
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
        models.University.findById({ _id: universityId, isdeleted: false }, (err, university) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (university) {
                    models.Student.find(
                        { universityId: universityId, isdeleted: false },
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
                                if (student[0].isdeleted === true) {
                                    res.status(403).json({ "message": "Student moved to trash" });
                                    return;
                                }
                                const token = generateToken(student[0].email);
                                res.status(200).json({ auth: true, token: token, _id: student[0]._id, university: student[0].university });
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
        models.Student.find({ _id: studentId, isdeleted: false }, (err, student) => {
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
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        if (!student) {
            res.status(404).json({ message: "Invalid student id" });
            return;
        }

        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
        if (!university) {
            res.status(404).json({ message: "Invalid university id" });
            return;
        }

        if (student.university !== universityId) {
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }


        const course = await models.Course.findById({ _id: courseId }).exec();

        if (!course) {
            res.status(404).json({ message: "Invalid course id" });
            return;
        }

        if (course.university !== universityId) {
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

        let enrolled = false;

        for (var courseOfStudent of student.courses) {
            if (courseOfStudent.course_id === courseId) {
                enrolled = true;
            }
        }

        if (!enrolled) {
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

        const question = await models.Question.findById({ _id: questionId }).exec();

        if (question.course !== courseId) {
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

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
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        if (!student) {
            res.status(404).json({ message: "Invalid student id" });
            return;
        }

        const university = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
        if (!university) {
            res.status(404).json({ message: "Invalid university id" });
            return;
        }

        if (student.university !== universityId) {
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }


        const course = await models.Course.findById({ _id: courseId }).exec();

        if (!course) {
            res.status(404).json({ message: "Invalid course id" });
            return;
        }

        if (course.university !== universityId) {
            res.status(403).json({ message: "FORBIDDEN" });
            return;
        }

        let enrolled = false;

        for (var courseOfStudent of student.courses) {
            if (courseOfStudent.course_id === courseId) {
                enrolled = true;
            }
        }

        if (!enrolled) {
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
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
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


            if (submission.status === '3') {
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
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
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

const getStudentSelfAnalysisSingleQuestion = async (req, res) => {
    try {
        const { studentId, questionId } = req.body;
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        if (!student) {
            res.status(404).json({ "message": "Not found" })
        }
        const submissions = await models.Submission.find({ question: questionId });
        res.status(200).json({ submissions });
    } catch (err) {
        res.status(500).json(err);
    }
}

const getStudentAnalysisSingleQuestion = async (req, res) => {
    try {
        const { studentId, questionId } = req.body;
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        if (!student) {
            res.status(404).json({ "message": "Not found" })
        }
        const submissions = await models.Submission.find({ question: questionId }).exec();
        let allSubmissions = {}

        for (var i = 0; i < submissions.length; i++) {
            if (submissions[i].student in allSubmissions) {
                const temp = allSubmissions[submissions[i].student];
                temp.push(submissions[i]);
                allSubmissions[submissions[i].student] = temp;
            } else {

                const temp = []
                temp.push(submissions[i])
                allSubmissions[submissions[i].student] = temp;
            }
        }
        res.status(200).json({ allSubmissions });
    } catch (err) {
        res.status(500).json(err);
    }
}

const getStudentCourseAnalysis = async (req, res) => {
    try {
        const { studentId } = req.body;
        const student = await models.Student.findById({ _id: studentId, isdeleted: false }).exec();
        if (!student) {
            res.status(404).json({ "message": "Not found" })
        }
        const courses = student.courses;
        res.status(200).json({ courses })
    } catch (err) {
        res.status(500).json(err);
    }
}
// ------------------------------------------------------------------ ADMIN SECTION ---------------------------------------------------
const adminSignIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        // const validate = await signUpSchema.validateAsync({ username, password });
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            // const time = new Date.getTime() / 1000();
            const token = generateToken(username);
            res.status(200).json({ auth: true, token: token });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}



const adminUniversityData = async (req, res) => {
    try {
        const universities = await models.University.find().select('_id name phone email contract isdeleted').exec();
        res.status(200).json({ universities });
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
}

const adminGetIndividualUniversityData = async (req, res) => {
    try {
        const { universityId } = req.body;
        const universityDetails = await models.University.findById({ _id: universityId, isdeleted: false }).exec();
        if (!universityDetails) {
            res.status(404).json({ "message": "No Data Found" });
        }
        const teachers = await models.Teacher.find({ university: universityId }).select('name username _id email department courses isdeleted').exec();
        if (!teachers) {
            res.status(404).json({ "message": "No Data Found" });
        }

        const students = await models.Student.find({ university: universityId }).select('name university registrationNumber rollNumber program isdeleted').exec();
        res.status(200).json({ universityDetails, teachers, students });
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
}


const restoreUniversity = async (req, res) => {
    const { universityId } = req.body;
    try {
        const university = await models.University.updateOne({ _id: universityId }, { isdeleted: false }).exec();
        const teachers = await models.Teacher.updateMany({ university: universityId }, { isdeleted: false }).exec();
        const students = await models.Student.updateMany({ university: universityId }, { isdeleted: false }).exec();
        const program = await models.Program.updateMany({ university: universityId }, { isdeleted: false }).exec();
        // const moocs = await models.Moocs.updateMany({ university: universityId }, { isdeleted: false }).exec();
        const department = await models.Department.updateMany({ university: universityId }, { isdeleted: false }).exec();
        const course = await models.Course.updateMany({ university: universityId }, { isdeleted: false }).exec();

        res.status("200").json({
            university,
            teachers,
            students,
            program,
            moocs,
            department,
            course
        })
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" })
    }
}

const restoreTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const teacher = await models.Teacher.updateOne({ _id: teacherId }, { isdeleted: false }).exec();
        res.status("200").json({
            teacher
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

const restoreStudent = async (req, res) => {
    try {
        const { studentId } = req.body;
        const student = await models.Student.updateOne({ _id: studentId }, { isdeleted: false }).exec();
        res.status("200").json({
            student
        })
    } catch (err) {
        res.status(500).json(err);
    }
}


// Utilities
// Payment

const createPayment = async (req, res) => {
    const { year } = req.body;
    const line_items = [
        {
            price: 'price_1NBY9kSIgS8Gcj6RZtKTSBmp',
            quantity: 1
        }
    ];
    console.log(year)
    if (year == 1) {
        line_items[0].price = "price_1NBY9kSIgS8Gcj6RZtKTSBmp"
    }
    if (year == 2) {
        line_items[0].price = "price_1NBYCnSIgS8Gcj6R8NW6tuKt";
        console.log("here", line_items)
    }
    if (year == 3) {
        line_items[0].price = "price_1NBYDWSIgS8Gcj6RV0ngF9hG"
    }
    const customer = await stripe.customers.create({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
    });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        customer: customer.id,
        success_url: 'http://localhost:3000/university/purchase/success',
        cancel_url: 'http://localhost:3000/university//purchase/fail',
    });
    res.json({ url: session.url })
};

const webhookForStripe = async (request, response) => {
    const event = request.body;
    switch (event.type) {
        case 'charge.succeeded' || 'payment_intent.succeeded':
            const chargeSucceeded = event.data.object;
            const email = chargeSucceeded.billing_details.email;
            const university = await models.University.find({ email: email }).exec();
            if (!university) {
                res.status(400).json({ message: "Error! Invalid Payment! Please contact admin asap." })
                return;
            }
            const originalDate = new Date(chargeSucceeded.created * 1000); // Create a new Date object with the given Unix timestamp (in seconds)
            const newDate = new Date(originalDate.getTime()); // Create a new Date object with the same time value as the original date

            newDate.setFullYear(newDate.getFullYear() + 2); // Add 2 years to the new date
            const newContract = {
                contract_id: chargeSucceeded.id,
                contract_type: "bi-yearly",
                contract_receipt: chargeSucceeded.receipt_url,
                contract_amount: chargeSucceeded.contract_amount,
                contract_status: chargeSucceeded.status,
                contract_billing_details: JSON.stringify(chargeSucceeded.billing_details),
                contract_start_date: originalDate,
                contract_end_date: newDate
            }
            const updateUniversity = await models.University.updateOne({ _id: university[0]._id },
                {
                    contract: newContract
                }
            )

            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            break;
        default:
    }
    response.json({ received: true });
};


const emailSender = async (req, res) => {
    const { to, from, subject, text, html } = req.body;
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //     to: to,
    //     from: from,
    //     subject: subject,
    //     text: text,
    //     html: html,
    // };
    // (async () => {
    //     try {
    //         await sgMail.send(msg);
    //     } catch (error) {
    //         console.error(error);

    //         if (error.response) {
    //             console.error(error.response.body)
    //         }
    //     }
    // })();

    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: to, // Change to your recipient
        from: from, // Change to your verified sender
        subject: subject,
        text: text,
        html: html,
    }
    sgMail
        .send(msg)
        .then(() => {
            res.status(200).json({ message: "Email sent" });
        })
        .catch((error) => {
            console.error(error)
            if (error.response) {
            }
            res.status(400).json({ message: "Something went wrong" });
        })
}

const addRatings = async (req, res) => {
    const { courseId, studentId, rating, type } = req.body;

    try {
        let course;
        if (type == 0) {
            course = await models.Course.findById(courseId).exec();
        }
        else {
            course = await models.Moocs.findById(courseId).exec();
        }

        if (!course) {
            res.status(404).json({ "message": "Course Not Found" });
            return;
        }
        const student = await models.Student.findById(studentId).exec();
        if (!student) {
            res.status(404).json({ "message": "Student Not Found" });
            return;
        }

        const newRating = {
            studentId: studentId,
            rating: rating,
        };

        const index = course.rating.findIndex((r) => r.studentId === studentId);

        if (index === -1) {
            course.rating.push(newRating);
        } else {
            course.rating[index].rating = rating;
        }

        await course.save();

        res.status(200).json({ message: "Rating Added/Changed Successfully" });

    }
    catch {
        res.status(500).json(err);
    }
}

const getAverageRatings = async (req, res) => {
    const { courseId, type } = req.body;
    try {
        let course;
        if (type == 0) {
            course = await models.Course.findById(courseId).exec();
        } else {
            course = await models.Moocs.findById(courseId).exec();
        }
        if (!course) {
            res.status(404).json({ "message": "Course Not Found" });
            return;
        }

        const totalRatings = course.rating.reduce((total, rating) => total + rating.rating, 0);
        const totalRaters = course.rating.length;
        const averageRatings = totalRatings / totalRaters;
        const roundedAverage = averageRatings.toFixed(2);
        res.status(200).json({ "AverageRatings": roundedAverage });
    } catch (err) {
        res.status(500).json(err);
    }
}

const resetRequest = async (req, res) => {
    const { id, to, from } = req.body;
    const newOTP = generateOTP();
    OTP.set(id, newOTP);
    setTimeout(() => {
        OTP.delete(id);
    }, 600000);
    const subject = 'Password Reset Request';
    const text = `Your OTP to reset password is ${newOTP}. It expires in 10 minutes`;
    const html = `<span>Your OTP to reset password is ${newOTP}. It expires in 10 minutes</span>`
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: to,
        from: from,
        subject: subject,
        text: text,
        html: html,
    };
    sgMail
        .send(msg)
        .then(() => {
            res.status(200).json({ message: "OTP sent!" });
        })
        .catch((error) => {
            console.error(error)
            if (error.response) {
            }
            res.status(400).json({ message: "Something went wrong" });
        })
}


const resetPassword = async (req, res) => {
    try {
        const { id, otp, type, password } = req.body;
        if (OTP.has(id)) {
            if (OTP.get(id) === otp) {
                if (type === 'University') {
                    await models.University.updateOne({ email: id }, {
                        password: password
                    }).exec();
                }
                else if (type === 'Teacher') {
                    await models.Teacher.updateOne({ email: id }, {
                        password: password
                    }).exec();
                }
                else if (type === 'Student') {
                    await models.Student.updateOne({ email: id }, {
                        password: password
                    }).exec();
                }
            } else {
                res.status(404).json({ "message": "OTP expired" });
                return;
            }
        }
        return res.status(200).json({ "message": "done" })
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

const addResource = async (req, res) => {
    try {
        const { courseId, resource, type } = req.body;
        let course;
        if (type === 'course') {
            course = await models.Course.updateOne({ _id: courseId }, { material: resource }).exec();
        } else {
            course = await models.Moocs.updateOne({ _id: courseId }, { material: resource }).exec();
        }

        if (!course) {
            res.status(404).json({ "message": "forbidden" });
            return;
        } else {
            res.status(200).json({ "message": "resource added successfully" });
            return;
        }
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

const getResource = async (req, res) => {
    try {
        const { courseId, type } = req.body;
        let course, resource = '';
        if (type === 'course') {
            course = await models.Course.findById({ _id: courseId }).exec();
            resource += course.material;
        } else {
            course = await models.Moocs.findById({ _id: courseId }).exec();
            resource += course.material;
        }

        if (!course) {
            res.status(404).json({ "message": "forbidden" });
            return;
        } else {
            res.status(200).json({ "resource": resource });
            return;
        }
    } catch (err) {
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

const UptimeLogs = async (req, res) => {
    try {
        const uptime = await models.UptimeLogs.find({}).exec();
        res.status(200).json({ uptime });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}
// ------------------------------------------------------------------ END ADMIN SECTION ---------------------------------------------------


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
    addQuestionToMoocs,
    getAssignmentsFromMoocs,
    getQuestionsInMooc,
    getMoocQuestionById,
    submitCodeToMoocs,
    analysisStudentAllSubmissions,
    individualSubmission,
    changePlagarism,
    teacherAnalysisAllSubmissionsForAQuestion,
    analysisTeacherToStudentGrade,
    teacherAnalysisGetStudentTotal,
    adminUniversityData,
    deleteUniversity,
    teacherDelete,
    getStudentAnalysisSingleQuestion,
    getStudentCourseAnalysis,
    deleteTeacher,
    deleteStudent,
    restoreUniversity,
    restoreTeacher,
    restoreStudent,
    adminGetIndividualUniversityData,
    createPayment,
    webhookForStripe,
    emailSender,
    addRatings,
    getAverageRatings,
    resetPassword,
    resetRequest,
    addResource,
    getResource,
    UptimeLogs
};

