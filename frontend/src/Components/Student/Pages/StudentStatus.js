import axios from 'axios';
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { backend_url } from '../../../BackendRoutes';
import LandingHeader from '../../Landing/LandingHeader'

function StudentStatus() {

  const navigate = useNavigate();

  async function checkForStatus(){
    const res = await axios.post(backend_url + '/student/data', {studentId: localStorage.getItem('student__id')});
    console.log(res);
    if(res.data.status == 'active'){
      navigate('/student/dashboard');
    }
  }

  useEffect(() => {
    checkForStatus();
  }, [])

  return (
    <div className='student__status'>
      <LandingHeader />
      <div className='flex flex-col justify-center items-center' style={{minWidth: "100%", minHeight: "106vh"}}>
          <h2 className='text-4xl pb-4' style={{textShadow: "0 2px 5px rgba(0, 0, 0, 0.4)"}}>PENDING</h2>
          <img className='w-1/2 md:w-80' src="/student_status.svg" alt="" />
      </div>
    </div>
  )
}

export default StudentStatus