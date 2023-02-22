import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdDoubleArrow } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { backend_url } from '../../../BackendRoutes';
import SidebarStudent from '../Sidebar/SidebarStudent';
// import { backend_url } from '../../../../BackendRoutes';
// import '../Courses.css'
import './StudentCourse.css';

function StudentCourse() {
  const navigate = useNavigate();
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const[allQuestions, setAllQuestions] = useState([]);
  const location = useLocation();
  console.log(location.state);
//   const demo__questions = [
//   {
//     title: "String",
//     question: "String",
//     question_id : "093473047036",
//     course_id : "9043734706",
//     difficulty: "Easy",
//   },
//   {
//     title: "String",
//     question: "String",
//     question_id : "093473047036",
//     course_id : "9043734706",
//     difficulty: "Medium",
//   },
//   {
//     title: "String",
//     question: "String",
//     question_id : "093473047036",
//     course_id : "9043734706",
//     difficulty: "Hard",
//   }
// ]

  async function getQuestions(){
    const course__id = location.state.course._id;
    const questions = await axios.post(backend_url + '/teacher/course/questions', {courseId: course__id});
    console.log("questions.", questions);
    setAllQuestions(questions.data);
  }

  useEffect(() => {
    getQuestions();
  }, [])

  return (
    <div className='current__courses flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarStudent />
      </div>
      <div className={`dashboard_1 bg-[#fbfbfb] ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
        <div className='bg-[#E2DEED] font-semibold py-1 px-8 flex gap-2 items-center' style={{letterSpacing: "1px"}}>
          <h2>{location.state.coursestate === 'previous' ? 'Previous Course' : 'Current Course'}</h2>
          <MdDoubleArrow className='rounded-full m-1 w-6 h-6 p-1 text-white' style={{backgroundImage: "linear-gradient(to right top, #ef32d9, #ff1987, #ff7332, #fbb800, #a8eb12)"}} />
          <h2>{location.state.course.name}</h2>
        </div>
        <div className='questions px-8'>
          {
            allQuestions ? allQuestions.map((question, index) => {
              return (
                <div className='question bg-white my-6 py-6 px-4 flex justify-between items-end rounded-sm shadow-lg cursor-pointer hover:text-[#C11FF5]' 
                // onClick={() => navigate('/teacher/question/questiondetail', {state: {question, courseDetail: courseDetail, questionNo: index+1}})}
                >
                  <div className=''>
                    <div className='question__title'>
                      <h3 className='text-xl font-semibold pb-1' style={{fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif"}}>{index+1}. {question.title}</h3>
                    </div>
                    <div className='question__difficulty'>
                      <p className={`text-xs ${question.difficulty === 'Easy' ? 'text-[#97D01E]' : question.difficulty === 'Medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{question.difficulty}</p>
                    </div>
                    {/* <div className='question__question pt-4'>
                      <p className='text-base text-[#000000]'>{question.question}</p>
                    </div> */}
                  </div>
                  <div>
                    <div className='solve__question px-4 py-2 rounded-sm hover:scale-105 cursor-pointer hover:shadow-lg' onClick={() => {
                      navigate('/student/question/solve', {state: question})
                      }}>Solve Question</div>
                  </div>
                </div>
              )
            })
            :
            console.log("")
          }
        </div>
      </div>
    </div>

  )
}

export default StudentCourse