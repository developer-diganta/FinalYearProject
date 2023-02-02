import React, { useEffect } from 'react'
import './Pages.css'
import LandingHeader from '../../Landing/LandingHeader'
import axios from 'axios';
import { backend_url } from '../../../BackendRoutes';
import { useNavigate } from 'react-router-dom';

function Status() {
  const teacher__id = localStorage.getItem('teacher__id');
  const navigate = useNavigate();
  useEffect(() => {
    async function getStatus(){
      const instance = axios.create({
        headers: {
          'x-auth-token': localStorage.getItem('teacher__token'),
        }
      });
      const res = await instance.post(backend_url + '/teacher/' + teacher__id, {teacherId: teacher__id});
      console.log("hjgjgjgjgjg", res);
      if(res.data[0].status === "active"){
        navigate('/teacher/dashboard');
      }
    }
    // getStatus();
  }, [teacher__id, navigate]);

  return (
    <>
      <LandingHeader />
      <div className='flex flex-col justify-center items-center' style={{minWidth: "100%", minHeight: "106vh"}}>
          <h2 className='text-4xl pb-4' style={{textShadow: "0 2px 5px rgba(0, 0, 0, 0.4)"}}>PENDING</h2>
          <img className='w-1/2 md:w-80' src="/pending.svg" alt="" />
      </div>
    </>
  )
}

export default Status