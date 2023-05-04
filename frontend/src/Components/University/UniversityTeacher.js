import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { backend_url } from '../../BackendRoutes';
import Sidebaruniversity from './Sidebaruniversity/Sidebaruniversity';
import './University.css';
import { MdTry } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function UniversityTeacher() {
  const[btnActive, setBtnActive] = useState(1);
  const[op, setOP] = useState("teacher");
  const[pending, setPending] = useState([]);
  const[teacher, setTeacher] = useState([]);
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const navigate = useNavigate();

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
  const unv__email = localStorage.getItem('university__email');
  // const pending = [{
  //     name: "John Doe",
  //     email: "Jhon@gmail.com",
  //     phone: "1234567890",
  //     Stream: "IT"
  //   }
  // ]

  async function getPendingTeachers(){
    try {
      const instance = axios.create({
        headers: {
          'x-auth-token': token,
        },
      });
      const pending__teachers = await instance.post(backend_url + '/university/teacher/waitlist', {universityId: unv__id, email: unv__email});
      console.log("pendingTeachers", pending__teachers);
      setPending(pending__teachers.data);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      navigate('/university/login');
    }
  }

  async function acceptTeacher(teacher__id){
    try {
      const instance = axios.create({
        headers: {
          'x-auth-token': token,
        },
      });
      const unv__id = localStorage.getItem('university__id');
      console.log(teacher__id, unv__id);
      const teacher__acceptance = await instance.post(backend_url + '/university/teacher/waitlist/accept/' + teacher__id, {teacherId: teacher__id, universityId: unv__id, email: unv__email});
      console.log("teacher__acceptance", teacher__acceptance);
      alert(teacher__acceptance.data.message);
      getPendingTeachers();
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      navigate('/university/login');
    }
  }

  async function getAllAcceptedTeachers(){
    try {
      const instance = axios.create({
        headers: {
          'x-auth-token': token,
        },
      });
      const accepted__teachers = await instance.post(backend_url + '/university/teacher', {universityId: unv__id, email: unv__email});
      console.log("acceptedTeachers", accepted__teachers);
      setTeacher(accepted__teachers.data.filter((item,index)=>{
        return item.status === "active" && item.isdeleted !== true 
      }));
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      navigate('/university/login');
    }
  }

  async function showAlert(teacherId) {
    const result = window.confirm("Do you want to continue?");
    if (result) {
      // user clicked the "Continue" button
      // do something here
      console.log("continue");
      try {
        const instance = axios.create({
          headers: {
            'x-auth-token': token
          }
        });
        const res = await instance.post(backend_url + '/university/delete/teacher', {teacherId: teacherId, email: unv__email});
        console.log(res);
        getAllAcceptedTeachers();
      } catch (error) {
        console.log("Something went wrong.");
        alert("Something went wrong.");
      }
    } else {
      // user clicked the "Cancel" button
      // do something else here
      console.log("Cancel");
    }
  }

  useEffect(() => {
    getAllAcceptedTeachers();
  }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
          <div className='flex gap-4 bg-[#f7f7f7] items-center justify-center'>
            <h1 className={`${btnActive === 1 ? 'active__btn' : ''} border-[1px] border-[#6b7780ff] bg-[#dcdcdc] px-4 cursor-pointer py-2 my-4 text-sm text-center text-[#6b7780] font-semibold uppercase tracking-wider rounded-full shadow-xl md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center`} onClick={() => {
              setOP('teacher')
              getAllAcceptedTeachers()
              setBtnActive(1)
              }}>University Teachers</h1>
            <h1 className={`${btnActive === 2 ? 'active__btn' : ''} border-[1px] border-[#6b7780ff] bg-[#dcdcdc] px-4 cursor-pointer py-2 my-4 text-sm text-center text-[#6b7780] font-semibold uppercase tracking-wider rounded-full shadow-xl md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center md:px-2`} onClick={() => {
              setOP('pending')
              getPendingTeachers()
              setBtnActive(2)
              }}>Pending Requests</h1>
          </div>
          <div className='py-4 px-4'>
            {
              (op === 'teacher' ? teacher : pending).map((item, index) => {
                return (
                  <div className='flex items-center mb-4 pl-1 py-1 border-[1px] border-[#6b7780ff] rounded-full shadow-sm'>
                    <div className="index w-10 h-10 bg-[#8e9aaf] flex justify-center items-center text-lg font-semibold rounded-full md:hidden text-white">{index+1}</div>
                    <div className='flex items-center gap-2 w-full justify-between pl-2 pr-2 md:flex-col md:pb-2 md:shadow-sm'>
                      <div className='font-semibold w-1/4'>
                        <h4 className='py-2 px-2 cursor-pointer md:text-sm'>{item.name}</h4>
                      </div>
                      <div className='pl-4 w-1/4 text-xs text-[#6c757d] md:text-xxs font-semibold' style={{letterSpacing: "1px"}}>{'@'+item.username}</div>
                      <div className='w-1/4'><p className='md:text-xs text-sm font-bold'>{item.email}</p></div>
                      <div className='w-1/4 flex justify-end pr-4'>
                        <button className='bg-[#6b7780] rounded-sm px-2 py-1 text-white' style={{display: op === 'pending' ? "none" : "block"}}
                          onClick={() => showAlert(item._id)}
                        >Delete</button>
                      </div>
                      <button className='w-2/12 bg-[#6b7780] rounded-full h-10 text-white' style={{display: op === 'pending' ? "block" : "none"}}
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