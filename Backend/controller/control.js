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
            else
            {
                const options = {
                    method: 'GET',
                    url: 'https://judge0-ce.p.rapidapi.com/submissions/' + response.data.token,
                    params: {base64_encoded: 'true', fields: '*'},
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
    const { name, username, email, password } = req.body;
    console.log(username);
    try {
        const validate = await signUpSchema.validateAsync({ username, password, email });
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                 res.status(500).json(err);
            } else {
            models.Teacher.find({ $or: [{ username: username }, {email:email} ]}, async (err, teacher) => {
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
        });
    } catch(error) {
        res.status(422).json(error);
    }
}

const adminSignIn = async (req, res) => {
    const { username, password } = req.body;
    try {
        const validate = await signUpSchema.validateAsync({ username, password });
        if (username ===  process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const time = new Date.getTime() / 1000();
            const token = generateToken(username, time);
            adminLogin = {
                token: token,
                ip: req.ip
            }
            res.status(200).json({ auth: true, token: token });
        }
    }
    catch(error) {
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
                                { status: "pending" }
                            ]
                        });
                        console.log(newUniversity);
                        await newUniversity.save((err) => {
                            if (err)
                                res.status(500).json(err);
                            else {
                                const token = generateToken(email, phone);
                                res.status(200).json({ auth: true, token: token });
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
    console.log("here")
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
                        console.log("RRR",university)
                        const token = generateToken(email, university[0].phone);
                        res.status(200).json({ auth: true, token: token });
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
    models.University.find({ email: req.body.email }, (err, university) => {
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
    
};

