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
import PreviouCourse from './Components/Teacher/Courses/PreviouCourse';
import CurrentCourse from './Components/Teacher/Courses/CurrentCourse';
import CourseOfTeacher from './Components/Teacher/Courses/CourseOfTeacher';
import CreateQuestionForm from './Components/Teacher/Courses/DifferentOptions/CreateQuestionForm';
import StudentDashboard from './Components/Student/StudentProfile/StudentDashboard';
import StudentStatus from './Components/Student/Pages/StudentStatus';
import StudentLogin from './Components/Student/StudentSignup/StudentLogin';
import UniversityPendingStudents from './Components/University/UniversityPendingStudents';
import QuestionDetail from './Components/Teacher/Courses/DifferentOptions/QuestionDetail';
import StudentProfile from './Components/Student/StudentProfile/StudentProfile';
import StudentPreviousCourse from './Components/Student/Courses/StudentPreviousCourse';
import StudentCurrentCourse from './Components/Student/Courses/StudentCurrentCourse';
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

function App() {
  return (
    <div className="App">
          <Routes>
            {/* Landing page */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/signupoptions' element={<SignupOption />} />
            {/* Purchase product university */}
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
            {/* <Route path='/university/addcourse' element={<CourseCreateForm />} /> */}
            
            {/* Teacher routes */}
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
            <Route path='/teacher/question/questiondetail' element={<QuestionDetail />} />
            <Route path='/teacher/cretatecourse' element={<CourseCreateForm />} />

            <Route path='/mailverification/:message' element={<Verificatin />} />

            {/* Signup, signin and mail-verification */}
            <Route path='/student/signup' element={<StudentSignup />} />
            {/* <Route path='/student/path' element={<Path />} /> */}
            <Route path='/student/dashboard' element={<StudentDashboard />} />
            <Route path='/student/status' element={<StudentStatus />} />
            <Route path='/student/login' element={<StudentLogin />} />
            <Route path='/student/profile' element={<StudentProfile />} />
            <Route path='/student/previouscourse' element={<StudentPreviousCourse />} />
            <Route path='/student/currentcourse' element={<StudentCurrentCourse />} />
            <Route path='/student/currentcourse/questions' element={<StudentCourse />} />
            <Route path='/student/question/solve' element={<Codeeditor />} />
            
            {/* for error page */}
            <Route path='*' element={<ErrorPage />} />
          </Routes>
    </div>
  );
}

export default App;
