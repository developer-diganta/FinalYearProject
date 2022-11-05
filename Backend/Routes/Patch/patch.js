const express = require("express");
const authorise = require("../../middlewares/authorise");
const authoriseUniversity = require("../../middlewares/authoriseUniversity");
const controls = require("../../controller/control");

const router = express.Router();

router.patch("/university/edit", authoriseUniversity, controls.universityEdit);

router.patch("/university/teacher/edit/:id", authoriseUniversity, controls.universityTeacherEdit);

router.patch("/university/student/edit/:id", authoriseUniversity, controls.universityStudentEdit);

module.exports = router;