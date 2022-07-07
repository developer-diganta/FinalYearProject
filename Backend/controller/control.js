const express = require("express");
const router = express.Router();
const axios = require("axios");
const { base64encode, base64decode } = require('nodejs-base64');
const models = require("../Database/models");
require('dotenv').config();

const home = (req, res) => {
    res.status(200).send("Hello World!");
}

const languages = (req, res) => {

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/languages',
    headers: {
        'X-RapidAPI-Key': `122${process.env.COMPILER_API_KEY}`,
        'X-RapidAPI-Host': `${process.env.COMPILER_API_HOST}`
    }
    };

    axios.request(options).then(function (response) {
        res.status(200).json(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}

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
                res.status(200).send(response.data);
        });
    }).catch(function (error) {
        console.error(error);
    });
}

module.exports = {home, languages, submit};
