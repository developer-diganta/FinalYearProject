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
        <div className="landing_body flex md:flex-col">
            <img className='absolute bottom-0 rotate-360 md:hidden' src="wave_rotate_1.svg" alt="" />
            <img className='absolute bottom-0 md:hidden' src="wave.svg" alt="" />
            <div className="landing_body_right w-5/12 z-20 relative sm:w-full md:block hidden mx-auto py-4">
                <img className='relative mx-auto z-20' src="vect.png" alt="" />
            </div>
            <div className="landing_body_left w-7/12 relative md:w-full">
                <div className="landing_body_left_text px-16 relative h-full md:px-4 pt-20 sm:pt-4 md:pt-4">
                    <h1 className='text-4xl font-bold pb-8 md:text-3xl md:text-center'>Welcome to <span className='text-5xl pl-2' style={{color: "#9900ff"}}> &#123; </span>Slate <span className='text-5xl pr-2' style={{color: "#9900ff"}}>&#125;</span></h1>
                    <p className='text-base w-3/4 tracking-wider leading-8 md:w-full sm:text-center'>A place where you can share your thoughts and ideas with the world. A place where you can share your thoughts and ideas with the world.
                    Using negative values doesn’t make a ton of sense.
                    </p>
                    <div className='landing_login md:mx-auto my-4 w-32 md:my-20 flex justify-center px-2 py-2 rounded-sm' style={{backgroundColor: "#9900ff"}}>
                        <div className='login text-white font-semibold text-lg tracking-widest cursor-pointer' onClick={() => navigate('/signupoptions')}>Sign Up</div>
                    </div>
                </div>
            </div>
            <div className="landing_body_right w-5/12 relative sm:w-full md:hidden">
                <img className='relative ' src="vect.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default LandingPage