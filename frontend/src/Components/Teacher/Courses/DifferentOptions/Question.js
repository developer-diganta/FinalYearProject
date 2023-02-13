import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../Courses.css'

function Question({coursestate, courseDetail}) {
  const navigate = useNavigate();
  const demo__questions = [
  {
    title: "String",
    question: "String",
    question_id : "093473047036",
    course_id : "9043734706",
    difficulty: "Easy",
  },
  {
    title: "String",
    question: "String",
    question_id : "093473047036",
    course_id : "9043734706",
    difficulty: "Medium",
  },
  {
    title: "String",
    question: "String",
    question_id : "093473047036",
    course_id : "9043734706",
    difficulty: "Hard",
  }
]

  return (
    <div className='questions'>
      <div className={`relative w-full h-16 mt-4 ${coursestate === 'current' ? 'block' : 'hidden'}`}>
        <div className='create__course__button' onClick={() => navigate('/teacher/createquestion', {state: courseDetail})}>Create Question +</div>
      </div>
      {
        demo__questions.map((question) => {
          return (
            <div className='question bg-white my-6 py-6 px-4 flex justify-between items-end rounded-sm shadow-lg' onClick={() => navigate('/teacher/question/questiondetail', {state: question})}>
              <div className=''>
                <div className='question__title'>
                  <h3 className='text-xl font-bold'>{question.title}</h3>
                </div>
                <div className='question__difficulty'>
                  <p className={`text-xs ${question.difficulty === 'Easy' ? 'text-[#97D01E]' : question.difficulty === 'Medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{question.difficulty}</p>
                </div>
                <div className='question__question pt-4'>
                  <p className='text-base'>{question.question}</p>
                </div>
              </div>
              {/* <div>
                <div className='solve__question px-4 py-2 rounded-sm hover:scale-105 cursor-pointer hover:shadow-lg'>Solve Question</div>
              </div> */}
            </div>
          )
        })
      }
    </div>
  )
}

export default Question