import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebaruniversity } from '../Sidebar/Sidebar'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { FcBusinessman, FcConferenceCall, FcFinePrint } from 'react-icons/fc';
import UniversityCard from '../Cards/UniversityCard';
import { useState } from 'react';
import UniversityDashboard from './UniversityDashboard';
import UniversityTeacher from './UniversityTeacher';
import UniversityStudents from './UniversityStudents';
import UniversityCourses from './UniversityCourses';

function UniversityGeneralPage() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    // const signup_token = localStorage.getItem('signup_token');
    const navigate = useNavigate();

    const{unvpage} = useParams();

    useEffect(() => {
        console.log("abcd");
        const token = localStorage.getItem('signup_token');
        // const{unvSign} = useSelector((state) => state.counter);
        console.log(token);
        if(token){
            console.log("sjdhfsjfgjgfej");
            navigate('/university/dashboard');
        }
        else{
            console.log("sjdhfsjfgjgfej");
            navigate('/university/signup');
        }
    }, [])

  return (
    <div className='flex md:flex-col'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`pt-4 pl-6 bg-[#F4F6F8] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen`}>
            <div style={{display: unvpage === 'dashboard' ? "block" : "none"}}><UniversityDashboard /></div>
            <div style={{display: unvpage === 'teachers' ? "block" : "none"}}><UniversityTeacher /></div>
            <div style={{display: unvpage === 'students' ? "block" : "none"}}><UniversityStudents /></div>
            <div style={{display: unvpage === 'courses' ? "block" : "none"}}><UniversityCourses /></div>
        </div>
    </div>
  )
}

export default UniversityGeneralPage