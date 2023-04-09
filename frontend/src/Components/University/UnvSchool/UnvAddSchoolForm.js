import axios from 'axios';
import React, { useState } from 'react';
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../../BackendRoutes';
import Sidebaruniversity from '../Sidebaruniversity/Sidebaruniversity';

function UnvAddSchoolForm() {
    const[unvSchools, setUnvSchools] = useState()
    const unvToken = localStorage.getItem('signup_token');
    const unvId = localStorage.getItem('university__id');
    const navigate = useNavigate();
    const { openClose, unvSign } = useSelector((state) => state.counter);

    async function addSchoolToUniversity(event){
        event.preventDefault();
        console.log(unvSchools);
        const instance = axios.create({
            headers: {
              'x-auth-token': unvToken,
            },
        });
        const getResponse = await instance.post(backend_url + '/university/addSchool', {schoolName: unvSchools, universityId: unvId});
        console.log(getResponse);
        alert(getResponse.data.message);
        if(getResponse.data.message === "School added successfully"){
            navigate('/university/schools');
        }
    }

  return (
    <div className='flex md:block add__school__form'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Home</p>
                <CgChevronDoubleRight />
                <p>Add School</p>
            </div>
            <div>
                <h1 className='text-center text-lg py-6 font-bold uppercase'>Create School</h1>
                <form className='bg-formBackground w-3/4 mx-auto py-4 px-6 rounded-md shadow-md' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} action="" onSubmit={addSchoolToUniversity}>
                    <div className='flex flex-col gap-2'>
                        <label className='pt-4' htmlFor="schoolName">School Name</label>
                        <input type="text" className='py-1 px-2 rounded-md' name="schoolName" required id="schoolName" style={{outline: "none", letterSpacing: "2px"}} onChange={(event) => setUnvSchools(event.target.value)} />
                    </div>
                    <div className='w-full flex justify-center'>
                        <button className='bg-[#BFC9CA] py-1 px-4 rounded-sm my-4' style={{letterSpacing: "2px"}}>Add School</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default UnvAddSchoolForm