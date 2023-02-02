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
        data: `{"language_id":63,"source_code":"${encoded}"}`
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



const signupTeacher = async (req, res) => {
    const { name, username, email, password, uniId } = req.body;
    try {
        const validate = await signUpSchema.validateAsync({ username, password, email });
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                res.status(500).json(err);
            } else {
                // find if valid uniId
                models.University.findById(uniId, (err, university) => {
                    if (err) {
                        res.status(500).json(err);
                    } else if (!university) {
                        res.status(400).json({ message: "Invalid University Id" });
                    } else {
                        models.Teacher.find({ $or: [{ username: username }, { email: email }] }, async (err, teacher) => {
                            if (err) {
                                res.status(500).json(err);
                            } else if (teacher.length) {
                                console.log(teacher);
                                res.status(400).json({ message: "Teacher already exists" });
                            } else {
                                const newTeacher = new models.Teacher({
                                    name: name,
                                    username: username,
                                    email: email,
                                    password: hash,
                                    status: 'waitlist',
                                    university: uniId

                                });
                                console.log(newTeacher);
                                await newTeacher.save((err) => {
                                    if (err)
                                        res.status(500).json(err);
                                    else {
                                        const token = generateToken(username, email);
                                        res.status(200).json({ auth: true, token: token });
                                    }
                                });
                            }
                        });
                    }
                })

            }
        });
    } catch (error) {
        res.status(422).json(error);
    }
}

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
                        await newUniversity.save((err) => {
                            if (err)
                                res.status(500).json(err);
                            else {
                                const token = generateToken(email);
                                res.status(200).json({ auth: true, token: token, id: newUniversity._id });
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
                        res.status(200).json({ auth: true, token: token, id: university[0]._id });
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

const universityTeacherData = async (req, res) => {
    console.log(req.body.universityId);
    models.University.find({ _id: req.body.universityId, status: "active" }, (err, university) => {
        if (err)
            res.status(500).json(err);
        else {
            models.Teacher.find({ university: university[0]._id }, (err, teachers) => {
                if (err)
                    res.status(500).json(err);
                else
                    res.status(200).json(teachers);
            });

        }
    })
}

const universityTeacherCount = async (req, res) => {
    models.University.find({ email: req.body.email }, (err, university) => {
        if (err)
            res.status(500).json(err);
        else {
            models.Teacher.find({ university: university[0]._id }, (err, teachers) => {
                if (err)
                    res.status(500).json(err);
                else
                    res.status(200).json({ count: teachers.length });
            });
        }
    })
}

const universityEdit = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        const university = await models.University.findById(universityId);
        if (req.body.phone) {
            university.phone = req.body.phone;
        }
        if (req.body.email) {
            university.email = req.body.email;
        }
        if (req.body.password) {
            university.password = req.body.password;
        }
        if (req.body.point_of_contact) {
            university.point_of_contact = req.body.point_of_contact;
        }
        if (req.body.address) {
            university.address = req.body.address;
        }
        if (req.body.website) {
            university.website = req.body.website;
        }
        await university.save((err) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json({ message: "University updated" });
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const getUniversityContract = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        const university = await models.University.findById(universityId, (err, university) => {
            if (err)
                res.status(500).json(err);
            else
                res.status(200).json(university.contract);
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const contractExpiryDetails = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        const university = await models.University.findById(universityId, (err, university) => {
            if (err)
                res.status(500).json(err);
            else {
                const contractExpiry = {
                    contractExpiry: university.contract[0].contractExpiry,
                    contractExpiryDate: university.contract[0].contractExpiryDate,
                    contractExpiryTimeRemaining: new Date(university.contract[0].contractExpiryDate).getTime() - new Date().getTime()
                }
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}


const getUniversityStudentData = async (req, res) => {
    const universityId = req.body.universityId;
    try {
        models.Student.find({ university: universityId }, (err, students) => {
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

const studentSignUp = async (req, res) => {
    const { name, email, password, uniId } = req.body;
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
                                            status: "waitlist"
                                        });
                                        student.save((err) => {
                                            if (err)
                                                res.status(500).json(err);
                                            else {
                                                const token = generateToken(email);
                                                res.status(200).json({ auth: true, token: token, id: student._id });
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
                                res.status(200).json({ auth: true, token: token });
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




 
const addCourse = async (req, res) => {
    const { 
        universityId,
        name,
        description,
        courseCode,
        courseType,
        expectedCourseDuration,
        courseCompilers,
    } = req.body;
    try{
        models.University.find({ _id: universityId }, (err, university) => {
            if(err){
                res.status(500).json(err);
            }else{
                // add course
                if(university.length > 0){
                    const course = new models.Course({
                        university: universityId,
                        name: name,
                        description: description,
                        courseCode: courseCode,
                        courseType: courseType,
                        expectedCourseDuration: expectedCourseDuration,
                        courseCompilers: courseCompilers,
                    });
                    course.save((err) => {
                        if(err){
                            res.status(500).json(err);
                        }else{
                            res.status(200).json({ message: "Course added successfully" });
                        }
                    });
                }else{
                    res.status(200).json({ message: "Invalid university id" });
                }
            }
    })
    }catch(error){
        res.status(500).json(error);
    }
}

const addCourseTeacher = async (req, res) => {
    const {
        universityId,
        courseId,
        teacherId,
    } = req.body;
    try{
        models.University.find({ _id: universityId }, (err, university) => {
            if(err){
                res.status(500).json(err);
            }else{
                if(university.length > 0){
                    models.Course.find({_id: courseId}, (err, course) => {
                        if(err)
                            res.status(500).json(err);
                        else{
                            if(course.length > 0){
                                if(course[0].university == universityId){
                                    models.Teacher.find({_id: teacherId}, (err, teacher) => {
                                        if(err)
                                            res.status(500).json(err);
                                        else{
                                            if(teacher.length > 0){
                                                models.Teacher.updateOne({_id: teacherId}, {$push: {courses: courseId}}, (err) => {
                                                    if(err)
                                                        res.status(500).json(err);
                                                    else{
                                                        res.status(200).json({ message: "Course added successfully" });
                                                    }
                                                });
                                            }else{
                                                res.status(200).json({ message: "Invalid teacher id" });
                                            }
                                        }
                                    });
                                }else{
                                    res.status(200).json({ message: "Invalid course id" });
                                }
                            }else{
                                res.status(200).json({ message: "Invalid course id" });
                            }
                        }
                    });
                }else{
                    res.status(200).json({ message: "Invalid university id" });
                }
            }
        });
    }catch(error){
        res.status(500).json(error);
    }
}


const getCoursesForTeacher = async (req, res) => {
    const { teacherId } = req.body;
    try{
        models.Teacher.find({_id: teacherId}, (err, teacher) => {
            if(err)
                res.status(500).json(err);
            else{
                if(teacher.length > 0){
                    res.status(200).json(teacher[0].courses);

                }else{
                    res.status(200).json({ message: "Invalid teacher id" });
                }
            }
        });
    }catch(error){
        res.status(500).json(error);
    }
}

const addQuestion = async (req, res) => {
    const {
        courseId,
        universityId,
        teacherId,
        title,
        question,
        input,
        output,
        difficulty,
        category,
        tags,
        datePublished
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
                                if (course[0].university !== universityId) {
                                    res.status(200).json({ message: "Invalid course id" });
                                }
                                models.Teacher.find({ _id: teacherId }, (err, teacher) => {
                                    if (err)
                                        res.status(500).json(err);
                                    else {
                                        if (teacher.length > 0) {
                                            if (teacher[0].university !== universityId) {
                                                res.status(200).json({ message: "Invalid teacher id" });
                                            }
                                            if (!teacher[0].course===courseId) {
                                                res.status(200).json({ message: "Invalid course id" });
                                            }
                                            const questionNew = new models.Question({
                                                university: universityId,
                                                course: courseId,
                                                teacher: teacherId,
                                                title: title,
                                                question: question,
                                                input: input,
                                                output: output,
                                                difficulty: difficulty,
                                                category: category,
                                                tags: tags,
                                                dateCreated: new Date().toISOString(),
                                                dateModified: new Date().toISOString(),
                                                datePublished: datePublished,
                                            });
                                            questionNew.save((err) => {
                                                if (err) {
                                                    res.status(500).json(err);
                                                } else {
                                                    res.status(200).json({ message: "Question added successfully" });
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
                        }
                    });
                } else {
                    res.status(200).json({ message: "Invalid university id" });
                }
            }
        })
    } catch (error) {
        res.status(500).json(error);
    }
}






const checkUniversityIdValidity = async (universityId) => {
    const res = models.University.find({_id: universityId}, (err, university) => {
        if(err)
            return false;
        else{
            if(university.length > 0)
                return true;
            else
                return false;
        }
    });
    return res;
}

const checkCourseIdValidity = async (universityId, courseId) => {
    const checkUniId = await checkUniversityIdValidity(universityId);
    if(checkUniId){
        models.Course.find({_id: courseId}, (err, course) => {
            if(err)
                return false;
            else{
                if(course.length > 0 && course[0].university === universityId)
                    return true;
                else
                    return false;
            }
        });
    }else{
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
    try {
        models.Question.find({ _id: question_id }, (err, question) => {
            if (err) {
                res.status(500).json(err);
            } else {
                if (question.length > 0) {
                    console.log(question[0])
                    console.log("INPUT:",question[0].input)
                    let encoded = base64encode(code);
                    console.log({encoded})
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
                        data:{
                            "language_id": language_id,
                            "source_code": encoded,
                            "stdin": base64encode(question[0].input),
                            "expected_output": base64encode(question[0].output)
                        }
                    };
                    console.log({options})
                    axios.request(options).then(function (response) {
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

                    }).catch(function (error) {
                        console.error(error);
                        res.status(500).json(error);
                    });
                } else {
                    res.status(200).json({ message: "Invalid question id" });
                }
            }
        });
    } catch (error) {
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
    universityEdit,
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
};

