import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { CgChevronDoubleRight } from 'react-icons/cg';
import { IoIosArrowDown } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { backend_url } from '../../../../BackendRoutes';
import SidebarStudent from '../../Sidebar/SidebarStudent';
import { BiCheck } from 'react-icons/bi';
import '../StudentCourse.css';

function StudentAssignment() {
    const[questions, setQuestions] = useState([]);
    const[dropDown, setDropDown] = useState(false);
    const student__token = localStorage.getItem('student__token');
    const student__email = localStorage.getItem('student__email');
    const student__id = localStorage.getItem('student__id');
    const universityDetail = localStorage.getItem('universityDetail');
    const { openClose, unvSign } = useSelector((state) => state.counter);

    const location = useLocation();
    console.log(location);
    const navigate = useNavigate();

    async function getQuestions(){
      try {
          const instance = axios.create({
              headers: {
                  'x-auth-token': student__token,
              },
          });
          const all__courses = await instance.post(backend_url + `/student/questions`, {studentId: student__id, assignmentId: location.state.assignment._id, email: student__email});
          console.log(all__courses);
          setQuestions(all__courses.data);
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
            // localStorage.removeItem('student__token');
            navigate('/student/signup');
      }
    }

    function getQuestionStatus(arr){
      let val = '';
      console.log(arr);
      console.log(student__id);
      for(let i=0; i<arr.length; i++){
        console.log(arr[i]);
        if(arr[i] === student__id){
          return <BiCheck style={{color: "#06cf9c", fontWeight: "600", fontSize: "16px"}}/>;
        }
      }
      return val;
    }

      useState(() => {
          getQuestions();
      }, [])
  return (
    <div className='current__courses flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarStudent />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Home</p>
                <CgChevronDoubleRight />
                <p>Courses</p>
            </div>
            <div className="question__secondary__navbar flex items-center max-w-[95%] mx-auto my-4">
              <div className='flex items-center cursor-pointer' style={{color: "#6b7780"}} onClick={() => navigate('/student/courses/' + location.state.course._id, {state: location.state.course})}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <p className='course__name__in__question pl-2' style={{fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif"}}>
                  {location ? location.state.course.name : null}
                </p>
              </div>
              <div className='text-[#6b7780] font-bold uppercase text-lg mx-auto' style={{letterSpacing: "1px"}}>Questions</div>
            </div>
            <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
            {
              questions.length > 0 ?
              <div className='questions w-11/12 mx-auto'>
                {
                  questions ? questions.map((question, index) => {
                    return (
                      <div className='question bg-white my-6 gap-4 pr-4 flex justify-between items-center rounded-sm shadow-md cursor-pointer border-[1px] border-[#97a0a6] hover:bg-[#f0f1f2] duration-150'>
                        <div className='flex items-center gap-4 w-9/12 py-3 px-4 '
                          onClick={() => navigate('/student/question/solve', {state: {question, courseDetail: location.state.course, assignmentDetail: location.state.assignment}})}
                        >
                          <div className='question__title'>
                            <h3 className='question__p text-base text-[#606b73] font-semibold pb-1' style={{fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif"}}>{index+1}. {question.title}</h3>
                          </div>
                          <div className='question__difficulty flex items-center'>
                            <p className='text-sm font-bold' style={{fontSize: "16px", color: "#97a0a6"}}>&#91;</p>
                            <p className={`text-xs ${question.difficulty === 'easy' ? 'text-[#97D01E]' : question.difficulty === 'medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{question.difficulty}</p>
                            <p className='text-sm font-bold' style={{fontSize: "16px", color: "#97a0a6"}}>&#93;</p>
                          </div>
                        </div>
                        <div className='w-1/12 flex justify-end'>{getQuestionStatus(question.studentsAttempted)}</div>
                        <div className='w-2/12 py-1 px-2 flex items-center justify-end text-white rounded-md'
                          onClick={() => navigate('/student/question/analysis', {state: question})}
                        >
                          <div className='max-w-48 subm px-4 py-1 rounded-sm'>
                            detail
                          </div>
                        </div>
                      </div>
                    )
                  })
                  :
                  null
                }
              </div>
              :
              <div>
                  <div className='flex justify-center items-center w-full flex-col'>
                      <img src="/teacherrC.svg" className='w-48 h-48 mt-20 opacity-50' alt="" />
                      <h2 className='py-4 font-semibold'>No Questions Found.</h2>
                  </div>
              </div>
            }
        </div>
    </div>
  )
}

export default StudentAssignment