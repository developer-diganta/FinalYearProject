import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Sidebaruniversity from '../Sidebaruniversity/Sidebaruniversity';
import { CgChevronDoubleRight } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backend_url } from '../../../BackendRoutes';

// const schools = [
//     {
//         name: 'SCHOOL OF BIOLOGICAL SCIENCE & TECHNOLOGY',
//         _id: '60f1b1b0b0b5a0a0a0a0a0a0',
//     },
//     {
//         name: 'SCHOOL OF BUSINESS & MANAGEMENT',
//         _id: '60f1b1b0b0b5a0a0a0a0a0a1',
//     },
// ]



function UniversitySchools() {
    const[schools, setSchools] = useState();
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const navigate = useNavigate();
    const unvToken = localStorage.getItem('signup_token');
    const unvId = localStorage.getItem('university__id');
    
    async function getAllUniversitySchools(){
        const instance = axios.create({
            headers: {
                'x-auth-token': unvToken,
            },
        });
        const schoolResults = await instance.post(backend_url + '/university/details', {universityId: unvId});
        console.log(schoolResults);
        setSchools(schoolResults.data.universityDetails.schools);
    }

    useEffect(() => {
        getAllUniversitySchools();
        console.log(schools);
    }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Home</p>
                <CgChevronDoubleRight />
                <p>Schools</p>
            </div>
            <div>
                <div className='flex justify-between mx-10 items-center'>
                    <h1 className='text-2xl font-semibold my-4'>SCHOOLS</h1>
                        <button className='bg-[#03071e] px-4 rounded-3xl py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#03071e] hover:text-[#03071e] hover:bg-white border-2 border-[#03071e] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => navigate('/university/addschool')}>Add new School <span className='text-lg pl-2'>+</span> </button>
                </div>
                {/* make a divider div */}
                <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
            </div>
            <div className="schools">
                {
                    schools?.map((school, i) => (
                        <div key={i} className='individual__school w-11/12 my-6 mx-auto cursor-pointer flex flex-col gap-2 p-4 shadow-md bg-[#FBFBFB] hover:scale-105 duration-200 hover:bg-[#9667e0] rounded-sm hover:shadow-lg hover:text-white' onClick={() => navigate('/university/school/departments', {state: school})}>
                            <h1 className='text-lg font-semibold'>{school?.name}</h1>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default UniversitySchools