import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../../../BackendRoutes';
import Sidebaruniversity from '../../Sidebaruniversity/Sidebaruniversity';

// const departments = [
//     {
//         name: 'DEPARTMENT OF AGRICULTURAL ECONOMICS',
//         _id: '60f1b1b0b0b5a0a0a0a0a0a0',
//     },
//     {
//         name: 'DEPARTMENT OF AGRICULTURAL EXTENSION',
//         _id: '60f1b1b0b0b5a0a0a0a0a0a1',
//     },
//     {
//         name: 'DEPARTMENT OF AGRICULTURAL SCIENCE & EDUCATION',
//         _id: '60f1b1b0b0b5a0a0a0a0a0a2',
//     },
//     {
//         name: 'DEPARTMENT OF ANIMAL SCIENCE',
//         _id: '60f1b1b0b0b5a0a0a0a0a0a3',
//     },
// ]

function UniversityDepartment() {
    const[departments, setDepartments] = useState();
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const unvToken = localStorage.getItem('signup_token');
    const unvId = localStorage.getItem('university__id');
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location);

    async function getAllUniversityDepartments(){
        const instance = axios.create({
            headers: {
                'x-auth-token': unvToken,
            },
        });
        const schoolResults = await instance.post(backend_url + '/university/details', {universityId: unvId});
        console.log(location, schoolResults);
        for(let i=0; i<schoolResults.data.universityDetails.schools.length; i++){
            console.log(schoolResults.data.universityDetails.schools[i], location.state.id);
            if(schoolResults.data.universityDetails.schools[i].id === location.state.id){
                setDepartments(schoolResults.data.universityDetails.schools[0].departments);
            }
        }
    }

    useEffect(() => {
        getAllUniversityDepartments();
        // console.log(schools);
    }, [])

    return (
        <div className='flex md:block university__departments'>
            <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
                <Sidebaruniversity />
            </div>
            <div className={`bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
                <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                    <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Home</p>
                    <CgChevronDoubleRight />
                    <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Schools</p>
                    <CgChevronDoubleRight />
                    <p>Departments</p>
                </div>
                <div className="departments">
                    <h1 className='text-center text-2xl font-bold uppercase py-4'>{location.state.name}</h1>
                    <div>
                        <div className='flex justify-between mx-10 items-center'>
                            <h1 className='text-xl font-semibold my-4 uppercase'>departments</h1>
                            <button className='bg-[#03071e] px-4 rounded-3xl py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#03071e] hover:text-[#03071e] hover:bg-white border-2 border-[#03071e] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => navigate('/university/adddepartment', {state: location.state})}>Add Department <span className='text-lg pl-2'>+</span> </button>
                        </div>
                        {/* make a divider div */}
                        <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
                    </div>
                    <div className='grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1  py-6 px-4 gap-4'>
                        {
                            
                            departments?.map((department, i) => (
                                <div key={i} className='individual__department bg-[#F4F6F7] flex items-center text-[#717D7E] px-4 py-2 border-2 border-[#95A5A6] min-h-[48px] cursor-pointer hover:bg-[#D6DBDF] hover:border-[#717D7E] hover:text-[#717D7E] duration-300 hover:scale-[1.04] rounded-md' 
                                onClick={() => navigate('/university/school/department/programs', {state: {school: location.state, department: department}})}
                                >
                                    <h1 className='text-sm font-bold'>{department?.name}</h1>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default UniversityDepartment