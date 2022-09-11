import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Codeeditor from './Components/Codeeditor/Codeeditor';
import Signup from './Learner/Signup/Signup';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Codeeditor />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
