import React from 'react'
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../Landing/LandingHeader'
import './University.css'

function UniversityLanding() {
    const navigate = useNavigate();
  return (
    <div>
        <LandingHeader />
        <h1 className='text-3xl pt-4 pb-2 pl-16' style={{color: "#9900ff"}}><span className='font-bold text-3xl'>Slate</span> for Universities</h1>
        <div className='flex pt-10'>
            <div className='w-8/12 flex flex-col justify-center pl-16' style={{color: "#212529"}}>
                <h1 className='text-4xl font-semibold font-sans w-3/5'>Prepare students with better skills in a convenient way.</h1>
                <p className='text-lg w-4/6  pt-4 tracking-wider leading-8 font-sans'>A place where you can share your thoughts and ideas with the world. A place where you can share your thoughts and ideas with the world.</p>
                <div className="buy w-36 flex justify-center gap-2 items-center py-4 mt-10 rounded-sm text-lg text-white font-bold tracking-widest cursor-pointer" onClick={() => navigate('/purchase/university/signup')}>
                    Buy
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

                </div>
            </div>
            <div className='w-4/12 h-96 relative'>
                <div className='a a1 shadow-2xl'></div>
                <div className='a b shadow-lg'></div>
                <div className='a c shadow-lg'></div>
                {/* <div className='a d shadow-lg'></div> */}
                <img className='unv_img absolute left-10' src="/universityStudent.png" alt="" />
            </div>
        </div>
        <div className="my-4">
        <div className='flex ml-16 mt-4 w-7/12 my-4' style={{minWidth: "200px", maxHeight: "3px", minHeight: "1px", backgroundColor: "#dbd9ff"}}></div>

        </div>
    </div>
  )
}

export default UniversityLanding