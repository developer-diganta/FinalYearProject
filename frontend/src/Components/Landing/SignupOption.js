import React from 'react'
import { useNavigate } from 'react-router-dom'
import LandingHeader from './LandingHeader'
import './LandingPage.css'

function SignupOption() {
    const navigate = useNavigate();
  return (
    <div>
        <LandingHeader />
        <div className="signupOption_body relative md:pb-20" style={{minHeight: "90vh", backgroundColor: "#f7f7f7"}}>
            <img className='absolute bottom-0 z-0 md:hidden' src="wave.svg" alt="" />
            <img className='absolute bottom-0 rotate-360 z-0 opacity-80 md:hidden' src="wave_2.svg" alt="" />
            <h1 className='flex justify-center text-2xl font-semibold py-4'>Sign up as a - </h1>
            <div className="signup_options flex justify-center gap-28 pt-10 z-50 md:flex-col md:items-center ">
                <div className="as_teacher relative shadow-xl rounded-full w-64 h-64 bg-white z-20 hover:shadow-2xl cursor-pointer" onClick={() => navigate('/teacher/signup')}>
                    <img className='w-full h-full' src="teacher.svg" alt="" />
                    <p className='flex justify-center pt-4 text-2xl font-semibold'>Teacher</p>
                </div>
                <div className="as_student relative shadow-xl rounded-full w-64 h-64 bg-white z-20 hover:shadow-2xl cursor-pointer" onClick={() => navigate('/signup/student')}>
                    <img className='w-full h-full' src="student.svg" alt="" />
                    <p className='flex justify-center pt-4 text-2xl font-semibold'>Student</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignupOption