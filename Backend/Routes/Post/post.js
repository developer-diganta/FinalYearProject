const express = require("express");
const authorise = require("../../middlewares/authorise");
const authoriseUniversity = require("../../middlewares/authoriseUniversity");
const controls = require("../../controller/control");


const router = express.Router();

// router.post('/', controls.home);
router.post('/submit', controls.submit);

router.post('/signup/teacher', controls.signupTeacher);

router.post("/admin/signin", controls.adminSignIn);

router.post("/university/signup",controls.universitySignUp);

router.post("/university/signin", controls.universityLogin);

router.post("/university/teacher", authoriseUniversity, controls.universityTeacherData);

router.post("/university/teacher/count", authoriseUniversity, controls.universityTeacherCount);

router.post("/university/edit", authoriseUniversity, controls.universityEdit);

router.post("/university/contract", authoriseUniversity, controls.getUniversityContract);

router.post("/university/contract/expiry", authoriseUniversity, controls.contractExpiryDetails);

router.post("/university/student", authoriseUniversity, controls.getUniversityStudentData);

router.post("/university/student/count", authoriseUniversity, controls.getUniversityStudentCount);

module.exports = router; 