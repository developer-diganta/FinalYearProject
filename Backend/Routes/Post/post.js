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

router.post("/university/teacher/waitlist", controls.getUniversityTeacherWaitlist);


router.post("/university/signup", controls.universitySignUp);

router.post("/university/signin", controls.universityLogin);

router.post("/university/teacher", authoriseUniversity, controls.universityTeacherData);

router.post("/university/teacher/count", authoriseUniversity, controls.universityTeacherCount);

router.post("/university/contract", authoriseUniversity, controls.getUniversityContract);

router.post("/university/contract/expiry", authoriseUniversity, controls.contractExpiryDetails);

router.post("/university/student", authoriseUniversity, controls.getUniversityStudentData);

router.post("/university/course/remainingStudents",  controls.getRemainingStudents);

router.post("/university/student/count", authoriseUniversity, controls.getUniversityStudentCount);

router.post("/university/teacher/:id", authoriseUniversity, controls.getUniversityTeacherData);


// router.post("/university/teacher/waitlist/:id", authoriseUniversity, controls.getUniversityTeacherWaitlistById);
// 
router.post("/university/teacher/waitlist/accept/:id", authoriseUniversity, controls.acceptTeacherWaitlist);

router.post("/university/teacher/waitlist/reject/:id", authoriseUniversity, controls.rejectTeacherWaitlist);

router.post("/university/student/waitlist", authoriseUniversity, controls.getUniversityStudentWaitlist);

router.post("/university/student/waitlist/:id", authoriseUniversity, controls.getUniversityStudentWaitlistById);

router.post("/university/student/waitlist/accept/byId", authoriseUniversity, controls.acceptStudentWaitlist);

router.post("/university/student/waitlist/reject/:id", authoriseUniversity, controls.rejectStudentWaitlist);

router.post("/university/student/waitlist/accept/all", authoriseUniversity, controls.acceptAllStudentWaitlist);

router.post("/university/student/waitlist/reject/all", authoriseUniversity, controls.rejectAllStudentWaitlist);

router.post("/university/course", authoriseUniversity, controls.getUniversityCourse);

router.post("/university/allUniversities", controls.getAllUniversities);

router.post("/university/course/teacher/:id", authoriseUniversity, controls.getUniversityCourseByTeacherId);

router.post("/university/course/add", authoriseUniversity, controls.addCourse);

router.post("/university/course/add/teacher",  controls.addCourseTeacher);


router.post("/university/course/add/student",  controls.addCourseStudent);
// Student routes
router.post("/student/signup", controls.studentSignUp);

// Teacher routes
router.post('/signup/teacher', controls.signupTeacher);

router.post("/teacher/signin", controls.teacherLogin);

router.post("/teacher/course/getCourses", controls.getCoursesForTeacher);

router.post("/teacher/course/addQuestion", controls.addQuestion);

router.post("/teacher/data",controls.getTeacherData);

router.post("/university/getMultiCourses", controls.getMultiCourses);
// router.post("/teacher/course/details", authorise, controls.getCourseDetailsTeacher);




router.post("/university/course/details", controls.getCourseDetails);

router.post("/teacher/course/questions", controls.getQuestionByCourseId);



router.post("/teacher/course/questionById", controls.getQuestionById);

router.post("/teacher/course/question/analysis", controls.getQuestionAnalysis);


router.post("/university/getStudents", controls.getStudents);

router.post("/university/course/addStudent", controls.addStudentToCourse);
router.post("/student/signin", controls.studentLogin);
router.post("/student/data", controls.getStudentData);
router.post("/student/question", controls.getQuestionForStudent);
// later
// router.post("/teacher/course/question/edit", controls.editQuestion);

module.exports = router; 