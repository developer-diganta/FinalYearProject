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


const nodemailer = require("nodemailer");

const {v4: uuidv4} = require('uuid');

const path = require('path');

// const passport = require("passport");
let languageIds = null;
const getProgrammingLanguageIds = async () => { 
    ids = await programmingLanguageIds();
}
getProgrammingLanguageIds();

require('dotenv').config();

//nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL, // generated ethereal user
      pass: process.env.AUTH_PASSWORD, // generated ethereal password
    },
});

//testing success
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take messages");
        console.log(success);
    }
});

const home = (req, res) => {
    res.status(200).send("Hello World!");
}

const languages = async (req, res) => {
    if (!ids)
        ids = await programmingLanguageIds();
    try {
        res.status(200).json(ids);
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
    console.log(name, username, email, password);
    try {
        // const validate = await signUpSchema.validateAsync({ username, password, email });
        console.log("validate");
        let teacher = await models.Teacher.find({ $or: [{ username: username }, { email: email }] });
        if(teacher.length > 0){
            console.log("temp");
            let teacher_verified = await models.UserVerification.find({ userId: teacher[0]._id });
            console.log(teacher_verified);
            if(teacher_verified.length > 0){
                console.log("temp1");
                res.status(200).json({ message: "User already exists" });
            }
            else{
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if (err) {
                         res.status(500).json(err);
                    } else {
                        await models.Teacher.deleteMany({ $or: [{ username: username }, {email:email} ]});
                            models.Teacher.find({ $or: [{ username: username }, {email:email} ]}, async (err, teacher) => {
                            if (err) {
                                res.status(500).json(err);
                            } else {
                                const newTeacher = new models.Teacher({
                                    name: name,
                                    username: username,
                                    email: email,
                                    password: hash,
                                    verified: false,
                                });
                                console.log(newTeacher);
                                newTeacher.save()
                                .then((result) => {
                                    sendVerificationEmail(result, res),
                                    console.log("result", result);
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }
                        });     
                    }
                });
            }
        }
        else{
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("*******************");
                     res.status(500).json(err);
                } else {
                        await models.Teacher.deleteMany({ $or: [{ username: username }, {email:email} ]});
                        models.Teacher.find({ $or: [{ username: username }, {email:email} ]}, async (err, teacher) => {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            const newTeacher = new models.Teacher({
                                name: name,
                                username: username,
                                email: email,
                                password: hash,
                                verified: false,
                            });
                            console.log(newTeacher);
                            newTeacher.save()
                            .then((result) => {
                                sendVerificationEmail(result, res),
                                console.log("result", result);
                            }).catch((err) => {
                                console.log(err);
                            });
                        }
                    });     
                }
            });
        }
    } catch(error) {
        res.status(422).json(error);
    }
}

// function verifyUser(){
    
// }

const sendVerificationEmail = async ({_id, email}, res) => {
    const currentUrl = "http://localhost:5000";
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Click on the link to verify your email.</p>
        <p><b>This link will expires in 6 hours.</b></p><p>Press <a href=${currentUrl + "/user/verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`,
    };
    const saltRounds = 10;
    bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
        const newVerification = new models.UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiredAt: Date.now()+21600000,
        });
        newVerification.save((err) => {
            if (err){
                res.status(500).json({
                    status: "Failed",
                    message: "Verification email failed",
                });
            }
            else {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                        res.json({
                            status: "Pending",
                            message: "Verification email sent",
                        });
                    }
                });
            }
        });
    })
    .catch(() => {
        res.json({ 
            status: "Failed",
            message: "Something went wrong"
        });
    });
};



//verify email get rut
const userVerify = async (req, res) => {
    const { id, uniqueString } = req.params;
    const user = await models.Teacher.findById(id);
    if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
                console.log("user", user);
                models.UserVerification.find({ userId: id })
                .then((result) => {
                        if(result.length > 0){
                                const { expiredAt } = result[0];
                                const hashedUniqueString = result[0].uniqueString;
                                if (Date.now() > expiredAt) {
                                        models.UserVerification.deleteOne({ userId: id })
                                        .then(result => {
                                                models.Teacher
                                                    .deleteOne({ _id: id })
                                                    .then(() => {
                                let message = "Link has expired. Please sign up again.";
                                res.redirect(`/user/verified?error=true&message=${message}`);
                            })
                            .catch((error) => {
                                    let message = "Clearing user with expired unique string failed.";
                                res.redirect(`/user/verified?error=true&message=${message}`);
                            })
                    })
                    .catch((err) => {
                            console.log(err);
                            let message = "An error occured while clearing expired user verification record.";
                            res.redirect(`/user/verified?error=true&message=${message}`);
                        })
                    } else {
                            //Valid record exists so we validate the user string
                            //First compare the unique string
                            bcrypt
                            .compare(uniqueString, hashedUniqueString)
                            .then((result) => {
                                    if(result){
                                            //String matched
                                            models.Teacher.updateOne({ _id: id }, { verified: true })
                                            .then(() => {
                                                    models.UserVerification.deleteOne({ userId: id })
                                                    .then(() => {
                                                            console.log("a94ng85ivn");
                                                            res.sendFile(path.join(__dirname, "../ViewPage/verified.html"));
                                                        })
                                                        .catch((error) => {
                                                                let message = "Clearing user verification record failed.";
                                                                res.redirect(`/user/verified?error=true&message=${message}`);
                                                            })
                                                        })
                                                        .catch(error => {
                                                                console.log(error);
                                                                let message = "An error occured while updating user record to show verified.";
                                                                res.redirect(`/user/verified?error=true&message=${message}`);
                                                            })
                                                        } else{
                                                                //Existing record but incorrect verification details passedObject.entries
                                                                let message = "Invalid verification details passed. Check your inbox.";
                                                                res.redirect(`/user/verified?error=true&message=${message}`);
                        }
                    })
                    .catch((err) => {
                            let message = "An error occured while comparing unique string.";
                            res.redirect(`/user/verified?error=true&message=${message}`);
                        })
                    }
                } else {
                let message = "Account record doesn't exist or has been already verified. Please try to login or signup";
                res.redirect(`/user/verified?error=true&message=${message}`);
            }
        })
        .catch((err) => {
            console.log(err);
            let message = "An error occured while checking user verification existance.";
            res.redirect(`/user/verified?error=true&message=${message}`);
        });
    }
    console.log(id, uniqueString);
};


//Display verified page

const verified = (req, res) => {
    res.sendFile(path.join(__dirname, "../ViewPage/notVerified.html"));
}

module.exports = {home, languages, submit, signupTeacher, verified, userVerify};

// const signupTeacher = async (req, res) => {
//     models.Teacher.register({
    //         username: req.body.username,
    //         email: req.body.email,
    //         name: req.body.name,
//     }, req.body.password, (err, user) => {
//         if (err) {
//             console.log(err);
//             res.status(500).json(err);
//         }
//         else {
    //             passport.authenticate("local")(req, res, () => {
        //                 res.status(200).json(user);
//             });
//         }
//     });
// }