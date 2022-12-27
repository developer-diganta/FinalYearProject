import { useSelector } from 'react-redux';
import { SidebarTEacher } from '../../Sidebar/Sidebar'
import Dashboard from '../Pages/Dashboard'
import './TeacherProf.css'

function TeacherProf() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
  return (
    <div className='teacher flex'>
            <SidebarTEacher />
        <div className={`dashboard duration-500 bg-[#f9fafd] w-full`}>
            <Dashboard />
        </div>
    </div>
  )
}

export default TeacherProf