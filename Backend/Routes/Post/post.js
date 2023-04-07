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
router.post("/languages", controls.languages);

// Admin routes
router.post("/admin/signin", controls.adminSignIn);


//---------------------------------------- University Routes ----------------------------------------//
router.post("/university/signup", controls.universitySignUp);

router.post("/university/signin", controls.universityLogin);

router.post("/university/addSchool", controls.universityAddSchool);

router.post("/university/addDepartment", controls.universityAddDepartment);

router.post("/university/addProgram", controls.addUniversityProgram);

router.post("/university/verifyCourse", controls.universityVerifyCourse);

router.post("/university/rejectCourse", controls.universityRejectCourse);

router.post("/university/details", controls.getUniversityDetails);

router.post("/university/teacher", controls.universityTeacherData);

router.post("/university/teacher/count", controls.universityTeacherCount);

router.post("/university/contract", controls.getUniversityContract);

router.post("/university/contract/expiry", controls.contractExpiryDetails);

router.post("/university/student", controls.getUniversityStudentData);

router.post("/university/teacher/waitlist", controls.getUniversityTeacherWaitlist);



// ------------------------------------------- End of University Routes -------------------------------------------//


// -------------------------------------------- Teacher Routes --------------------------------------------//

router.post('/signup/teacher', controls.signupTeacher);

router.post("/teacher/course/add", controls.addCourse);

router.post("/teacher/assignment/add", authorise, controls.addAssignment);

router.post("/teacher/assignment/addQuestion", controls.addQuestion);

router.post("/teacher/course/addStudent", controls.addStudentToCourse);

router.post("/teacher/courses/getAll", controls.getCoursesOfTeacher);

router.post("/teacher/courses/assignment", controls.getAssignmentsFromCourse);

router.post("/teacher/courses/questionById", controls.getQuestionById);

router.post("/teacher/courses/getQuestionsInAssignment", controls.getQuestionsInAssignment);

router.post("/teacher/course/students", controls.getStudentDetails);

router.post("/teacher/university/student", controls.getUniversityStudentData);
// -------------------------------------------- End of Teacher Routes --------------------------------------------//


// -------------------------------------------- Student Routes --------------------------------------------//
router.post("/student/courses", controls.getCoursesOfStudent)
router.post("/student/assignments", controls.getAssignmentsOfStudent)
router.post("/student/questions", controls.getQuestionsFromAssignmentForStudent)

// -------------------------------------------- End of Student Routes --------------------------------------------//


router.post("/university/course/remainingStudents", controls.getRemainingStudents);

router.post("/university/student/count", controls.getUniversityStudentCount);

router.post("/university/teacher/:id", controls.getUniversityTeacherData);


// router.post("/university/teacher/waitlist/:id",    controls.getUniversityTeacherWaitlistById);
// 
router.post("/university/teacher/waitlist/accept/:id", controls.acceptTeacherWaitlist);

router.post("/university/teacher/waitlist/reject/:id", controls.rejectTeacherWaitlist);

router.post("/university/student/waitlist", controls.getUniversityStudentWaitlist);

router.post("/university/student/waitlist/:id", controls.getUniversityStudentWaitlistById);

router.post("/university/student/waitlist/accept/byId", controls.acceptStudentWaitlist);

router.post("/university/student/waitlist/reject/:id", controls.rejectStudentWaitlist);

router.post("/university/student/waitlist/accept/all", controls.acceptAllStudentWaitlist);

router.post("/university/student/waitlist/reject/all", controls.rejectAllStudentWaitlist);

router.post("/university/course", controls.getUniversityCourse);

router.post("/university/allUniversities", controls.getAllUniversities);

router.post("/university/course/teacher/:id", controls.getUniversityCourseByTeacherId);

router.post("/university/course/add", controls.addCourse);

router.post("/university/course/add/teacher", controls.addCourseTeacher);


router.post("/university/course/add/student", controls.addCourseStudent);
// Student routes
router.post("/student/signup", controls.studentSignUp);

// Teacher routes

router.post("/teacher/signin", controls.teacherLogin);

router.post("/teacher/course/getCourses", controls.getCoursesForTeacher);



router.post("/teacher/data", controls.getTeacherData);

router.post("/university/getMultiCourses", controls.getMultiCourses);
// router.post("/teacher/course/details", authorise, controls.getCourseDetailsTeacher);




router.post("/university/course/details", controls.getCourseDetails);

// router.post("/teacher/course/questions", controls.getQuestionByCourseId);



router.post("/teacher/course/questionById", controls.getQuestionById);

router.post("/teacher/course/question/analysis", controls.getQuestionAnalysis);


router.post("/university/getStudents", controls.getStudents);


router.post("/student/signin", controls.studentLogin);
router.post("/student/data", controls.getStudentData);
router.post("/student/question", controls.getQuestionForStudent);

router.post("/student/performance", controls.getStudentPerformance)

// router.post("/teacher/checkSubmission/", controls.checkSubmission);
// later
// router.post("/teacher/course/question/edit", controls.editQuestion);

// MOOCS
router.post("/moocs/add", controls.addMoocs);
router.post("/moocs/approve", controls.approveMoocs);
router.post("/moocs/reject", controls.rejectMoocs);
router.post("/moocs/get", controls.getMoocs);
router.post("/moocs/get/id", controls.getMoocsById);
router.post("/moocs/student/all", controls.getMoocsOfStudent);
router.post("/moocs/student/enroll", controls.enrollStudentToMooc);
router.post("/moocs/teacher/add/assignment", controls.addAssignmentToMooc);
router.post("/moocs/teacher/add/question", controls.addQuestionToMoocs);
router.post("/moocs/assignment/get", controls.getAssignmentsFromMoocs);
router.post("/moocs/question", controls.getQuestionsInMooc);
router.post("/moocs/question/id", controls.getMoocQuestionById);
router.post("/moocs/question/code/submit", controls.submitCodeToMoocs);
module.exports = router; 