import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { backend_url } from '../../BackendRoutes';
import Sidebaruniversity from './Sidebaruniversity/Sidebaruniversity';

function UniversityStudents() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const[students, setStudents] = useState();
    const university__id = localStorage.getItem('university__id');
    const university__token = localStorage.getItem('signup_token');
    const university__email = localStorage.getItem('university__email');
    const navigate = useNavigate();
  
    async function getAllStudents(){
      try {
        const instance = axios.create({
          headers: {
            'x-auth-token': university__token
          }
        });
  
        console.log("jgfwjegfkw", backend_url);
        const res = await instance.post(backend_url + '/university/student', {universityId: university__id, email: university__email});
        console.log(res);
        setStudents(res.data.filter((item,index)=>{
            return item.status === 'active';
        }));
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
        if(error.response.status === 401){
          // navigate('/university/login');
        }
      }
    }

    useEffect(() => {
        getAllStudents();
      }, []);

  return (
    <div className='flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <Sidebaruniversity />
      </div>
      <div className={`pt-4 pl-6 bg-white ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen md:px-4`} style={{float: "right"}}>
          <div className='flex justify-start gap-8 items-center'>
            <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8 md:text-sm sm:text-xs md:w-48 md:mx-auto cursor-pointer' onClick={() => navigate('/university/students')}>Active Students</h1>
            <h1 className='bg-[#9900ff] w-60 py-2 text-center text-white font-semibold uppercase tracking-wider rounded-full shadow-lg mb-8 md:text-sm sm:text-xs md:w-48 md:mx-auto cursor-pointer' onClick={() => navigate('/university/pendingstudents')}>Pending Students</h1>
          </div>
        <div>
          {/* <div className='flex justify-between bg-[#2e004d] text-white text-lg font-semibold py-2'>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Name</div>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Roll No</div>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Registration No</div>
              <div className='w-1/4 text-center md:text-xs sm:text-[10px] md:w-auto md:p-2'>Department</div>
          </div> */}
          {/* <div className='bg-white transition duration-200 ease-out my-4'>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>Anmol Dhar</div>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>103883939</div>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>0484859</div>
            <div className='w-1/4 text-center md:text-xs sm:text-[10px]'>IT</div>          
          </div> */}
          {
            students && students.map((student, index) => {
              return (
                <div className='bg-[#f8f9fa] transition duration-200 ease-out my-4 flex justify-between items-center py-2 pr-4 w-5/6 md:w-full'>
                  {/* <div></div> */}
                  <div className='w-1/4 text-center md:text-xs sm:text-[10px] flex items-center gap-4 pl-4' style={{fontFamily: "sans-serif", letterSpacing: "1px"}}>
                    <span className="number h-6 w-6 flex justify-center items-center rounded-md" style={{border: "1px solid #000000"}}>{index+1}</span>
                    {student.name}
                  </div>
                  <div className='w-1/4 text-center md:text-xs sm:text-[10px] text-sm' style={{fontFamily: "sans-serif", letterSpacing: "1px"}}>{student.email}</div>
                  {/* <div className='flex gap-4'>
                    <button className='bg-[#A3C7D6] px-2 py-1 text-white rounded-sm' onClick={() => acceptStudent(student._id)}>Accept</button>
                    <button className='bg-[#D3756B] px-2 py-1 text-white rounded-sm' onClick={() => rejectStudent(student._id)}>Reject</button>
                  </div> */}
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default UniversityStudents