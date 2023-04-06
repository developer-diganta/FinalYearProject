import React from 'react';
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SidebarTEacher from '../Sidebar/SidebarTEacher';
import './Courses.css';
import { BiHome } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import CourseDescription from './IndividualCourse/CourseDescription';
import { useState } from 'react';
import Assignments from './IndividualCourse/Assignments';
import StudentsOfCourse from './IndividualCourse/StudentsOfCourse';

function IndividualCourse() {
  const[showOption, setShowOption] = useState('home');
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const location = useLocation();
  console.log('IndividualCourse.', location);
  let componentToRender;
  switch(showOption){
    case 'students':
      componentToRender = <StudentsOfCourse course={location.state.course} />
      break;
    case 'assignments':
      componentToRender = <Assignments course={location.state.course} />
      break;
    default:
      componentToRender = <CourseDescription course={location.state.course} />
  }
  return (
    <div className='individual__course flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
          <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
              <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Courses</p>
              <CgChevronDoubleRight />
              <p>{location.state.course.name}</p>
          </div>
          <div className="individual__course__secondary__navbar bg-[#6b7780] py-2 mx-auto">
            <div className="individual__course__secondary__navbar__item flex gap-2 xs:text-sm xxs:text-xs xxs:gap-1 justify-center items-center">
              <div className='flex items-center gap-2 text-white hover:border-[1px] hover:border-[#FFF] border-[1px] border-[transparent] px-2 py-1 rounded-sm cursor-pointer duration-200'
                onClick={() => setShowOption('home')}
              >
                <BiHome className='xs:hidden' />
                <p>Home</p>
              </div>
              <div className="vertical__divider min-h-[20px] max-h-[20px] min-w-[1px] bg-white"></div>
              <div className='flex items-center gap-2 text-white hover:border-[1px] hover:border-[#FFF] border-[1px] border-[transparent] px-2 py-1 rounded-sm cursor-pointer duration-200'
                onClick={() => setShowOption('assignments')}
              >
                <FiEdit className='xs:hidden' />
                <p>Assignments</p>
              </div>              
              <div className="vertical__divider min-h-[20px] max-h-[20px] min-w-[1px] bg-white"></div>
              <div className='flex items-center gap-2 text-white hover:border-[1px] hover:border-[#FFF] border-[1px] border-[transparent] px-2 py-1 rounded-sm cursor-pointer duration-200'
                onClick={() => setShowOption('students')}
              >
                <HiOutlineUserGroup className='xs:hidden' />
                <p>Students</p>
              </div>
            </div>
          </div>
          {
            componentToRender
          }
        </div>
    </div>
  )
}

export default IndividualCourse