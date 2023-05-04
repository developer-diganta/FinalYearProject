import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backend_url } from '../../../../BackendRoutes';
import '../Courses.css'

function Question({coursestate, courseDetail}) {
  const navigate = useNavigate();
  const[allQuestions, setAllQuestions] = useState([]);
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
    const course__id = courseDetail._id;
    console.log("33.", course__id);
    const questions = await axios.post(backend_url + '/teacher/course/questions', {courseId: course__id});
    console.log("questions.", questions);
    setAllQuestions(questions.data);
  }

  useEffect(() => {
    getQuestions();
  }, [])

  return (
    <div className='questions'>
      <div className={`relative w-full h-16 mt-4 ${coursestate === 'current' ? 'block' : 'hidden'}`}>
        <div className='create__course__button' onClick={() => navigate('/teacher/createquestion', {state: courseDetail})}>Create Question +</div>
      </div>
      {
        allQuestions ? allQuestions.map((question, index) => {
          return (
            <div className='question bg-white my-6 py-6 px-4 flex justify-between items-end rounded-sm shadow-lg cursor-pointer hover:text-[#C11FF5]' onClick={() => navigate('/teacher/question/questiondetail', {state: {question, courseDetail: courseDetail, questionNo: index+1}})}>
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
              {/* <div>
                <div className='solve__question px-4 py-2 rounded-sm hover:scale-105 cursor-pointer hover:shadow-lg'>Solve Question</div>
              </div> */}
            </div>
          )
        })
        :
        console.log("")
      }
    </div>
  )
}

export default Question