import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { backend_url } from '../../BackendRoutes';
import Sidebaruniversity from './Sidebaruniversity/Sidebaruniversity';

function UniversityTeacher() {
  const[op, setOP] = useState("teacher");
  const[pending, setPending] = useState([]);
  const[teacher, setTeacher] = useState([]);
  const { openClose, unvSign } = useSelector((state) => state.counter);

  // const teacher = [
  //   {
  //     name: "John Doe",
  //     email: "Jhon@gmail.com",
  //     phone: "1234567890",
  //     Stream: "IT"
  //   },
  //   {
  //     name: "John Doe",
  //     email: "Jhon@gmail.com",
  //     phone: "1234567890",
  //     Stream: "IT"
  //   }
  // ]
  const token = localStorage.getItem('signup_token');
  const unv__id = localStorage.getItem('university__id');
  // const pending = [{
  //     name: "John Doe",
  //     email: "Jhon@gmail.com",
  //     phone: "1234567890",
  //     Stream: "IT"
  //   }
  // ]

  async function getPendingTeachers(){
    const instance = axios.create({
      headers: {
        'x-auth-token': token,
      },
    });
    const pending__teachers = await instance.post(backend_url + '/university/teacher/waitlist', {universityId: unv__id});
    console.log("pendingTeachers", pending__teachers);
    setPending(pending__teachers.data);
  }

  async function acceptTeacher(teacher__id){
    const instance = axios.create({
      headers: {
        'x-auth-token': token,
      },
    });
    const unv__id = localStorage.getItem('university__id');
    console.log(teacher__id, unv__id);
    const teacher__acceptance = await instance.post(backend_url + '/university/teacher/waitlist/accept/' + teacher__id, {teacherId: teacher__id, universityId: unv__id});
    console.log("teacher__acceptance", teacher__acceptance);
    getPendingTeachers();
  }

  async function getAllAcceptedTeachers(){
    const instance = axios.create({
      headers: {
        'x-auth-token': token,
      },
    });
    const accepted__teachers = await instance.post(backend_url + '/university/teacher', {universityId: unv__id});
    console.log("acceptedTeachers", accepted__teachers);
    setTeacher(accepted__teachers.data);
  }
  useEffect(() => {
    getAllAcceptedTeachers();
  }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`pt-4 pl-6 bg-[#f8f9fa] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen`} style={{float: "right"}}>
          <div className='flex gap-4'>
            <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8 md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center' onClick={() => {
              setOP('teacher')
              getAllAcceptedTeachers()
              }}>University Teachers</h1>
            <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8 md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center md:px-2' onClick={() => {
              setOP('pending')
              getPendingTeachers()
              }}>Pending Requests</h1>
          </div>
          <div>
            {
              (op === 'teacher' ? teacher : pending).map((item, index) => {
                return (
                  <div className='flex items-center mb-4 justify-center'>
                    <div className="index w-10 h-10 bg-[#8e9aaf] flex justify-center items-center text-lg font-semibold rounded-full mr-2 md:hidden">{index+1}</div>
                    <div className='flex items-center gap-2 bg-[#e9ecef] w-4/5 justify-between pl-2 pr-4 md:flex-col md:pb-2 md:shadow-sm'>
                      <div className='font-semibold'>
                        <h4 className='py-2 px-2 cursor-pointer md:text-sm'>{item.name} <span className='pl-2 text-xs text-[#6c757d] md:text-xxs' style={{letterSpacing: "1px"}}>{'@'+item.username}</span></h4>
                        {/* <h5>{}</h5> */}
                      </div>
                      <p className='md:text-xs'>{item.email}</p>
                      <button className='w-2/12 bg-[#9900ff] h-10 text-white' style={{display: op === 'pending' ? "block" : "none"}}
                        onClick={() => {
                          acceptTeacher(item._id)
                        }}
                      >Accept</button>
                    </div>
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
    </div>
  )
}

export default UniversityTeacher