const express = require("express");
const authorise = require("../../middlewares/authorise");
const authoriseUniversity = require("../../middlewares/authoriseUniversity");
const controls = require("../../controller/control");
const { route } = require("../..");


const router = express.Router();

// router.post('/', controls.home);
// Code editor routes
router.post('/submit', controls.submit);

router.post('/submit/student', controls.submitStudent);


// Admin routes
router.post("/admin/signin", controls.adminSignIn);



router.post("/university/signup", controls.universitySignUp);

router.post("/university/signin", controls.universityLogin);

router.post("/university/teacher", authoriseUniversity, controls.universityTeacherData);

router.post("/university/teacher/count", authoriseUniversity, controls.universityTeacherCount);

router.post("/university/contract", authoriseUniversity, controls.getUniversityContract);

router.post("/university/contract/expiry", authoriseUniversity, controls.contractExpiryDetails);

router.post("/university/student", authoriseUniversity, controls.getUniversityStudentData);

router.post("/university/student/count", authoriseUniversity, controls.getUniversityStudentCount);

router.post("/university/teacher/:id", authoriseUniversity, controls.getUniversityTeacherData);

router.post("/university/teacher/waitlist", authoriseUniversity, controls.getUniversityTeacherWaitlist);

router.post("/university/teacher/waitlist/:id", authoriseUniversity, controls.getUniversityTeacherWaitlistById);

router.post("/university/teacher/waitlist/accept/:id", authoriseUniversity, controls.acceptTeacherWaitlist);

router.post("/university/teacher/waitlist/reject/:id", authoriseUniversity, controls.rejectTeacherWaitlist);

router.post("/university/student/waitlist", authoriseUniversity, controls.getUniversityStudentWaitlist);

router.post("/university/student/waitlist/:id", authoriseUniversity, controls.getUniversityStudentWaitlistById);

router.post("/university/student/waitlist/accept/:id", authoriseUniversity, controls.acceptStudentWaitlist);

router.post("/university/student/waitlist/reject/:id", authoriseUniversity, controls.rejectStudentWaitlist);

router.post("/university/student/waitlist/accept/all", authoriseUniversity, controls.acceptAllStudentWaitlist);

router.post("/university/student/waitlist/reject/all", authoriseUniversity, controls.rejectAllStudentWaitlist);

router.post("/university/course", authoriseUniversity, controls.getUniversityCourse);

router.post("/university/allUniversities", authoriseUniversity, controls.getAllUniversities);

router.post("/university/course/teacher/:id", authoriseUniversity, controls.getUniversityCourseByTeacherId);



// Student routes
router.post("/student/signup", controls.studentSignUp);

// Teacher routes
router.post('/signup/teacher', controls.signupTeacher);

router.post("/teacher/signin", controls.teacherLogin);



module.exports = router; 