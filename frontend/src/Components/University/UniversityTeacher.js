import React from 'react'
import { useState } from 'react'

function UniversityTeacher() {
  const[op, setOP] = useState("teacher");
  const teacher = [
    {
      name: "John Doe",
      email: "Jhon@gmail.com",
      phone: "1234567890",
      Stream: "IT"
    },
    {
      name: "John Doe",
      email: "Jhon@gmail.com",
      phone: "1234567890",
      Stream: "IT"
    }
  ]

  const pending = [{
      name: "John Doe",
      email: "Jhon@gmail.com",
      phone: "1234567890",
      Stream: "IT"
    }
  ]
  return (
    <div>
      <div className='flex gap-4 md:flex-col'>
      <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8' onClick={() => setOP('teacher')}>University Teachers</h1>
      <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8' onClick={() => setOP('pending')}>Pending Requests</h1>
      </div>
      <div>
        {
          (op === 'teacher' ? teacher : pending).map((item) => {
            return (
              <div className='flex items-center gap-2'>
                <details className='bg-white transition duration-200 ease-out my-4 w-10/12'>
                  <summary className=' p-2 cursor-pointer'>{item.name} &#40; {item.Stream} 	&#41;</summary>
                  <p className='py-4 px-2 shadow-md'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<span className='text-[#9900ff] underline underline-offset-2 cursor-pointer'>details</span></p>
                </details>
                <button className='w-2/12 bg-[#9900ff] h-10 text-white' style={{display: op === 'pending' ? "block" : "none"}}>Accept</button>
              </div>
            )
          })
        }
        {/* <details className='bg-white transition duration-200 ease-out my-4'>
          <summary className=' p-2 cursor-pointer'>Teacher Name &#40; IT 	&#41;</summary>
          <p className='py-4 px-2 shadow-md'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<span className='text-[#9900ff] underline underline-offset-2 cursor-pointer'>details</span></p>
        </details>
        <details className='bg-white transition duration-200 ease-out my-4'>
          <summary className='p-2 cursor-pointer'>Teacher Name &#40; IT 	&#41;</summary>
          <p className='py-4 px-2 shadow-md'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<span className='text-[#9900ff] underline underline-offset-2 cursor-pointer'>details</span></p>
        </details> */}
      </div>
    </div>
  )
}

export default UniversityTeacher