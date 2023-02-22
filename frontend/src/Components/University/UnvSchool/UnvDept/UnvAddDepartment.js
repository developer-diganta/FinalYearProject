import axios from 'axios';
import React, { useState } from 'react'
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../../../BackendRoutes';
import Sidebaruniversity from '../../Sidebaruniversity/Sidebaruniversity';

function UnvAddDepartment() {
    const[unvDepartment, setUnvDepartment] = useState()
    const unvId = localStorage.getItem('university__id');
    const unvToken = localStorage.getItem('signup_token');
    const navigate = useNavigate();
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const location = useLocation();
    console.log(location);

    async function addDepartmentToSchool(event){
        event.preventDefault();
        const instance = axios.create({
            headers: {
                'x-auth-token': unvToken,
            },
        });
        const getResponse = await instance.post(backend_url + '/university/addDepartment', {departmentName: unvDepartment, schoolId: location.state.id, universityId: unvId});
        console.log(getResponse);
        alert(getResponse.data.message);
        if(getResponse.data.message === "Department added successfully"){
            navigate('/university/school/departments');
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
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Schools</p>
                <CgChevronDoubleRight />
                <p>Add Department</p>
            </div>
            <div>
                <h1 className='py-2 px-4 font-semibold'>{location.state.name}</h1>
                <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-4'></div>
                <h1 className='text-center text-lg py-6 font-bold uppercase'>Create Department</h1>
                <form className='bg-formBackground w-3/4 mx-auto py-4 px-6 rounded-md shadow-md' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} action="" onSubmit={addDepartmentToSchool}>
                    <div className='flex flex-col gap-2'>
                        <label className='pt-4' htmlFor="schoolName">Department Name</label>
                        <input type="text" className='py-1 px-2 rounded-md' name="schoolName" required id="schoolName" style={{outline: "none", letterSpacing: "2px"}} onClick={(event) => setUnvDepartment(event.target.value)} />
                    </div>
                    <div className='w-full flex justify-center'>
                        <button className='bg-[#BFC9CA] py-1 px-4 rounded-sm my-4' style={{letterSpacing: "2px"}}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default UnvAddDepartment