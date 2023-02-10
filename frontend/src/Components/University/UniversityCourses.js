import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { backend_url } from '../../BackendRoutes';
import CourseCard from '../Cards/CourseCard'
import Sidebaruniversity from './Sidebaruniversity/Sidebaruniversity';

function UniversityCourses() {
  const navigate = useNavigate();
  const token = localStorage.getItem('signup_token');
  const unv__id = localStorage.getItem('university__id');
  const[universityCourse, setUniversityCourse] = useState([]);
  const { openClose, unvSign } = useSelector((state) => state.counter);

  useEffect(() => {
    console.log("djhfgkjsgfwkegfwkuegfkwjbkfwg*******************sdvsdj");
      async function getAllCourses(){
          const instance = axios.create({
              headers: {
                'x-auth-token': token,
              },
          });
          const courses = await instance.post(backend_url + '/university/course', {universityId: unv__id});
          console.log(courses);
          setUniversityCourse(courses.data);
      }
      getAllCourses();
  }, [token, unv__id])


  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`pt-4 pl-6 bg-[#f8f9fa] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen pb-8`} style={{float: "right"}}>
          <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8 md:text-sm sm:text-xs md:w-48 md:mx-auto'>University Courses</h1>
          <div className='grid grid-cols-4 gap-14 md:grid-cols-3 sm:grid-cols-1 text-center'>
            {
              universityCourse.map((course) => (
                <CourseCard courseName={course.name} />
              ))
            }
            <div className="add__course bg-[#dee2e6] border-2 border-[#889696] text-[#889696] border-dashed flex flex-col justify-center items-center rounded-sm text-lg font-semibold transiti duration-150 hover:scale-105 hover:shadow-2xl cursor-pointer mx-auto w-[10rem] h-[10rem]"
              onClick={() => navigate('/university/addcourse')}
            >
              <p className='text-4xl'>+</p>
              <p>Add Course</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UniversityCourses