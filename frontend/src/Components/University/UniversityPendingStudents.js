import axios from 'axios';
import { async } from 'q';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../BackendRoutes';
import Sidebaruniversity from './Sidebaruniversity/Sidebaruniversity';

function UniversityPendingStudents() {
  const[btnActive, setBtnActive] = useState(2);
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const[students, setStudents] = useState();
  const university__id = localStorage.getItem('university__id');
  const university__token = localStorage.getItem('signup_token');
  const university__email = localStorage.getItem('university__email');
  const navigate = useNavigate();

  async function acceptStudent(studentId){
    try {
      const instance = axios.create({
        headers: {
          'x-auth-token': university__token
        }
      });
      console.log("*******************************.", studentId)
      const res = await instance.post(backend_url + '/university/student/waitlist/accept/byId', {studentId: studentId, universityId: university__id, email: university__email});
      console.log(res);
      alert(res.data.message);
      if(res.status === 200){
        navigate('/university/students')
      } 
    } catch (error) {
      console.log(error);
      alert('something went wrong');
      if(error.response.status === 401){
        // navigate('/university/login');
      }
    }
  }

  async function rejectStudent(studentId){
    const instance = axios.create({
      headers: {
        'x-auth-token': university__token
      }
    });

    const res = await instance.post(backend_url + '/university/student/waitlist/reject/' + studentId, {studentId: studentId, universityId: university__id});
    console.log(res);
    alert(res.data.message);
  }

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
          return item.status === 'waitlist'
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
      <div className={`bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen md:px-4`} style={{float: "right"}}>
          <div className='flex gap-4 bg-[#f7f7f7] items-center justify-center'>
            <h1 className={`${btnActive === 1 ? 'active__btn' : ''} border-[1px] border-[#6b7780ff] bg-[#dcdcdc] px-4 cursor-pointer py-2 my-4 text-sm text-center text-[#6b7780] font-semibold uppercase tracking-wider rounded-full shadow-xl md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center`} onClick={() => navigate('/university/students')}>Active Students</h1>
            <h1 className={`${btnActive === 2 ? 'active__btn' : ''} border-[1px] border-[#6b7780ff] bg-[#dcdcdc] px-4 cursor-pointer py-2 my-4 text-sm text-center text-[#6b7780] font-semibold uppercase tracking-wider rounded-full shadow-xl md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center md:px-2`} onClick={() => navigate('/university/pendingstudents')}>Pending Students</h1>
          </div>      
        <div className='px-4'>
          {
            students && students.map((student, index) => {
              return (
                <div className='bg-[#f8f9fa] text-[#6b7780ff] border-[1px] border-[#6b7780ff] transition duration-200 ease-out my-4 flex justify-between items-center py-2 pr-4'>
                  {/* <div></div> */}
                  <div className='w-1/4 text-center md:text-xs sm:text-[10px] flex items-center gap-4 pl-4' style={{fontFamily: "sans-serif", letterSpacing: "1px"}}>
                    <span className="number h-6 w-6 flex justify-center items-center rounded-sm" style={{border: "1px solid #000000"}}>{index+1}</span>
                    {student.name}
                  </div>
                  <div className='w-1/4 text-center md:text-xs sm:text-[10px] text-sm' style={{fontFamily: "sans-serif", letterSpacing: "1px"}}>{student.email}</div>
                  <div className='flex gap-4'>
                    <button className='bg-[#A3C7D6] px-2 py-1 text-white rounded-sm' onClick={() => acceptStudent(student._id)}>Accept</button>
                    <button className='bg-[#D3756B] px-2 py-1 text-white rounded-sm' onClick={() => rejectStudent(student._id)}>Reject</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default UniversityPendingStudents