import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sidebaruniversity } from '../Sidebar/Sidebar'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { FcBusinessman, FcConferenceCall, FcFinePrint } from 'react-icons/fc';
import UniversityCard from '../Cards/UniversityCard';
import { universitySignup } from '../../Redux/Counter';

function UniversityDashboard() {

    // const { openClose, unvSign } = useSelector((state) => state.counter);
    const unv__id = localStorage.getItem('university__id');
    const dispatch = useDispatch();
    const navigate = useNavigate();


  return (
    <>
        <div className='text-2xl border-b-2 border-b-[#9900ff] w-full flex justify-between sm:flex-col sm:items-center sm:gap-4'>
            <h1>MAKAUT DASHBOARD</h1>
            <h1 className='text-lg'>🖐 Hello <span className='text-[#9900ff] font-semibold'>@Admin</span></h1>
        </div>
        <div className='flex justify-center text-xl py-4'>
            <p className='bg-[#9900ff] px-20 py-2 text-white font-semibold sm:text-base sm:px-8 sm:w-full text-center' style={{textShadow: "2px 2px 2px rgba(0, 0, 0, 0.4"}}>id: {unv__id}</p>
        </div>
        <div className="validity bg-white p-2 my-2 shadow-md text-semibold text-lg flex justify-between items-center rounded-md">
            <p>Expire in 200 days</p>
            <MdKeyboardArrowRight />
        </div>
        <div className='grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-8 pt-4'>
            <UniversityCard cardName={'Teachers'} total={'200'} icon={<FcBusinessman className='text-4xl' />} />
            <UniversityCard cardName={'Course'} total={'60'} icon={<FcFinePrint className='text-4xl' />} />
            <UniversityCard cardName={'Students'} total={'2000'} icon={<FcConferenceCall className='text-4xl' />} />
        </div>
        <div className='flex my-6 gap-6 md:flex-col'>
            <div className='bg-white rounded-md shadow-md md:mx-auto md:w-10/12 w-7/12 max-h-48 mx-leftmd:w-full'>
                <h2 className='text-center bg-[#9900ff] rounded-t-md py-2 text-white'  style={{textShadow: "2px 2px 2px rgba(0, 0, 0, 0.4"}}>Details</h2>
                <div className='px-4 py-2'>
                    <div className="address flex gap-2 sm:gap-0 xs:text-sm">
                        <p>Street, </p>
                        <p>City, </p>
                        <p>State, </p>
                        <p>Zip, </p>
                        <p>Country</p>
                    </div>
                    <div className="contact">
                        <p>Phone: </p>
                        <p>Email: </p>
                    </div>
                </div>
            </div>
            <div className='bg-white w-5/12 md:mx-auto md:w-10/12 shadow-md' style={{minHeight: "400px"}}></div>
        </div>
    </>
  )
}

export default UniversityDashboard