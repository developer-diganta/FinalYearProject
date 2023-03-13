import React from 'react'

function CourseDescription({course}) {
  return (
    <div>
        <div className="course__detail">
            <p className='py-4 px-4 text-base font-semibold' style={{letterSpacing: "1px"}}>{course.description}</p>
            <div className='py-4 px-4 text-base flex items-center gap-4'>
              <h4>Course Type: </h4>
              <p className='font-semibold'>{course.courseType}</p>
            </div>
            <div className='py-4 px-4 text-base flex items-center gap-4'>
              <h4>Compilers: </h4>
              <div className='flex items-center gap-2'>
                {
                  course.courseCompilers?.map((compiler, index) => (
                    <p className='uppercase font-semibold' key={index}>{compiler}</p>
                  ))
                }
              </div>
            </div>
        </div>
    </div>
  )
}

export default CourseDescription