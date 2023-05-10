import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { universitySignup } from '../../Redux/Counter';
import Header from '../AppHeader/Header';
import LandingHeader from '../Landing/LandingHeader';
import { BiCheck, BiPhone } from 'react-icons/bi';
import axios from 'axios';
import { backend_url } from '../../BackendRoutes';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function UniversitySignup() {
  
  const[name, setName] = useState();
  const[email, setEmail] = useState();
  const[password, setPassword] = useState();
  const[phone, setPhone] = useState();
  const[register, setRegister] = useState(false);
  const[message, setMessage] = useState();
  const[passwordVisibility, setPasswordVisibility] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function getFormValue(event){
    event.preventDefault();
    // check for empty fields
    var check = true;
    if(name === undefined || email === undefined || password === undefined || phone === undefined){
      setMessage("Please fill all the fields");
      check = false;
      return;
    }
    // check for valid email
    if(!email.includes("@")){
      setMessage("Please enter a valid email");
      check = false;
      return;
    }
    // check for valid phone number
    if(phone.length !== 10){
      setMessage("Please enter a valid phone number");
      check = false;
      return;
    }
    // check for valid password
    if (!(password.match(/[a-z]/g) && password.match(/[A-Z]/g) && password.match(/[0-9]/g) && password.match(/[^a-zA-Z\d]/g) && password.length >= 8)){
      setMessage("Please enter a valid password");
      check = false;
      return;
    }
    if(check){
      setMessage();
    }
    try {
      const unv_signup_res = await axios.post(backend_url+'/university/signup', {name, email, password, phone});
      console.log("************************************", unv_signup_res, unv_signup_res.data.token);
      if(unv_signup_res.data.token){
        localStorage.setItem('signup_token', unv_signup_res.data.token);
        localStorage.setItem('university__id', unv_signup_res.data._id);
        localStorage.setItem('university__email', email);
        dispatch(universitySignup(true));
        navigate('/university/dashboard');
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    }
    
    console.log(name, email, password, phone);
  }

  // const signup_token = localStorage.getItem('signup_token');

  // useEffect(() => {
  //   if(register){
  //     navigate('/purchase/university/payment');
  //   }
  //   if(signup_token){
  //     navigate('/university/dashboard');
  //   }
  // }, [])

  return (
    <div className='min-h-[104vh]'>
        <LandingHeader />
        <div className="signup flex justify-center">
        <div className="student_signup_left w-1/2 lg:w-0 flex items-center justify-center">
          <img style={{height: "80vh"}} src="/universitySignup.svg" alt="" />
        </div>

        <div className="signup_right w-1/2 lg:w-full flex flex-col items-center">
          <h1 className='heading text-2xl font-semibold pt-8'>Register your Organization</h1>
          <div className='w-full h-full flex flex-col items-center justify-center'>
          <form className='flex flex-col w-4/5 items-center' onSubmit={(event) => getFormValue(event)}>
            {/* put icon inside inputbox */}
            {/* message for error */}
            <p className={`text-error shake py-2 font-semibold ${message ? 'block' : 'hidden'}`}>!!{message}!!</p>

            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 gap-2' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input required type="text" placeholder="Enter University name" onChange={(ele) => setName(ele.target.value)} />
            </div>
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input required type="email" placeholder="Enter official email" onChange={(ele) => setEmail(ele.target.value)} />
            </div>
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <BiPhone style={{color: "rgba(77, 85, 89, 0.8)"}} />
              <input required type="text" placeholder="Enter phone no" onChange={(ele) => setPhone(ele.target.value)} />
            </div>
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center justify-between border-2 p-2 mx-10 my-2 gap-2' >
              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input required type={`${passwordVisibility ? 'text' : 'password'}`} placeholder="Enter your password" onChange={(ele) => setPassword(ele.target.value)} />
              </div>
              <div className='password_visibility text-2xl' onClick={() => setPasswordVisibility(!passwordVisibility)}>
              {
                passwordVisibility ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
              }
              </div>
            </div>
              <button className='sign_up_btn px-4 py-2 my-4'
              //  onClick={() => {
              //   dispatch(universitySignup(true))
              //   navigate('/university/dashboard')
              //   }}
                >continue</button>
              <div><h1>Already have an account ? <span id="university__login" className='university__login text-base font-semibold cursor-pointer' style={{color: "#6c63ff"}} onClick={() => navigate('/university/login')}>login</span> </h1></div>
          </form>
          <div className='flex justify-center items-center gap-4 pt-6 pb-4'>
            <div className="line md:hidden"></div>
            <p>or</p>
            <div className="line md:hidden"></div>
          </div>
          <div className="google flex items-center rounded-md bg-white" style={{border: "1px solid #0E2A47"}}>
            <div className='bg-primary text-2xl font-bold rounded-md px-3 py-1' style={{color: "#FFF"}}>G</div>
            <p className='pl-2 pr-2'>Continue with Google</p>
          </div>
          </div>
        </div>
    </div>
    </div>
  )
}

export default UniversitySignup