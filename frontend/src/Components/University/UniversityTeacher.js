import React from 'react'

function UniversityTeacher() {
  return (
    <div>
      <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8'>University Teachers</h1>
      <div>
        <details className='bg-white transition duration-200 ease-out my-4'>
          <summary className=' p-2 cursor-pointer'>Teacher Name &#40; IT 	&#41;</summary>
          <p className='py-4 px-2 shadow-md'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<span className='text-[#9900ff] underline underline-offset-2 cursor-pointer'>details</span></p>
        </details>
        <details className='bg-white transition duration-200 ease-out my-4'>
          <summary className='p-2 cursor-pointer'>Teacher Name &#40; IT 	&#41;</summary>
          <p className='py-4 px-2 shadow-md'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<span className='text-[#9900ff] underline underline-offset-2 cursor-pointer'>details</span></p>
        </details>
      </div>
    </div>
  )
}

export default UniversityTeacher