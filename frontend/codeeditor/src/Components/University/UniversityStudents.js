import React from 'react'

function UniversityStudents() {
  return (
    <div>
        <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8'>University Students</h1>
      <div>
        <div className='flex justify-between bg-[#2e004d] text-white text-lg font-semibold py-2'>
            <div className='w-1/4 text-center'>Name</div>
            <div className='w-1/4 text-center'>Roll No</div>
            <div className='w-1/4 text-center'>Registration No</div>
            <div className='w-1/4 text-center'>Department</div>
        </div>
        <details className='bg-white transition duration-200 ease-out my-4'>
          <summary className=' p-2 cursor-pointer flex justify-between'>
          <div className='w-1/4 text-center'>Anmol Dhar</div>
          <div className='w-1/4 text-center'>103883939</div>
          <div className='w-1/4 text-center'>0484859</div>
          <div className='w-1/4 text-center'>IT</div>
          </summary>
          <p className='py-4 px-2 shadow-md'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<span className='text-[#9900ff] underline underline-offset-2 cursor-pointer'>details</span></p>
        </details>
      </div>
    </div>
  )
}

export default UniversityStudents