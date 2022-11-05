import React from 'react'
import { FcFinePrint } from 'react-icons/fc'
import { BsArrowRightShort } from 'react-icons/bs'

function UniversityCard({cardName, total, icon}) {
  return (
    <div>
        <div className='teacher_card bg-white py-4 px-4 shadow-md rounded-md hover:scale-105 transition duration-150 ease-in-out cursor-pointer'>
        <h1 className='text-center text-[#7F8C9D] text-2xl font-semibold' style={{borderBottom: "1px solid #D9D9D9"}}>{cardName}</h1>
        <div className='flex items-center justify-between py-8'>
            <div>
                total {cardName} <br />
                <span className='font-bold text-3xl text-[#6D7276]'>{total}+</span>
            </div>
            <div className='border-2 border-[#9900ff] rounded-full p-2'>
                {/* <FcFinePrint /> */}
                {icon}
            </div>
        </div>
        <div className='flex items-center text-success font-bold text-xs cursor-pointer'>
            See details
            <BsArrowRightShort className='text-2xl' />
        </div>
    </div>
    </div>
  )
}

export default UniversityCard