import React from 'react'
import { useSelector } from 'react-redux';
import SidebarTEacher from '../Sidebar/SidebarTEacher';
import { MdDoubleArrow } from 'react-icons/md';
import CourseOptions from './CourseOptions';
import { useParams } from 'react-router-dom';
import Question from './DifferentOptions/Question';
import Student from './DifferentOptions/Student';
import Syllabus from './DifferentOptions/Syllabus';

function Course() {
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const { options } = useParams();
  console.log(options);

  return (
    <div className='flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarTEacher />
      </div>
      <div className={`dashboard_1 bg-[#F6F6F6] px-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
          <div className='pb-1 my-2 mx-2' style={{backgroundImage: "radial-gradient(circle, #c0392b, #c7254c, #c2206e, #af3090, #8e44ad)"}}>
              <div className='bg-[#E2DEED] font-semibold p-1 flex gap-2 items-center' style={{letterSpacing: "1px"}}>
                <h2>Previous course</h2>
                <MdDoubleArrow className='rounded-full m-1 w-6 h-6 p-1 text-white' style={{backgroundImage: "linear-gradient(to right top, #ef32d9, #ff1987, #ff7332, #fbb800, #a8eb12)"}} />
                <h2>Course 1</h2>
              </div>
          </div>
          <div className='flex mx-2 gap-4'>
            <div className='left_dashboard w-5/6'>
              {
                (() => {
                  switch (options) {
                    case 'questions':
                      return <Question />;
                    case 'students':
                      return <Student />;
                    case 'syllabus':
                      return <Syllabus />;
                    default:
                      return <div>Invalid Page</div> ;
                  }
                })()
              }
            </div>
            <div className='right__dashboard w-1/6 pt-16'>
              <CourseOptions />
            </div>
          </div>
      </div>
    </div>
  )
}

export default Course