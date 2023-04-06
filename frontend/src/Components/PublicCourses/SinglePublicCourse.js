import React from 'react'
import { useSelector } from 'react-redux';
import SidebarStudent from '../Student/Sidebar/SidebarStudent';
import { useLocation } from 'react-router-dom';
import { RiArrowRightSFill } from 'react-icons/ri';
import './PublicCourses.css';
import { HiStar } from 'react-icons/hi';

function SinglePublicCourse() {
  const { openClose } = useSelector((state) => state.counter);
  const location = useLocation().state;
  console.log(location);

  function changeDate(dateParm) {
    const date = new Date(dateParm);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }

  return (
    <div className='individual__course flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarStudent />
      </div>
      <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
        {/* <div className="nav__bar bg-[#f0f1f2ff] py-2 flex text-xs items-center px-4">
          <div className='public__left__nav'>Public Courses</div>
          <div>
            <RiArrowRightSFill />
          </div>
          <div>{location.course.name}</div>
        </div> */}
        <div className="course__details">
            <div className={`color__card pl-10 pt-10 pb-10 min-h-[40vh]`} >
                <p className='course__title__card text-[5rem] uppercase w-10/12 lg:text-[3rem] lg:w-full md:text-[2rem] md:pr-4' style={{fontFamily: "'Open Sans', sans-serif", color: "rgba(255, 255, 255, 0.6"}}>{location.course.name}</p>
                <div className='flex items-center gap-8'>
                    <div className="enroll__course bg-[#f65b66] w-36 h-16 rounded-sm flex items-center justify-center font-serif text-white shadow-primary shadow-lg cursor-pointer hover:scale-105 duration-150 mt-8" style={{letterSpacing: "2px"}}>
                        Enroll
                    </div>
                </div>
            </div>
            <div className='pl-10 pt-6 w-10/12 mb-8'>
                <h1 className="course__text__title text-2xl font-bold font-sans text-[#5b6064] pb-4" style={{letterSpacing: "2px"}}>{location.course.name}</h1>
                <p className="course__text__description text-sm font-sans text-[#5b6064]" style={{letterSpacing: "1px"}}>{location.course.description}</p>
                <div className='flex items-center gap-1'>
                    <HiStar className='text-[#ffd200] text-xl mt-4' />
                    <HiStar className='text-[#ffd200] text-xl mt-4' />
                    <HiStar className='text-[#ffd200] text-xl mt-4' />
                    <HiStar className='text-[#ffd200] text-xl mt-4' />
                    <HiStar className='text-[#ffd200] text-xl mt-4' />
                    <p className='mt-4 font-sans text-sm font-semibold'>4.5</p>
                </div>
                <div className="course__instructor flex items-center font-sans gap-2 mt-4">
                    <div className='uppercase bg-[#6b7780ff] h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-bold'>p</div>
                    <p className='font-semibold text-[#5b6064]' style={{letterSpacing: "1px"}}>Pragyan Bhattacharya</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePublicCourse