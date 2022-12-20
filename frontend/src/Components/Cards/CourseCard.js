import React from 'react'

function CourseCard({courseName}) {
  return (
    <div className='grid grid-cols-4 gap-14 md:grid-cols-2 sm:grid-cols-2 text-center'>
        <h1 className='bg-white border-2 border-[#6b00b3] flex justify-center items-center rounded-lg shadow-lg text-[#6b00b3] text-lg font-semibold transiti duration-150 hover:scale-105 hover:shadow-2xl' style={{maxWidth: "160px", minHeight: "160px", maxHeight: "160px"}}>{courseName}</h1>
        <h1 className='bg-white border-2 border-[#6b00b3] flex justify-center items-center rounded-lg shadow-lg text-[#6b00b3] text-lg font-semibold transiti duration-150 hover:scale-105 hover:shadow-2xl' style={{maxWidth: "160px", minHeight: "160px", maxHeight: "160px"}}>{courseName}</h1>
        <h1 className='bg-white border-2 border-[#6b00b3] flex justify-center items-center rounded-lg shadow-lg text-[#6b00b3] text-lg font-semibold transiti duration-150 hover:scale-105 hover:shadow-2xl' style={{maxWidth: "160px", minHeight: "160px", maxHeight: "160px"}}>{courseName}</h1>
        <h1 className='bg-white border-2 border-[#6b00b3] flex justify-center items-center rounded-lg shadow-lg text-[#6b00b3] text-lg font-semibold transiti duration-150 hover:scale-105 hover:shadow-2xl' style={{maxWidth: "160px", minHeight: "160px", maxHeight: "160px"}}>{courseName}</h1>
    </div>
  )
}

export default CourseCard