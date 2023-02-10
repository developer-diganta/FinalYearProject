import React from 'react'
import { useSelector } from 'react-redux';
import Sidebaruniversity from './Sidebaruniversity/Sidebaruniversity';

function UniversityStudents() {
  const { openClose, unvSign } = useSelector((state) => state.counter);

  return (
    <div className='flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <Sidebaruniversity />
      </div>
      <div className={`pt-4 pl-6 bg-[#f8f9fa] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen md:px-4`} style={{float: "right"}}>
          <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8 md:text-sm sm:text-xs md:w-48 md:mx-auto'>University Students</h1>
        <div>
          <div className='flex justify-between bg-[#2e004d] text-white text-lg font-semibold py-2'>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Name</div>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Roll No</div>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Registration No</div>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Department</div>
          </div>
          <details className='bg-white transition duration-200 ease-out my-4'>
            <summary className=' p-2 cursor-pointer flex justify-between'>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>Anmol Dhar</div>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>103883939</div>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>0484859</div>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>IT</div>
            </summary>
            <p className='py-4 px-2 shadow-md'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<span className='text-[#9900ff] underline underline-offset-2 cursor-pointer'>details</span></p>
          </details>
        </div>
      </div>
    </div>
  )
}

export default UniversityStudents