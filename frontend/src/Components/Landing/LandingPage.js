import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingHeader from './LandingHeader'

import './LandingPage.css'

function LandingPage() {

    const navigate = useNavigate();
    // text typing animation effect

  return (
    <div className='landing_page'>
        
        <LandingHeader />
        <div className="landing_body flex md:flex-col">

        {/* <img className="absolute" style={{width: "70vw", left: "-40vw", opacity: "0.5"}} src="removedcodingback.png" alt="" /> */}
            {/* <img className='absolute bottom-0 rotate-360 md:hidden' src="wave_rotate_1.svg" alt="" />
            <img className='absolute bottom-0 md:hidden' src="wave.svg" alt="" /> */}
            <div className="landing_body_right w-5/12 z-20 relative sm:w-full md:block hidden mx-auto py-4">
                <img className='relative mx-auto z-20' src="vect.png" alt="" />
            </div>
            <div className="landing_body_left w-7/12 relative md:w-full" style={{zIndex: "10"}}>
                <div className="landing_body_left_text px-10 relative h-full md:px-4 pt-20 sm:pt-4 md:pt-4" style={{zIndex: "10"}}>
                    <h1 className='text-4xl font-bold pb-8 md:text-3xl md:text-center relative'>A coding platform to help teachers and students collaborate on coding</h1>
                    <p className='text-base font-semibold w-3/4 tracking-wider leading-8 md:w-full sm:text-center'>A place where you can share your thoughts and ideas with the world. A place where you can share your thoughts and ideas with the world.
                    Using negative values doesn’t make a ton of sense.
                    </p>
                    <div className='landing_login md:mx-auto my-4 md:my-20 flex'>
                        <div className='login text-white font-semibold tracking-widest cursor-pointer py-2 px-8 rounded-md' onClick={() => navigate('/signupoptions')}>Sign Up</div>
                    </div>
                </div>
            </div>
            
            <div className="landing_body_right w-5/12 relative sm:w-full md:hidden lg:overflow-x-hidden" style={{zIndex: "99"}}>
                {/* <img className="absolute" style={{width: "100rem", height: "70vh"}} src="removedcodingback.png" alt="" /> */}
                <div className="blob_1"></div>
                <div className="blob_2"></div>
                <div className="blob_4"></div>
                <div className="blob_5"></div>
                <div className="blob_6"></div>
                <div className="blob_7"></div>
                <img className='relative' style={{backgroundColor: "transparent", width: "30vw"}} src="test_2.gif" alt="" />
            </div>
        </div>
        <div className="features z-0 mt-8" style={{backgroundColor: "#696bf5"}}>
            <img className="" src="ground1.png" alt="" />
            <div>
                <h1 className='text-4xl font-bold pb-8 md:text-3xl md:text-center relative'>Features</h1>
                <div className="features_cards flex flex-wrap justify-center">
                    <div className="feature_card flex flex-col items-center justify-center">
                        <img className='w-20 h-20' src="feature_1.svg" alt="" />
                        <h1 className='text-2xl font-bold pb-8 md:text-3xl md:text-center relative'>Feature 1</h1>
                        <p className='text-base font-semibold w-3/4 tracking-wider leading-8 md:w-full sm:text-center'>A place where you can share your thoughts and ideas with the world. A place where you can share your thoughts and ideas with the world.
                        Using negative values doesn’t make a ton of sense.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LandingPage