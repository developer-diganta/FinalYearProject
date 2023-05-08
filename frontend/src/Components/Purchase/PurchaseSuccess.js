import React from 'react'
import LandingHeader from '../Landing/LandingHeader'
import { useNavigate } from 'react-router-dom'


function PurchaseSuccess() {
    const navigate = useNavigate();
  return (
    <div className="success min-h-[104vh]">
        <LandingHeader />
        <div className='success__page flex flex-col items-center justify-center'>
            <img className='absolute opacity-90 -z-10 mx-auto flex justify-center' style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} src="/success.svg" alt="" />
            <div className='w-9/12 mt-10 h-[80vh] px-10 flex flex-col items-center justify-start rounded-lg shadow-2xl pt-10' style={{backgroundColor: "rgba(255, 255, 255, 0.6)"}}>
                <h1 className='text-[#9900ffff] font-bold text-3xl'>Plan Purchased Successfully!</h1>
                <p className='my-16 w-10/12 font-semibold'>Congratulations! Your plan has been successfully purchased and activated. We hope you enjoy all the amazing benefits that come with it. Our team is always here to support you, so please don't hesitate to reach out if you have any questions or concerns. Thank you for choosing our service!</p>
                <p className='underline text-[#9900ffff] text-sm font-bold' onClick={() => navigate('/university/dashboard')}>Go to dashboard</p>
            </div>
        </div>
    </div>
  )
}

export default PurchaseSuccess