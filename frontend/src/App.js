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
import UniversityGeneralPage from './Components/University/UniversityGeneralPage';
import UniversityLogin from './Components/University/UniversityLogin';
import EditPage from './Components/University/EditPage';
import TeacherProf from './Components/Teacher/TeacherProfile.js/TeacherProf';
import Status from './Components/Teacher/Pages/Status';
import Course from './Components/University/Course/Course';
import CourseCreateForm from './Components/University/Course/CourseCreateForm';
import UniversityDashboard from './Components/University/UniversityDashboard';
import UniversityStudents from './Components/University/UniversityStudents';
import UniversityCourses from './Components/University/UniversityCourses';
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
            {/* <Route path='/university/:unvpage' element={<UniversityGeneralPage />} /> */}
            
            <Route path='/university/dashboard' element={<UniversityDashboard />} />
            <Route path='/university/teachers' element={<UniversityTeacher />} />
            <Route path='/university/pendingstudents' element={<UniversityPendingStudents />} />
            <Route path='/university/students' element={<UniversityStudents />} />
            <Route path='/university/courses' element={<UniversityCourses />} />

            <Route path='/university/edit' element={<EditPage />} />
            <Route path='/university/course/:courseId' element={<Course />} />
            <Route path='/university/addcourse' element={<CourseCreateForm />} />
            
            {/* Teacher routes */}
            <Route path='/teacher/signup' element={<TeacherSignup />} />
            <Route path='/teacher/login' element={<TeacherLogin />} />
            <Route path='/teacher/status' element={<Status />} />
            {/* <Route path='/teacher/:id' element={<TeacherProf />} /> */}
            <Route path='/teacher/dashboard' element={<Dashboard />} />
            <Route path='/teacher/previouscourse' element={<PreviouCourse />} />
            <Route path='/teacher/currentcourse' element={<CurrentCourse />} />
            <Route path='/teacher/previouscourse/:options' element={<CourseOfTeacher />} />
            <Route path='/teacher/currentcourse/:options' element={<CourseOfTeacher />} />
            <Route path='/teacher/createquestion' element={<CreateQuestionForm />} />

            <Route path='/mailverification/:message' element={<Verificatin />} />

            <Route path='/:id/solve' element={<Codeeditor />} />
            {/* Signup, signin and mail-verification */}
            <Route path='/student/signup' element={<StudentSignup />} />
            {/* <Route path='/student/path' element={<Path />} /> */}
            <Route path='/student/dashboard' element={<StudentDashboard />} />
            <Route path='/student/status' element={<StudentStatus />} />
            <Route path='/student/login' element={<StudentLogin />} />
          </Routes>
    </div>
  );
}

export default App;
