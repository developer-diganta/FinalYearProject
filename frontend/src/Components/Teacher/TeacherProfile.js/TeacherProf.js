import { useState } from 'react';
import { useSelector } from 'react-redux';
import { SidebarTEacher } from '../../Sidebar/Sidebar'
import Dashboard from '../Pages/Dashboard'
import Status from '../Pages/Status';
import './TeacherProf.css'

function TeacherProf() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const[a, setStatus] = useState(true);
    console.log(a);
  return (
    <>
    {
      a === false ?
      <Status />
      :
      <div className='teacher flex'>
        <SidebarTEacher />
        <div className={`dashboard duration-500 bg-[#f9fafd] w-full`}>
            <Dashboard />
        </div>
      </div>
    }
    {
      console.log(a)
    }
    </>
  )
}

export default TeacherProf