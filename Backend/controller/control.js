const express = require("express");

const router = express.Router();

const home = (req, res) => {
    res.send("Hello World!");
}

module.exports = {home};
