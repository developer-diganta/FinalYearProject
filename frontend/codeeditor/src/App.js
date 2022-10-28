import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Codeeditor from './Components/Codeeditor/Codeeditor';
import Path from './Components/Student/Pages/Path/Path';
import TeacherSignup from './Components/Teacher/TeacherSignup/TeacherSignup';
import Verificatin from './Components/Verification/Verificatin';
import LandingPage from './Components/Landing/LandingPage';
import SignupOption from './Components/Landing/SignupOption';
import StudentSignup from './Components/Student/StudentSignup/StudentSignup';
import Purchase from './Components/Purchase/Purchase';
import UniversitySignup from './Components/University/UniversitySignup';
import UniversityLanding from './Components/University/UniversityLanding';
import UniversityDashboard from './Components/University/UniversityDashboard';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/signupoptions' element={<SignupOption />} />
            {/* Purchase product university */}
            <Route path='/university' element={<UniversityLanding />} />
            <Route path='/university/signup' element={<UniversitySignup />} />
            <Route path='/university/dashboard' element={<UniversityDashboard />} />
            {/* Signup, signin and mail-verification */}
            <Route path='/signup/student' element={<StudentSignup />} />
            <Route path='/signup/teacher' element={<TeacherSignup />} />
            <Route path='/mailverification/:message' element={<Verificatin />} />

            <Route path='/:id/solve' element={<Codeeditor />} />
            <Route path='/student/path' element={<Path />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
