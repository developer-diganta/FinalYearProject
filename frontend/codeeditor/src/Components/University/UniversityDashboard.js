import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sidebaruniversity } from '../Sidebar/Sidebar'
import { MdKeyboardArrowRight } from 'react-icons/md'
import TeacherCard from '../Cards/TeacherCard';
import StudentCard from '../Cards/StudentCard';
import CourseCard from '../Cards/CourseCard';

function UniversityDashboard() {

    const { openClose, unvSign } = useSelector((state) => state.counter);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("abcd");
        if(!unvSign){
            console.log("abcd");
            navigate('/university/signup')
        }
    }, [])

  return (
    <div className='flex'>
        <div className={`${openClose ? 'w-1/5' : 'w-16'}`}>
            <Sidebaruniversity />
        </div>
        <div className={`pt-4 pl-6 bg-[#F4F6F8] ${openClose ? 'w-4/5' : 'w-full'} pr-6`}>
            <h1 className='text-2xl border-b-2 border-b-[#9900ff] w-full'>MAKAUT Dashboard</h1>
            <div className="validity bg-white p-2 my-10 shadow-md text-semibold text-lg flex justify-between items-center rounded-md">
                <p>Expire in 200 days</p>
                <MdKeyboardArrowRight />
            </div>
            <div className='grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-8'>
                <TeacherCard />
                <CourseCard />
                <StudentCard />
            </div>
        </div>
    </div>
  )
}

export default UniversityDashboard