import React from 'react'
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../Landing/LandingHeader'
import './University.css'

function UniversityLanding() {
    const navigate = useNavigate();
  return (
    <div className="v min-h-screen">
        <LandingHeader />
        <div className='sm:flex sm:flex-col sm:items-center sm:justify-center sm:min-h-screen'>
          <h1 className='text-3xl pt-4 pb-2 pl-16 md:px-6' style={{color: "#9900ff"}}><span className='font-bold text-3xl'>Slate</span> for Universities</h1>
          <div className='flex ml-16 mt-4 w-7/12 my-4 md:mx-auto' style={{minWidth: "200px", maxHeight: "3px", minHeight: "1px", backgroundColor: "#dbd9ff"}}></div>
          <div className='flex relative overflow-hidden md:flex-col'>
            <div className='flex justify-center'>

              <div className='w-4/12 relative -top-8 sm:hidden md:top-0 md:w-3/4 md:overflow-hidden md:mb-8 hidden md:block'>
                  {/* <div className='a a1 shadow-2xl'></div>
                  <div className='a b shadow-lg'></div>
                  <div className='a c shadow-lg'></div> */}
                  {/* <div className='a d shadow-lg'></div> */}
                  <img className='unv_img mx-auto left-10' src="/unv_grp_pic.svg" alt="" />
              </div>
            </div>
              <div className='w-8/12 flex flex-col justify-center pl-16 md:w-full md:px-4' style={{color: "#212529"}}>
                  <h1 className='text-4xl pb-8 font-semibold font-sans w-3/5 md:w-full md:pr-2 md:text-3xl sm:text-center sm:py-4'>Prepare students with better skills in a convenient way.</h1>
                  <p className='text-lg w-4/6 xl:w-5/6 pt-4 tracking-wider leading-8 font-sans sm:text-center md:w-full'>A place where you can share your thoughts and ideas with the world. A place where you can share your thoughts and ideas with the world.</p>
                  <div className='flex gap-10 md:gap-4 md:w-full md:justify-center sm:my-4'>
                    <div className="buy w-36 flex justify-center gap-2 items-center py-4 mt-10 rounded-sm text-lg text-white font-bold tracking-widest cursor-pointer md:w-2/5 md:text-sm" onClick={() => navigate('/university/dashboard')}>
                        Dashboard
                    </div>
                    <div className="buy w-36 flex justify-center gap-2 items-center py-4 mt-10 rounded-sm text-lg text-white font-bold tracking-widest cursor-pointer md:w-2/5 md:text-sm" onClick={() => navigate('/university/signup')}>
                        Buy
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

                    </div>
                  </div>
              </div>
              <div className='w-4/12 relative md:hidden'>
                  {/* <div className='a a1 shadow-2xl'></div>
                  <div className='a b shadow-lg'></div>
                  <div className='a c shadow-lg'></div> */}
                  {/* <div className='a d shadow-lg'></div> */}
                  <img className='unv_img left-10' src="/unv_grp_pic.svg" alt="" />
              </div>
          </div>
          <div className="my-4">

          </div>
        </div>
    </div>
  )
}

export default UniversityLanding