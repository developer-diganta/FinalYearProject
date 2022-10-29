import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sidebaruniversity } from '../Sidebar/Sidebar'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { FcBusinessman, FcConferenceCall, FcFinePrint } from 'react-icons/fc';
import UniversityCard from '../Cards/UniversityCard';

function UniversityDashboard() {

    const { openClose, unvSign } = useSelector((state) => state.counter);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("abcd");
        if(!unvSign){
            console.log("abcd");
            navigate('/university/signup')
        }
    }, [])

  return (
    <>
        <h1 className='text-2xl border-b-2 border-b-[#9900ff] w-full'>MAKAUT Dashboard</h1>
        <div className="validity bg-white p-2 my-10 shadow-md text-semibold text-lg flex justify-between items-center rounded-md">
            <p>Expire in 200 days</p>
            <MdKeyboardArrowRight />
        </div>
        <div className='grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-8'>
            <UniversityCard cardName={'Teachers'} total={'200'} icon={<FcBusinessman className='text-4xl' />} />
            <UniversityCard cardName={'Course'} total={'60'} icon={<FcFinePrint className='text-4xl' />} />
            <UniversityCard cardName={'Students'} total={'2000'} icon={<FcConferenceCall className='text-4xl' />} />
        </div>
    </>
  )
}

export default UniversityDashboard