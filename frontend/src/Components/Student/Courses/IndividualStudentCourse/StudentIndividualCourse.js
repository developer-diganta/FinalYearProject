import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { CgChevronDoubleRight } from 'react-icons/cg';
import { IoIosArrowDown } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { backend_url } from '../../../../BackendRoutes';
import SidebarStudent from '../../Sidebar/SidebarStudent';

function StudentIndividualCourse() {
    const[assignments, setAssignments] = useState([]);
    const[show, setShow] = useState(false);
    const[resources, setResources] = useState();
    const[resourcesToBeAdded, setResourcesToBeAdded] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const { openClose, unvSign } = useSelector((state) => state.counter);

    const studentId = localStorage.getItem('student__id');
    const studentToken = localStorage.getItem('student__token');
    const student__email = localStorage.getItem('student__email');
    const universityDetail = localStorage.getItem('universityDetail');

    console.log(location);

    async function getAssignments(){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': studentToken,
                },
            });
            const all__courses = await instance.post(backend_url + `/student/assignments`, {studentId: studentId, email: student__email});
            console.log(all__courses);
            all__courses.data.assignments.map((assignment) => {
                if(assignment.course === location.state._id){
                    setAssignments(assignment.assignment);
                }
            })
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
            // localStorage.removeItem('student__token');
            navigate('/student/signup');
        }
    }

    async function getLinks(){
      const links = "https://www.example.com,https://www.google.com,https://www.openai.com,https://www.wikipedia.org,https://www.github.com";
      const linkArray = links.split(',');
      console.log(linkArray);
      setResources(linkArray);
    }

    async function getLinks(){
      try {
        const typeValue = location.state.courseType === "public" ? 'moocs' : 'course';
        let links = location.state.material;
        const linkArray = links.split(", ").map(link => link.trim());
        console.log(linkArray);
        setResources(linkArray);
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      }
    }

    useEffect(() => {
        getAssignments();
        getLinks();
    }, [])

  return (
    <div className='individual__course flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarStudent />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Courses</p>
                <CgChevronDoubleRight />
                <p>{location.state.name}</p>
            </div>
            <div className="assignments">
            <div className='flex justify-between w-11/12 mx-auto items-center mt-4 mb-3'>
          <h1 className='text-xl font-bold cursor-pointer' style={{letterSpacing: "1px"}}  onClick={() => setShow(false)}>Assignments</h1>
          <div className="flex items-center gap-4">
              <div className='relative'>
                  <div className='bg-[#6b7780] px-4 rounded-3xl py-2 cursor-pointer text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => setShow(true)}>Resources
                  </div>
              </div>
          </div>
      </div>
      <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
      <div className={`${show === false ? 'block' : 'hidden'}`}>
        {
          assignments.length > 0 ? 
          <table className="courses mx-auto my-8 w-11/12">
              {
                  assignments.map((assignment, index) => (
                    <tr key={index} className="border-[1px] border-[#d3d6d9]">
                      <td className='p-3 cursor-pointer' onClick={() => navigate('/student/course/assignment', {state: {course: location.state, assignment}})}>
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
      <div className={`${show === true ? 'block' : 'hidden'}`}>
          <div className='border-[1px] border-[#cdcbcdff] rounded-lg my-4 py-2 px-4 bg-[#f9fafbff] mx-4'>
            {
              resources?.map((link, index) => (
                <p key={index} className='py-2'>
                  <a className='text-[#2937f0ff]' target='none' href={link}>{link}</a>
                </p>
              ))
            }
          </div>
      </div>
      </div>
        </div>
    </div>
  )
}

export default StudentIndividualCourse