import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import LandingHeader from '../Landing/LandingHeader';
import { backend_url, sending_mail } from '../../BackendRoutes';

function PasswordReset() {
  const[email, setEmail] = useState();
  const[password, setPassword] = useState();
  const[rePassword, setRepassword] = useState();
  const[message, setMessage] = useState();
  const[passwordVisibility, setPasswordVisibility] = useState(false);
  const[otp, setOtp] = useState();
  const[show, setShow] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();
  console.log(location);

  function CountdownTimer() {
    const [expirationTime, setExpirationTime] = useState(10);
  
    useEffect(() => {
      const countdownInterval = setInterval(() => {
        setExpirationTime(prevExpirationTime => prevExpirationTime - 1);
      }, 60000);
  
      return () => clearInterval(countdownInterval);
    }, []);
  
    return (
      <div>
        <p>Your OTP will expire after {expirationTime} minutes.</p>
      </div>
    );
  }

  async function callForgotPassword(event){
    event.preventDefault();
    const response = await axios.post(backend_url + '/resetRequest', {id: email, to: 'firesprinkler2021@gmail.com', from: sending_mail});
    if(response.data.message === "OTP sent!"){
      setShow(true);
    }
    else{
      alert("Something went wrong. Please try again.");
    }
  }

  async function resetPassword(event){
    event.preventDefault();
    try {
      const response = await axios.post(backend_url + '/resetPassword', {id: email, otp: otp, type: location.state, password: password});
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className='min-h-[104vh]'>
      <LandingHeader />
        <div className="signup flex justify-center">
        <div className="student_signup_left w-1/2 lg:w-0 flex items-center justify-center">
          <img style={{height: "80vh"}} src="/login.svg" alt="" />
        </div>

        <div className="signup_right w-1/2 lg:w-full flex flex-col items-center">
          <h1 className='heading text-2xl font-semibold pt-8 pb-14'>Recover Password</h1>
          <div>
            {
              show ? <CountdownTimer /> : null
            }
          </div>
          <div className='w-full h-full flex flex-col items-center'>

          <form className={`flex flex-col w-11/12 items-center ${show ? 'hidden' : 'block'}`} onSubmit={(event) => callForgotPassword(event)}>
            <p className={`text-error shake py-2 font-semibold ${message ? 'block' : 'hidden'}`}>!!{message}!!</p>
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input required type="email" placeholder="Enter your email" onChange={(ele) => setEmail(ele.target.value)} />
            </div>
            <button type='submit' className='sign_up_btn px-4 py-2 my-4'>Get OTP</button>
          </form>
          

          <form className={`flex flex-col w-11/12 items-center ${show ? 'block' : 'hidden'}`} onSubmit={(event) => {resetPassword(event)}}>
            <p className={`text-error shake py-2 font-semibold ${message ? 'block' : 'hidden'}`}>!!{message}!!</p>
            {/* <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input required type="email" placeholder="Enter your email" onChange={(ele) => setEmail(ele.target.value)} />
            </div> */}
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg> */}
              <input required type="text" placeholder="OTP" onChange={(ele) => setOtp(ele.target.value)} />
            </div>
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center justify-between border-2 p-2 mx-10 my-2 gap-2' >
              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input required type={`${passwordVisibility ? 'text' : 'password'}`} placeholder="Enter new password" onChange={(ele) => setPassword(ele.target.value)} />
              </div>
              <div className='password_visibility text-2xl' onClick={() => setPasswordVisibility(!passwordVisibility)}>
              {
                passwordVisibility ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
              }
              </div>
            </div>
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center justify-between border-2 p-2 mx-10 my-2 gap-2' >
              <div className='flex items-center gap-2 w-11/12'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input className='w-full' required type={`${passwordVisibility ? 'text' : 'password'}`} placeholder="Enter your password again" onChange={(ele) => setRepassword(ele.target.value)} />
              </div>
              <div className='password_visibility text-2xl' onClick={() => setPasswordVisibility(!passwordVisibility)}>
              {
                passwordVisibility ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
              }
              </div>
            </div>
            <button type='submit' className='sign_up_btn px-4 py-2 my-4'>continue</button>
          </form>
          </div>
        </div>
      </div>
    </div>
  )

}

export default PasswordReset