import React from 'react'
import LandingHeader from '../Landing/LandingHeader'
import { useNavigate } from 'react-router-dom'

function PurchaseFail() {
    const navigate = useNavigate();
  return (
    <div className="success min-h-[104vh]">
        <LandingHeader />
        <div className='success__page flex flex-col items-center justify-center'>
            <img className='absolute opacity-90 -z-10 mx-auto flex justify-center' style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} src="/fail.svg" alt="" />
            <div className='w-9/12 mt-10 h-[80vh] px-10 flex flex-col items-center justify-start rounded-lg shadow-2xl pt-10' style={{backgroundColor: "rgba(255, 255, 255, 0.6)"}}>
                <h1 className='text-[#9900ffff] font-bold text-3xl'>Transaction failed.</h1>
                <p className='my-16 w-10/12 font-semibold text-center'>Transaction failed. Please try again later.</p>
            </div>
        </div>
    </div>
  )
}

export default PurchaseFail