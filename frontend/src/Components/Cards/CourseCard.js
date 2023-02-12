import React from 'react'
import { useNavigate } from 'react-router-dom'

function CourseCard({courseName, courseId}) {
  const navigate = useNavigate()
  return (
    <div className='course_card md:mx-auto mx-auto'>
        <h1 className='bg-white border-2 border-[#6b00b3] flex justify-center items-center rounded-sm shadow-sm text-[#6b00b3] text-lg font-semibold transiti duration-150 hover:scale-105 hover:shadow-2xl cursor-pointer w-[10rem] h-[10rem]' 
        // style={{maxWidth: "160px", minHeight: "160px", maxHeight: "160px"}}
          onClick={() => navigate('/university/course/' + courseId, {state: {courseName: courseName}})}
        >{courseName}</h1>
    </div>
  )
}

export default CourseCard