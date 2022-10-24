import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingHeader from './LandingHeader'

import './LandingPage.css'

function LandingPage() {

    const navigate = useNavigate();

  return (
    <div className='landing_page'>
        
        <LandingHeader />
        <div className="landing_body flex items-center relative" style={{minHeight: "90vh"}}>
            <img className='absolute bottom-0' src="wave.svg" alt="" />
            <img className='absolute bottom-0 rotate-360' src="wave_rotate.svg" alt="" />
            <div className="landing_body_left w-7/12 relative">
                <div className="landing_body_left_text px-16 md:-top-0 relative h-full -top-8">
                    <h1 className='text-4xl font-bold pb-8'>Welcome to Slate</h1>
                    <p className='text-base w-3/4 tracking-wider leading-8'>A place where you can share your thoughts and ideas with the world. A place where you can share your thoughts and ideas with the world.
                    Using negative values doesn’t make a ton of sense.
                    </p>
                    <div className='landing_login my-4 w-32 flex justify-center px-2 py-2 rounded-sm' style={{backgroundColor: "rgba(108, 99, 255, 0.7)"}}>
                        <div className='login text-white font-semibold text-lg tracking-widest cursor-pointer' onClick={() => navigate('/signupoptions')}>Sign Up</div>
                    </div>
                </div>
            </div>
            <div className="landing_body_right w-5/12 relative">
                <img className='' src="vect.png" alt="" />
                {/* <div className="" style={{minWidth: "4rem", minHeight: "20rem", borderRadius: "33% 67% 27% 73% / 75% 58% 42% 25% ", backgroundColor: "rgba(108, 99, 255, 0.6)"}}></div> */}
                {/* <div className="" style={{minWidth: "2rem", minHeight: "4rem", maxHeight: "4rem", maxWidth: "4rem", borderRadius: "33% 30% 27% 73% / 75% 58% 42% 25% ", backgroundColor: "rgba(108, 99, 255, 0.1)"}}></div> */}
            </div>
        </div>
    </div>
  )
}

export default LandingPage