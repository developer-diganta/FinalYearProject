const express = require("express");
const authorise = require("../../middlewares/authorise");
const authoriseUniversity = require("../../middlewares/authoriseUniversity");
const controls = require("../../controller/control");

const router = express.Router();

router.patch("/university/edit", authoriseUniversity, controls.universityEdit);

module.exports = router;