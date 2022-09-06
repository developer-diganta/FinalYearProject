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
const getProgrammingLanguageIds = async () => { 
    ids = await programmingLanguageIds();
}
getProgrammingLanguageIds();

require('dotenv').config();

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
    try {
        const validate = await signUpSchema.validateAsync({ username, password, email });
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                 res.status(500).json(err);
            } else {
                 const newTeacher = new models.Teacher({
                     name: name,
                     user_name: username,
                     email: email,
                     password: hash,
     
                 });
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
    } catch(error) {
        res.status(422).json(error);
    }
}


module.exports = {home, languages, submit, signupTeacher};


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