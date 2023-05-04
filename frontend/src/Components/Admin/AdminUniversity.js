import React, { useState } from 'react'
import AdminHeading from './AdminHeading'
import './Admin.css'
import axios from 'axios';
import { backend_url } from '../../BackendRoutes';
import { useNavigate } from 'react-router-dom';

function AdminUniversity() {
  const[universityId, setUniversityId] = useState();
  const[university, setUniversity] = useState();
  const[show, setShow] = useState(false);

  const token = localStorage.getItem('admin__token');
  const userName = localStorage.getItem('admin__username');
  const navigate = useNavigate();

  async function getUniversityDetail(event){
    event.preventDefault();
    console.log("abcd");
    try {
        const instance = axios.create({
            headers: {
                'x-auth-token': token
            }
        })
        const universityDetails = await instance.post(backend_url + '/admin/university', {universityId: universityId, username: userName});
        console.log(universityDetails);
        setUniversity(universityDetails.data.universityDetails);
        setShow(true);
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
        navigate('/admin/signin');
    }
  }

  async function restoreUniversity(unv__id){
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
          })
          const universityDetails = await instance.post(backend_url + '/admin/restore/university', {universityId: unv__id, username: userName});
          console.log(universityDetails);
          getUniversityDetail();
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            navigate('/admin/signin');
        }
      } else {
        // user clicked the "Cancel" button
        // do something else here
        console.log("Cancel");
      }
  }

  return (
    <div className='admin'>
        <AdminHeading />
        <div className='px-16 mt-8'> 
            <h1 className='uppercase text-3xl text-start pb-6' style={{fontWeight: "bolder"}}>Universities</h1>
            <p className='font-semibold' style={{letterSpacing: "1px"}}>Search university details</p>
            <form className='text-center my-8' action="" onSubmit={getUniversityDetail}>
                <input className='border-[1px] border-[#efefef] px-4 text-sm py-2 min-w-[40vw] rounded-sm' type="text" placeholder='Enter university Id' onChange={(ev) => setUniversityId(ev.target.value)} />
                <button className='bg-[#dcdcdcff] py-2 mx-2 px-2 text-sm roundded-sm' type='submit'>Search</button>
            </form>
        </div>
        <div className={`bg-[#efefefff] w-4/6 mx-auto py-4 px-4 rounded-md border-[1px] border-[#cdcbcdff] ${show ? 'block' : 'hidden'}`}>
            <div className="name flex items-center gap-4 py-2">
                <h1>University Name: </h1>
                <h2>{university ? university.name : ''}</h2>
            </div>
            <div className="email flex items-center gap-4 py-2">
                <h1>University Email: </h1>
                <h2>{university ? university.email : ''}</h2>
            </div>
            <div className="id flex items-center gap-4 py-2">
                <h1>University Id: </h1>
                <h2>{university ? university._id : ''}</h2>
            </div>
            <div className={`id flex items-center gap-4 py-2 ${university ? university.isdeleted ? 'block' : 'hidden' : null}`}>
                <div className='bg-[#9900ffff] text-white font-semibold w-28 py-1 rounded-sm text-center' onClick={() => restoreUniversity(university._id)}>restore</div>
            </div>
        </div>
    </div>
  )
}

export default AdminUniversity