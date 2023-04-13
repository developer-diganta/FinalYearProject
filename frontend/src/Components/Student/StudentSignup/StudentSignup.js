import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../../BackendRoutes';
import Header from '../../AppHeader/Header';
import LandingHeader from '../../Landing/LandingHeader';
import './Signup.css';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { setUniversityDetail } from '../../../Redux/Counter';
import { useDispatch } from 'react-redux';

function StudentSignup() {

  const[name, setName] = useState();
  // const[username, setUsername] = useState();
  const[email, setEmail] = useState();
  const[password, setPassword] = useState();
  const[university, setUniversity] = useState();
  const[department, setDepartment] = useState();
  const[program, setProgram] = useState();
  const[allUniversity, setAllUniversity] = useState([]);
  const[allDepartments, setAllDepartments] = useState([]);
  const[allprograms, setAllPrograms] = useState([]);
  const[passwordVisibility, setPasswordVisibility] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function getFormValue(event){
    event.preventDefault();
    console.log(name, email, password, university);
    const res = await axios.post(backend_url + '/student/signup', {name: name, email: email, password: password, uniId: university, programId: program});
    console.log("hvjvjvjvjvj", res, res.data._id);
    localStorage.setItem('student__token', res.data.token);
    localStorage.setItem('student__id', res.data._id);
    localStorage.setItem('student__email', email);
    localStorage.setItem('university', res.data.university);
    if(res.data.auth == true){
      navigate('/student/status');
    }
  }

  async function getUniversityDepartment(unId){
    console.log("jgfwjegfkw", backend_url);
    const res = await axios.post(backend_url + '/university/details', {universityId: unId});
    console.log(res);
    dispatch(setUniversityDetail(res.data.universityDetails._id));
    let deptArray = [];
    res.data.universityDetails.schools.map((item) => item.departments.map((item) => deptArray.push(item)));
    console.log(deptArray);
    setAllDepartments(deptArray);
  }

  async function getUniversityProgram(programId){
    // console.log("jgfwjegfkw", backend_url);
    // const res = await axios.post(backend_url + '/university/details', {universityId: unId});
    // console.log(res);
    // let deptArray = [];
    // // res.data.universityDetails.schools.map((item) => item.departments.map((item) => item.));
    // console.log(deptArray);
    console.log(allDepartments);
    allDepartments.map((item) => item.id === programId ? setAllPrograms(item.programs) : null);
    // setAllPrograms(program.departments);
  }

  useEffect(() => {
    async function getAllUniversity(){
      console.log("jgfwjegfkw", backend_url);
      const res = await axios.post(backend_url + '/university/allUniversities');
      console.log(res);
      setAllUniversity(res.data);
    }
    getAllUniversity();
  }, []);

  return (
    <div className="signup" style={{minHeight: "110vh"}}>
      <LandingHeader />
        <div className="signup flex justify-center">
        <div className="student_signup_left w-1/2 lg:w-0 flex items-center justify-center">
          <img style={{height: "80vh"}} src="/signup.svg" alt="" />
        </div>

        <div className="signup_right w-1/2 lg:w-full flex flex-col items-center">
          <h1 className='heading text-2xl font-semibold pt-8'>CREATE YOUR ACCOUNT</h1>
          <div className='w-full h-full flex flex-col items-center justify-center'>
          <form className='flex flex-col w-4/5 items-center' onSubmit={getFormValue}>
            {/* put icon inside inputbox */}
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 gap-2' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input required type="text" placeholder="Enter your name" onChange={(ele) => setName(ele.target.value)} />
            </div>
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input required type="email" placeholder="Enter your email" onChange={(ele) => setEmail(ele.target.value)} />
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
            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgba(77, 85, 89, 0.8)" class="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
              <select className='w-full' name="university" id="university" onChange={(ele) => {
                setUniversity(ele.target.value)
                getUniversityDepartment(ele.target.value)
              }}>
                <option className='text-[rgba(77, 85, 89, 0.8)]' value="default">Select your university</option>
                {/* <option value="IIT Bombay">IIT Bombay</option>
                <option value="IIT Delhi">IIT Delhi</option>
                <option value="IIT Kanpur">IIT Kanpur</option>
                <option value="IIT Kharagpur">IIT Kharagpur</option>
                <option value="IIT Madras">IIT Madras</option>
                <option value="IIT Roorkee">IIT Roorkee</option>
                <option value="IIT Guwahati">IIT Guwahati</option>
                <option value="IIT Hyderabad">IIT Hyderabad</option> */}
                {
                    allUniversity ? allUniversity.map((uni, index) => {
                        return <option key={index} value={uni._id}>{uni.name}</option>
                    }) : null
                }
              </select>
            </div>


            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <select className='w-full' name="university" id="department" onChange={(ele) => {
                setDepartment(ele.target.value)
                getUniversityProgram(ele.target.value)
              }}>
                <option className='text-[rgba(77, 85, 89, 0.8)]' value="default">Select your Department</option>
                {
                    allDepartments ? allDepartments.map((uni, index) => {
                        return <option key={index} value={uni.id}>{uni.name}</option>
                    }) : null
                }
              </select>
            </div>

            <div className='input_box w-3/5 sm:w-4/5 xxs:w-11/12 xs:my-4 flex items-center border-2 p-2 mx-10 my-2 gap-2' >
              <select className='w-full' name="university" id="program" onChange={(ele) => setProgram(ele.target.value)}>
                <option className='text-[rgba(77, 85, 89, 0.8)]' value="default">Select your Program</option>
                {
                    allprograms ? allprograms.map((uni, index) => {
                        return <option key={index} value={uni.id}>{uni.name}</option>
                    }) : null
                }
              </select>
            </div>

              <button className='sign_up_btn px-4 py-2 my-4'>continue</button>
              <div><h1>Already have an account ? <span className='text-base font-semibold cursor-pointer' style={{color: "#6c63ff"}} onClick={() => navigate('/student/login')}>login</span> </h1></div>
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

export default StudentSignup;