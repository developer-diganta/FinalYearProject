import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../../../BackendRoutes';
import './IndividualCourse.css';

const assignment = [
  {
    id: 1,
    name: 'Assignment 1',
    description: 'This is the description of the assignment 1This is the description of the assignment 1This is the description of the assignment 1This is the description of the assignment 1This is the description of the assignment 1This is the description of the assignment 1This is the description of the assignment 1This is the description of the assignment 1This is the description of the assignment 1',
  },
  {
    id: 2,
    name: 'Assignment 2',
    description: 'This is the description of the assignment 2',
  },
  {
    id: 3,
    name: 'Assignment 3',
    description: 'This is the description of the assignment 3',
  },
  {
    id: 4,
    name: 'Assignment 4',
    description: 'This is the description of the assignment 4',
  }
]

function Assignments() {
  const[dropDown, setDropDown] = useState(false);
  const[assignments, setassignments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const teacherId = localStorage.getItem('teacher__id');
  const teacherToken = localStorage.getItem('teacher__token');
  const teacher__email = localStorage.getItem('teacher__email');
  console.log(location);

  async function getassignments(){
    if(location.state.course.courseType === "public"){
      try {
        const instance = axios.create({
            headers: {
                'x-auth-token': teacherToken,
            },
        });
        const all__courses = await instance.post(backend_url + `/moocs/assignment/get`, {teacherId: teacherId, email: teacher__email, moocId: location.state.course._id});
        console.log(all__courses);
        setassignments([...all__courses.data.assignments]);
      } catch (error) {
          console.log(error);
          alert('Something went wrong');
      }
    }
    else{
      try {
        const instance = axios.create({
            headers: {
                'x-auth-token': teacherToken,
            },
        });
        const all__courses = await instance.post(backend_url + `/teacher/courses/assignment`, {teacherId: teacherId, email: teacher__email, courseId: location.state.course._id});
        console.log(all__courses);
        setassignments([...all__courses.data.assignments]);
      } catch (error) {
          console.log(error);
          alert('Something went wrong');
          navigate('/teacher/signup');
      }
    }

  }
  useState(() => {
      getassignments();
  }, [])
  return (
    <div>
      <div className='flex justify-between w-11/12 mx-auto items-center mt-4 mb-3 sm:flex-col sm:w-full sm:mt-0 sm:mb-0'>
          <h1 className='text-xl font-bold sm:my-2' style={{letterSpacing: "1px"}}>Assignments</h1>
          <div className='divider bg-divider min-h-[1px] min-w-[95%] max-w-[95%] mx-auto hidden sm:block'></div>
          <div className="flex items-center gap-4 sm:py-2">
              <div className='relative'>
              </div>
              <div className='bg-[#6b7780] sm:hidden px-4 rounded-3xl cursor-pointer py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => navigate('/teacher/courses/createassignment', {state: location.state})}>Create New Assignment <span className='text-lg pl-2'>+</span> </div>
              <div className='bg-[#6b7780] hidden sm:flex h-10 w-10 rounded-full text-xl cursor-pointer py-1 text-white items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => navigate('/teacher/courses/createassignment', {state: location.state})}>+</div>
          </div>
      </div>
      <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
      <div>
        {
          assignments.length > 0 ? 
          <table className="courses mx-auto my-8 w-11/12">
              {
                  assignments.map((assignment, index) => (
                    <tr key={index} className="border-[1px] border-[#d3d6d9]">
                      <td className='p-3 cursor-pointer' onClick={() => navigate('/teacher/courses/assignment/' + assignment.name, {state: {course: location.state.course, assignment: assignment}})}>
                        <div className='flex items-center gap-2'>
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#97a0a6" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                            </svg>
                          </div>
                          <div className='px-4'style={{color: "#40474d", letterSpacing: "1px"}}>
                            <h2 className='text-base font-extrabold'>{assignment.name}</h2>
                            <p className='assignment__description text-xs font-semibold pt-2'>{assignment.description}</p>
                          </div>
                        </div>

                      </td>
                    </tr>
                  ))
              }
          </table> :
          <div>
              <div className='flex justify-center items-center w-full flex-col'>
                  <img src="/teacherrC.svg" className='w-48 h-48 mt-20 opacity-50' alt="" />
                  <h2 className='py-4 font-semibold'>No Assignments Found.</h2>
              </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Assignments