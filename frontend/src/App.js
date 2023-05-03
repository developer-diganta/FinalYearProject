import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Codeeditor from './Components/Codeeditor/Codeeditor';
// import Path from './Components/Student/Pages/Path/Path';
import TeacherSignup from './Components/Teacher/TeacherSignup/TeacherSignup';
import Verificatin from './Components/Verification/Verificatin';
import LandingPage from './Components/Landing/LandingPage';
import SignupOption from './Components/Landing/SignupOption';
import StudentSignup from './Components/Student/StudentSignup/StudentSignup';
import UniversitySignup from './Components/University/UniversitySignup';
import UniversityLanding from './Components/University/UniversityLanding';
import UniversityTeacher from './Components/University/UniversityTeacher';
import UniversityLogin from './Components/University/UniversityLogin';
import EditPage from './Components/University/EditPage';
import TeacherProf from './Components/Teacher/TeacherProfile.js/TeacherProf';
import Status from './Components/Teacher/Pages/Status';
import Course from './Components/University/Course/Course';
import UniversityDashboard from './Components/University/UniversityDashboard';
import UniversityStudents from './Components/University/UniversityStudents';
// import UniversitySchools from './Components/University/UniversitySchools';
import TeacherLogin from './Components/Teacher/TeacherSignup/TeacherLogin';
import Dashboard from './Components/Teacher/Pages/Dashboard';
import CourseOfTeacher from './Components/Teacher/Courses/CourseOfTeacher';
import StudentDashboard from './Components/Student/StudentProfile/StudentDashboard';
import StudentStatus from './Components/Student/Pages/StudentStatus';
import StudentLogin from './Components/Student/StudentSignup/StudentLogin';
import UniversityPendingStudents from './Components/University/UniversityPendingStudents';
import QuestionDetail from './Components/Teacher/Courses/DifferentOptions/QuestionDetail';
import StudentProfile from './Components/Student/StudentProfile/StudentProfile';
import StudentCourse from './Components/Student/Courses/StudentCourse';
import UniversitySchools from './Components/University/UnvSchool/UniversitySchools';
import UnvAddSchoolForm from './Components/University/UnvSchool/UnvAddSchoolForm';
import UniversityDepartment from './Components/University/UnvSchool/UnvDept/UniversityDepartment';
import UnvAddDepartment from './Components/University/UnvSchool/UnvDept/UnvAddDepartment';
import UniversityProgram from './Components/University/UnvSchool/UnvDept/UnvProg/UniversityProgram';
import AddUnvProgram from './Components/University/UnvSchool/UnvDept/UnvProg/AddUnvProgram';
import Courses from './Components/Teacher/Courses/Courses';
import CourseCreateForm from './Components/Teacher/Courses/CourseCreateForm';
import ErrorPage from './Components/Error/ErrorPage';
import IndividualCourse from './Components/Teacher/Courses/IndividualCourse';
import CreateAssignmentForm from './Components/Teacher/Courses/IndividualCourse/CreateAssignmentForm';
import CreateQuestionForm from './Components/Teacher/Courses/IndividualCourse/CreateQuestionForm';
import Question from './Components/Teacher/Courses/IndividualCourse/Question';
import StudentIndividualCourse from './Components/Student/Courses/IndividualStudentCourse/StudentIndividualCourse';
import StudentAssignment from './Components/Student/Courses/IndividualStudentCourse/StudentAssignment';
import PublicCourses from './Components/PublicCourses/PublicCourses';
import SinglePublicCourse from './Components/PublicCourses/SinglePublicCourse';
import UniversityPublicCourse from './Components/University/PublicCourse/UniversityPublicCourse';
import UniversityAcceptedPublicCourse from './Components/University/PublicCourse/UniversityAcceptedPublicCourse';
import TeacherPublicCourse from './Components/Teacher/Courses/TeacherPublicCourse/TeacherPublicCourse';
import PublicCourseAssignment from './Components/PublicCourses/PublicCourseAssignment';
import PublicCourseQuestions from './Components/PublicCourses/PublicCourseQuestions';
import TotalSubmission from './Components/Teacher/Courses/DifferentOptions/TotalSubmission';
import IndividualStudentAnalysis from './Components/Teacher/Courses/DifferentOptions/IndividualStudentAnalysis';
import IndividualSubmission from './Components/Teacher/Courses/DifferentOptions/IndividualSubmission';
import StudentAnalysis from './Components/Student/Courses/IndividualStudentCourse/StudentAnalysis';
import Admin from './Components/Admin/Admin';
import AdminSignin from './Components/Admin/AdminSignin';
import AdminUniversity from './Components/Admin/AdminUniversity';
import AdminStudent from './Components/Admin/AdminStudent';
import AdminTeacher from './Components/Admin/AdminTeacher';

function App() {
  return (
    <div className="App">
          <Routes>
            {/* ******************** Common routes ***************************************************************/}
            <Route path='/' element={<LandingPage />} />
            <Route path='/signupoptions' element={<SignupOption />} />

            {/* ******************** University routes ***************************************************************/}
            <Route path='/university' element={<UniversityLanding />} />
            <Route path='/university/signup' element={<UniversitySignup />} />
            <Route path='/university/login' element={<UniversityLogin />} />
            <Route path='/university/dashboard' element={<UniversityDashboard />} />
            <Route path='/university/teachers' element={<UniversityTeacher />} />
            <Route path='/university/pendingstudents' element={<UniversityPendingStudents />} />
            <Route path='/university/students' element={<UniversityStudents />} />
            <Route path='/university/schools' element={<UniversitySchools />} />
            <Route path='/university/addschool' element={<UnvAddSchoolForm />} />
            <Route path='/university/school/departments' element={<UniversityDepartment />} />
            <Route path='/university/adddepartment' element={<UnvAddDepartment />} />
            <Route path='/university/school/department/programs' element={<UniversityProgram />} />
            <Route path='/university/addprogram' element={<AddUnvProgram />} />
            <Route path='/university/edit' element={<EditPage />} />
            <Route path='/university/course/:courseId' element={<Course />} />
            <Route path='/university/publiccourse' element={<UniversityAcceptedPublicCourse />} />
            <Route path='/university/pendingpubliccourse' element={<UniversityPublicCourse />} />
            {/* <Route path='/university/addcourse' element={<CourseCreateForm />} /> */}
            
            {/* ******************** Teacher routes ***************************************************************/}
            <Route path='/teacher/signup' element={<TeacherSignup />} />
            <Route path='/teacher/login' element={<TeacherLogin />} />
            <Route path='/teacher/status' element={<Status />} />
            {/* <Route path='/teacher/:id' element={<TeacherProf />} /> */}
            <Route path='/teacher/dashboard' element={<Dashboard />} />
            <Route path='/teacher/courses' element={<Courses />} />
            {/* <Route path='/teacher/currentcourse' element={<CurrentCourse />} /> */}
            {/* <Route path='/teacher/previouscourse/:options' element={<CourseOfTeacher />} /> */}
            <Route path='/teacher/courses/:courseId' element={<IndividualCourse />} />
            <Route path='/teacher/createquestion' element={<CreateQuestionForm />} />
            <Route path='/teacher/cretatecourse' element={<CourseCreateForm />} />
            <Route path='/teacher/courses/createassignment' element={<CreateAssignmentForm />} />
            <Route path='/teacher/courses/assignment/:assignment' element={<Question />} />
            <Route path='/mailverification/:message' element={<Verificatin />} />
            <Route path='/teacher/publiccourse' element={<TeacherPublicCourse />} />
            <Route path='/teacher/question/questiondetail' element={<QuestionDetail />} />
            <Route path='/teacher/question/totalsubmit' element={<TotalSubmission />} />
            <Route path='/teacher/studentanalysis' element={<IndividualStudentAnalysis />} />
            <Route path='/teacher/individualsubmission' element={<IndividualSubmission />} />
            
            {/* ******************** Student routes ***************************************************************/}
            <Route path='/student/signup' element={<StudentSignup />} />
            <Route path='/student/dashboard' element={<StudentDashboard />} />
            <Route path='/student/status' element={<StudentStatus />} />
            <Route path='/student/login' element={<StudentLogin />} />
            <Route path='/student/profile' element={<StudentProfile />} />
            <Route path='/student/courses' element={<StudentCourse />} />
            <Route path='/student/courses/:courseid' element={<StudentIndividualCourse /> } />
            <Route path='/student/course/assignment' element={<StudentAssignment />} />
            <Route path='/student/question/solve' element={<Codeeditor />} />
            <Route path='/student/question/analysis' element={<StudentAnalysis />} />

            {/* ******************** Public courses routes ***************************************************************/}
            <Route path='/publiccourses' element={<PublicCourses />} />
            <Route path='/publiccourses/:courseid' element={<SinglePublicCourse />} />
            <Route path='/publiccourses/assignment' element={<PublicCourseAssignment />} />
            <Route path='/publiccourses/assignment/questions' element={<PublicCourseQuestions />} />

            {/* ******************** Public courses routes ***************************************************************/}
            <Route path='/admin' element={<Admin />} />
            <Route path='/admin/signin' element={<AdminSignin />} />
            <Route path='/admin/university' element={<AdminUniversity />} />
            <Route path='/admin/teacher' element={<AdminTeacher />} />
            <Route path='/admin/student' element={<AdminStudent />} />

            {/* ******************** Error routes ***************************************************************/}
            <Route path='*' element={<ErrorPage />} />
          </Routes>
    </div>
  );
}

export default App;
