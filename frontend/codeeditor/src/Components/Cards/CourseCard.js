import React from 'react'
import { FcFinePrint } from 'react-icons/fc'
import { BsArrowRightShort } from 'react-icons/bs'

function CourseCard() {
  return (
    <div>
        <div className='teacher_card bg-white py-4 px-4 shadow-md rounded-md'>
        <h1 className='text-center text-[#7F8C9D] text-2xl font-semibold' style={{borderBottom: "1px solid #D9D9D9"}}>Teachers</h1>
        <div className='flex items-center justify-between py-8'>
            <div>
                total Courses <br />
                <span className='font-bold text-3xl text-[#6D7276]'>60+</span>
            </div>
            <div className='border-2 border-[#9900ff] rounded-full p-2'>
                <FcFinePrint className='text-4xl' />
            </div>
        </div>
        <div className='flex items-center text-success font-bold text-xs cursor-pointer'>
            See details
            <BsArrowRightShort />
        </div>
    </div>
    </div>
  )
}

export default CourseCard