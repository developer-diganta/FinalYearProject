import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Codeeditor from './Components/Codeeditor/Codeeditor';
import Path from './Components/Student/Pages/Path/Path';
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
            <Route path='/university/:unvpage' element={<UniversityGeneralPage />} />
            <Route path='/university/edit' element={<EditPage />} />
            {/* Signup, signin and mail-verification */}
            <Route path='/student/signup' element={<StudentSignup />} />
            {/* Teacher routes */}
            <Route path='/teacher/signup' element={<TeacherSignup />} />
            <Route path='/teacher/status' element={<Status />} />
            <Route path='/teacher/:id' element={<TeacherProf />} />

            <Route path='/mailverification/:message' element={<Verificatin />} />

            <Route path='/:id/solve' element={<Codeeditor />} />
            <Route path='/student/path' element={<Path />} />
          </Routes>
    </div>
  );
}

export default App;
