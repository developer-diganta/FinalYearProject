import React from 'react'
import CourseCard from '../Cards/CourseCard'

function UniversityCourses() {
  return (
    <div>
        <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8'>University Courses</h1>
      <div>
        <CourseCard courseName={'BSCS'} />
      </div>
    </div>
  )
}

export default UniversityCourses