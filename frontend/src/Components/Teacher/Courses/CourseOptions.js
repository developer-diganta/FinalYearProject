import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Courses.css'

function CourseOptions({courseId}) {
  const navigate = useNavigate();
  const url = '/teacher/previouscourse';
  return (
    <div className='course__option flex gap-4 w-full'>
        <div className='bg-[#adb5bd]' style={{minWidth: "1px", maxWidth: "1px", minHeight: "70vh"}}></div>
        <div className='w-full' style={{letterSpacing: "1px"}}>
            <ul>
                <li className='my-6 px-4 py-2 bg-[#e9ecef] cursor-pointer hover:shadow-lg hover:scale-105 rounded-md shadow-md text-sm' style={{letterSpacing: "2px"}} onClick={() => navigate(`${url}/questions`)}>Questions</li>
                <li className='my-6 px-4 py-2 bg-[#e9ecef] cursor-pointer hover:shadow-lg hover:scale-105 rounded-md shadow-md text-sm' style={{letterSpacing: "2px"}} onClick={() => navigate(`${url}/students`)}>Students</li>
                {/* <li className='my-6 px-4 py-2 bg-[#e9ecef] cursor-pointer hover:shadow-lg hover:scale-105 rounded-md shadow-md text-sm' style={{letterSpacing: "2px"}}>Material</li>
                <li className='my-6 px-4 py-2 bg-[#e9ecef] cursor-pointer hover:shadow-lg hover:scale-105 rounded-md shadow-md text-sm' style={{letterSpacing: "2px"}}>Syllabus</li> */}
                {/* <li className='my-6 px-4 py-2 bg-[#e9ecef] cursor-pointer hover:shadow-lg hover:scale-105 rounded-md shadow-md text-sm' style={{letterSpacing: "2px"}}>Comments</li> */}
                {/* <li className='my-6 px-4 py-2 bg-[#e9ecef] cursor-pointer hover:shadow-lg hover:scale-105 rounded-md shadow-md text-sm' style={{letterSpacing: "2px"}}>Performance</li> */}
            </ul>
        </div>
    </div>
  )
}

export default CourseOptions