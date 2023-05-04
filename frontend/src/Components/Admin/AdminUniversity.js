import React, { useState } from 'react'
import AdminHeading from './AdminHeading'
import './Admin.css'

function AdminUniversity() {
  const[universityId, setUniversityId] = useState();
  const[university, setUniversity] = useState();

  async function getUniversityDetail(){
    try {
        const instance = axios.create({
            headers: {
                'x-auth-token': token
            }
        })
        const universityDetails = await instance.post(backend_url + '/university/details', {universityId: universityId, email: email});
        console.log(universityDetails);
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
        navigate('/university/signup');
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
                <button className='bg-[#dcdcdcff] py-2 mx-2 px-2 text-sm roundded-sm'>Search</button>
            </form>
        </div>
    </div>
  )
}

export default AdminUniversity