import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../../../BackendRoutes';
import AddStudentToCourse from './AddStudentToCourse';
import CourseStudents from './CourseStudents';
import './IndividualCourse.css';

function StudentsOfCourse() {
    const[studentComponentOp, setStudentComponentOp] = useState();
    const[allStudents, setAllStudents] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    async function getStudents(){
      try {
        // const instance = axios.create({
        //   headers: {
        //     'x-auth-token': university__token
        //   }
        // });
  
        console.log("jgfwjegfkw", location.state.course.university);
        const res = await axios.post(backend_url + '/teacher/university/student', {universityId: location.state.course.university});
        console.log(res);
        setAllStudents(res.data);
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
        if(error.response.status === 401){
          // navigate('/teacher/login');
        }
      }
    }

    useEffect(() => {
        getStudents();
    }, [])

    let StudentComponent;
    switch(studentComponentOp){
      case 'addStudent':
        StudentComponent = <AddStudentToCourse currentCourse={location.state} allStudents={allStudents} />
        break;
      default:
        StudentComponent = <CourseStudents currentCourse={location.state} />
        break;
    }

  return (
    <div className="students__of__course">
      <div className='flex justify-between w-11/12 mx-auto items-center mt-4 mb-3'>
          <h1 className='text-base font-bold cursor-pointer border-[2px] border-[#6b7780] py-1 px-3 rounded-full' style={{letterSpacing: "1px"}} onClick={() => setStudentComponentOp('students')}>Students</h1>
          <div className="flex items-center gap-4">
            <div className='bg-[#6b7780] sm:hidden px-4 rounded-3xl cursor-pointer py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => setStudentComponentOp('addStudent')}>Add Students <span className='text-lg pl-2'>+</span> </div>
            <div className='bg-[#6b7780] hidden sm:flex h-10 w-10 rounded-full text-xl cursor-pointer py-1 text-white items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => setStudentComponentOp('addStudent')}>+</div>
          </div>
      </div>
      <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
      {
        StudentComponent
      }
    </div>
  )
}

export default StudentsOfCourse