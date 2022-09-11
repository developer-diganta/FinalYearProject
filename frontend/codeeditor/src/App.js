import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Codeeditor from './Components/Codeeditor/Codeeditor';
import Signup from './Components/Student/Signup/Signup';
import Path from './Components/Student/Pages/Path/Path';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Codeeditor />} />
            <Route path='/student/path' element={<Path />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
