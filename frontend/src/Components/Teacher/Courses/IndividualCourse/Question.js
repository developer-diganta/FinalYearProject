import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { backend_url } from '../../../../BackendRoutes';
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
import './IndividualCourse.css';

function Question() {
  const [allQuestions, setAllQuestions] = useState([]);
  const navigate = useNavigate();
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const email = localStorage.getItem('teacher__email');
  // const[allQuestions, setAllQuestions] = useState([]);
  const teacher__token = localStorage.getItem('teacher__token');
  let instance;
  try {
    instance = axios.create({
      headers: {
        'x-auth-token': teacher__token
      }
    });
  } catch (err) {
    console.log("OOPS!")
  }
  const location = useLocation();
  console.log("location.", location);

  const teacher__token = localStorage.getItem('teacher__token');
  const teacher__id = localStorage.getItem('teacher__id');
  const teacher__email = localStorage.getItem('teacher__email');

  // const allQuestions = [
  //   {
  //     title: "String Manipulation",
  //     question: "Write a C program to count the number of vowels in a given string.",
  //     course: "C Programming for Beginners",
  //     difficulty: "Easy",
  //     category: "String Manipulation",
  //     tags: ["strings", "vowels", "counting"],
  //     dateCreated: new Date("2022-02-01"),
  //     dateModified: new Date("2022-02-05"),
  //     date_published: new Date("2022-02-08"),
  //     studentsAttempted: ["John", "Sarah", "Bob"],
  //     studentsCorrect: ["John", "Sarah"],
  //     studentsIncorrect: ["Bob"],
  //     studentsUnattempted: ["Alice", "Tom"],
  //     assignment: "String Manipulation Assignment 1",
  //     score: 2
  //   },
  //   {
  //     title: "String Comparison in O(n)",
  //     question: "Write a C program to compare two strings without using the built-in string comparison function.",
  //     course: "C Programming Intermediate",
  //     difficulty: "Medium",
  //     category: "String Comparison",
  //     tags: ["strings", "comparison"],
  //     dateCreated: new Date("2022-03-10"),
  //     dateModified: new Date("2022-03-15"),
  //     date_published: new Date("2022-03-18"),
  //     studentsAttempted: ["Alice", "Bob", "Tom", "John"],
  //     studentsCorrect: ["Alice", "Bob", "Tom"],
  //     studentsIncorrect: ["John"],
  //     studentsUnattempted: ["Sarah"],
  //     assignment: "String Comparison Assignment 2",
  //     score: 3
  //   }]

  async function getQuestions() {
    if (location.state.course.courseType === "public") {
      try {
        const questions = await instance.post(backend_url + '/moocs/question', { assignmentId: location.state.assignment._id });
        console.log("questions.", questions);
        setAllQuestions(questions.data.questions);
      } catch (error) {
        console.log(error);
        alert("Error in getting questions");
      }
    }
    else {
      try {
        const instance = axios.create({
          headers: {
            'x-auth-token': teacher__token
          }
      })
        const questions = await instance.post(backend_url + '/teacher/courses/getQuestionsInAssignment', {assignmentId: location.state.assignment._id, email: teacher__email});
        console.log("questions.", questions);
        setAllQuestions(questions.data.questions);
      } catch (error) {
        console.log(error);
        alert("Error in getting questions");
      }
    }
  }

  useEffect(() => {
    getQuestions();
  }, [])

  return (
    <div className='current__courses flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
        <SidebarTEacher />
      </div>
      <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{ float: "right" }}>
        <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
          <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Home</p>
          <CgChevronDoubleRight />
          <p>Courses</p>
        </div>
        <div className="question__secondary__navbar flex items-center justify-between max-w-[95%] mx-auto my-4">
          <div className='flex items-center cursor-pointer' style={{ color: "#6b7780" }} onClick={() => navigate('/teacher/courses/' + location.state.course._id, { state: location.state })}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <p className='course__name__in__question pl-2 sm:text-sm xs:text-xs' style={{ fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif" }}>
              {location ? location.state.course.name : null}
            </p>
          </div>
          <div className='bg-[#6b7780] px-4 xs:text-xs xxs:text-center rounded-3xl cursor-pointer py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{ fontFamily: "sans-serif", letterSpacing: "2px" }} onClick={() => navigate('/teacher/createquestion', { state: location.state })}>Add Question <span className='text-lg pl-2 xs:hidden'>+</span> </div>
        </div>
        <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
        {
          allQuestions.length > 0 ?
            <div className='questions w-11/12 mx-auto'>
              {
                allQuestions ? allQuestions.map((question, index) => {
                  return (
                    <div className='question bg-white my-6 py-3 px-4 flex justify-between items-end rounded-sm shadow-md cursor-pointer border-[1px] border-[#97a0a6] hover:bg-[#f0f1f2] duration-150'
                    // onClick={() => navigate('/teacher/question/questiondetail', {state: {question, courseDetail: courseDetail, questionNo: index+1}})}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='question__title'>
                          <h3 className='text-base text-[#606b73] font-semibold pb-1 xxs:text-xs' style={{ fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif" }}>{index + 1}. {question.question}</h3>
                        </div>
                        <div className='question__difficulty flex items-center xxs:text-xs'>
                          <p className='text-sm font-bold xxs:text-xs' style={{ fontSize: "16px", color: "#97a0a6" }}>&#91;</p>
                          <p className={`text-xs xxs:text-2xs ${question.difficulty === 'easy' ? 'text-[#97D01E]' : question.difficulty === 'medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{question.difficulty}</p>
                          <p className='text-sm font-bold xxs:text-xs' style={{ fontSize: "16px", color: "#97a0a6" }}>&#93;</p>
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
            </div>
        }
      </div>
    </div>
  )
}

export default Question