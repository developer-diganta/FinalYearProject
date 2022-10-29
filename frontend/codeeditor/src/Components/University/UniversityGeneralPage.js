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
    const navigate = useNavigate();

    const{unvpage} = useParams();

    useEffect(() => {
        console.log("abcd");
        if(!unvSign){
            console.log("abcd");
            navigate('/university/signup')
        }
    }, [])

  return (
    <div className='flex'>
        <div className={`${openClose ? 'w-1/5' : 'w-16'}`}>
            <Sidebaruniversity />
        </div>
        <div className={`pt-4 pl-6 bg-[#F4F6F8] ${openClose ? 'w-4/5' : 'w-full'} pr-6`}>
            <div style={{display: unvpage === 'dashboard' ? "block" : "none"}}><UniversityDashboard /></div>
            <div style={{display: unvpage === 'teachers' ? "block" : "none"}}><UniversityTeacher /></div>
            <div style={{display: unvpage === 'students' ? "block" : "none"}}><UniversityStudents /></div>
            <div style={{display: unvpage === 'courses' ? "block" : "none"}}><UniversityCourses /></div>
        </div>
    </div>
  )
}

export default UniversityGeneralPage