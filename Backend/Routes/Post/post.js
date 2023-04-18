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

router.post("/university/addSchool", authorise, controls.universityAddSchool);

router.post("/university/addDepartment", authorise, controls.universityAddDepartment);

router.post("/university/addProgram", authorise, controls.addUniversityProgram);

router.post("/university/verifyCourse", authorise, controls.universityVerifyCourse);

router.post("/university/rejectCourse", authorise, controls.universityRejectCourse);

router.post("/university/details", controls.getUniversityDetails);

router.post("/university/teacher", authorise, controls.universityTeacherData);

router.post("/university/teacher/count", authorise, controls.universityTeacherCount);

router.post("/university/contract", controls.getUniversityContract);

router.post("/university/contract/expiry", authorise, controls.contractExpiryDetails);

router.post("/university/student", authorise, controls.getUniversityStudentData);

router.post("/university/teacher/waitlist", authorise, controls.getUniversityTeacherWaitlist);

router.post("/university/delete", authorise, controls.deleteUniversity);



// ------------------------------------------- End of University Routes -------------------------------------------//


// -------------------------------------------- Teacher Routes --------------------------------------------//

router.post('/signup/teacher', controls.signupTeacher);

router.post("/teacher/course/add", authorise, controls.addCourse);

router.post("/teacher/assignment/add", authorise, controls.addAssignment);

router.post("/teacher/assignment/addQuestion", authorise, controls.addQuestion);

router.post("/teacher/course/addStudent", authorise, controls.addStudentToCourse);

router.post("/teacher/courses/getAll", authorise, controls.getCoursesOfTeacher);

router.post("/teacher/courses/assignment", authorise, controls.getAssignmentsFromCourse);

router.post("/teacher/courses/questionById", authorise, controls.getQuestionById);

router.post("/teacher/courses/getQuestionsInAssignment", authorise, controls.getQuestionsInAssignment);

router.post("/teacher/course/students", authorise, controls.getStudentDetails);

router.post("/teacher/university/student", authorise, controls.getUniversityStudentData);


router.post("/teacher/analysis/student/allSubmissions", authorise, controls.analysisStudentAllSubmissions);
router.post("/teacher/analysis/student/individualSubmission", authorise, controls.individualSubmission)

router.post("/teacher/analysis/student/submission/changePlagarism", authorise, controls.changePlagarism);

router.post("/teacher/analysis/student/submission/grade", authorise, controls.analysisTeacherToStudentGrade)
router.post("/teacher/analysis/student/total", authorise, controls.teacherAnalysisGetStudentTotal);
router.post("/teacher/analysis/question", authorise, controls.teacherAnalysisAllSubmissionsForAQuestion);

// -------------------------------------------- End of Teacher Routes --------------------------------------------//


// -------------------------------------------- Student Routes --------------------------------------------//
router.post("/student/courses", authorise, controls.getCoursesOfStudent)
router.post("/student/assignments", authorise, controls.getAssignmentsOfStudent)
router.post("/student/questions", authorise, controls.getQuestionsFromAssignmentForStudent)

// -------------------------------------------- End of Student Routes --------------------------------------------//


router.post("/university/course/remainingStudents", controls.getRemainingStudents);

router.post("/university/student/count", controls.getUniversityStudentCount);

router.post("/university/teacher/:id", controls.getUniversityTeacherData);


// router.post("/university/teacher/waitlist/:id",    controls.getUniversityTeacherWaitlistById);
// 
router.post("/university/teacher/waitlist/accept/:id", authorise, controls.acceptTeacherWaitlist);

router.post("/university/teacher/waitlist/reject/:id", authorise, controls.rejectTeacherWaitlist);

router.post("/university/student/waitlist", authorise, controls.getUniversityStudentWaitlist);

router.post("/university/student/waitlist/:id", authorise, controls.getUniversityStudentWaitlistById);

router.post("/university/student/waitlist/accept/byId", authorise, controls.acceptStudentWaitlist);

router.post("/university/student/waitlist/reject/:id", authorise, controls.rejectStudentWaitlist);

router.post("/university/student/waitlist/accept/all", authorise, controls.acceptAllStudentWaitlist);

router.post("/university/student/waitlist/reject/all", authorise, controls.rejectAllStudentWaitlist);

router.post("/university/course", authorise, controls.getUniversityCourse);

router.post("/university/allUniversities", controls.getAllUniversities);

router.post("/university/course/teacher/:id", authorise, controls.getUniversityCourseByTeacherId);

router.post("/university/course/add", authorise, controls.addCourse);

router.post("/university/course/add/teacher", authorise, controls.addCourseTeacher);


router.post("/university/course/add/student", authorise, controls.addCourseStudent);
// Student routes
router.post("/student/signup", controls.studentSignUp);

// Teacher routes

router.post("/teacher/signin", controls.teacherLogin);

router.post("/teacher/course/getCourses", authorise, controls.getCoursesForTeacher);



router.post("/teacher/data", authorise, controls.getTeacherData);

router.post("/university/getMultiCourses", controls.getMultiCourses);
// router.post("/teacher/course/details", authorise, controls.getCourseDetailsTeacher);




router.post("/university/course/details", controls.getCourseDetails);

// router.post("/teacher/course/questions", controls.getQuestionByCourseId);



router.post("/teacher/course/questionById", authorise, controls.getQuestionById);

router.post("/teacher/course/question/analysis", authorise, controls.getQuestionAnalysis);


router.post("/university/getStudents", controls.getStudents);


router.post("/student/signin", controls.studentLogin);
router.post("/student/data", authorise, controls.getStudentData);
router.post("/student/question", authorise, controls.getQuestionForStudent);

router.post("/student/performance", authorise, controls.getStudentPerformance)

router.post("/student/question/allAnalysis", controls.getStudentAnalysisSingleQuestion)
router.post("/student/course/analysis", controls.getStudentCourseAnalysis)

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

// ADMIN ROUTES
router.post("/admin/signin", controls.adminSignIn);
module.exports = router; 
