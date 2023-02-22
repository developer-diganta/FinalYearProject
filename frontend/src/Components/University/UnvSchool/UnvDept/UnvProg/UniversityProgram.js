import React from 'react';
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebaruniversity from '../../../Sidebaruniversity/Sidebaruniversity';
import { BiRightArrow } from 'react-icons/bi';

const programs = [
    {
        name: 'Bachelor of Technology',
        _id: '90237402374982369842',
    },
    {
        name: 'Master of Technology',
        _id: '90237203702937092902',
    }
]

function UniversityProgram() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const location = useLocation();
    const navigate = useNavigate();

  return (
    <div className='flex md:block university__program'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Home</p>
                <CgChevronDoubleRight />
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Schools</p>
                <CgChevronDoubleRight />
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Departments</p>
                <CgChevronDoubleRight />
                <p>Programs</p>
            </div>
            <div className='flex items-center text-xs pl-4 py-4 font-semibold' style={{wordSpacing: "1px"}}>
                <h2>{location.state.school.name}</h2>
                <BiRightArrow className='mx-2 text-[#8454F5] text-sm font-bold' />
                <h2>{location.state.department.name}</h2>
            </div>
            <div>
                <div className='flex justify-between mx-10 items-center'>
                    <h1 className='text-xl font-semibold my-4 uppercase'>Programs</h1>
                    <button className='bg-[#03071e] px-4 rounded-3xl py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#03071e] hover:text-[#03071e] hover:bg-white border-2 border-[#03071e] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => navigate('/university/addprogram', {state: location.state.department})}>Add Program <span className='text-lg pl-2'>+</span> </button>
                </div>
                {/* make a divider div */}
                <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1  py-6 px-4 gap-4'>
                {
                    
                    programs?.map((program, i) => (
                        <div className='individual__department bg-[#F4F6F7] flex items-center text-[#717D7E] px-4 py-2 border-2 border-[#95A5A6] min-h-[48px] cursor-pointer hover:bg-[#D6DBDF] hover:border-[#717D7E] hover:text-[#717D7E] duration-300 hover:scale-[1.04] rounded-md' >
                            <h1 className='text-sm font-bold text-center w-full'>{program?.name}</h1>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default UniversityProgram