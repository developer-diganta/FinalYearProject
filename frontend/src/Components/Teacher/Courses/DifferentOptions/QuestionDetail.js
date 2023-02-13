import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SidebarTEacher from '../../Sidebar/SidebarTEacher';

function QuestionDetail() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const location = useLocation();
    console.log(location);

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white px-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <h1>{location.state.title}</h1>
        </div>
    </div>
  )
}

export default QuestionDetail