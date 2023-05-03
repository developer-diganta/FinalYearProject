import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import '../Courses.css'

ChartJS.register(ArcElement, Tooltip, Legend);

// const data = {
//   datasets: [{
//     data: [60, 40],
//     backgroundColor: ['#8B5CFB', '#E3E2E3'],
//     borderWidth: 0,

//     // reduce the thikness
//     cutout: 70,
//   }],
//   labels: ['Submitted', 'Not Submitted']
// };

const options = {
  cutoutPercentage: 40
};

function QuestionDetail() {
    const { openClose } = useSelector((state) => state.counter);
    const[data, setData] = useState({
      datasets: [{
        data: [60, 40],
        backgroundColor: ['#8B5CFB', '#E3E2E3'],
        borderWidth: 0,
    
        // reduce the thikness
        cutout: 70,
      }],
      labels: ['Submitted', 'Not Submitted']
    });
    const[data1, setData1] = useState({
      datasets: [{
        data: [60, 40],
        backgroundColor: ['#8B5CFB', '#E3E2E3'],
        borderWidth: 0,
    
        // reduce the thikness
        cutout: 70,
      }],
      labels: ['Submitted', 'Not Submitted']
    });
    const location = useLocation();
    const question__description = location.state.question.question.split("\n");
    const[inputFileData, setinputFileData] = useState("");
    const[outputFileData, setoutputFileData] = useState("");
    const[sampleInputFileData, setsampleInputFileData] = useState("");
    const[sampleOutputFileData, setsampleOutputFileData] = useState("");
    const navigate = useNavigate();
    console.log(location);

    const getInput = (event) => {
      let base64String = location.state.question.input;
      let base64String2 = base64String;
      // console.log(base64String2);
      return decodeURIComponent(
        atob(base64String2)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    };

    const getOutput = (event) => {
      let base64String = location.state.question.output;
      let base64String2 = base64String;
      // console.log(base64String2);
      return decodeURIComponent(
        atob(base64String2)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    };

    const getSampleInput = (event) => {
      let base64String = location.state.question.sampleInput;
      let base64String2 = base64String;
      // console.log(base64String2);
      return decodeURIComponent(
        atob(base64String2)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    };

    const getSampleOutput = (event) => {
      let base64String = location.state.question.sampleOutput;
      let base64String2 = base64String;
      // console.log(base64String2);
      return decodeURIComponent(
        atob(base64String2)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    };
    
    function calculateAttempted(){
      const attemptedArray = new Set();
      for(let i=0; i<location.state.question.studentsAttempted.length; i++){
        attemptedArray.add(location.state.question.studentsAttempted[i]);
      }
      console.log(attemptedArray.size);
      const attemptedLength = attemptedArray.size;
      const unAttemptedArray = location.state.totalStudents ? (location.state.totalStudents.length - attemptedLength) : 0;
      const temp = {
        datasets: [{
          data: [attemptedLength, unAttemptedArray],
          backgroundColor: ['#8B5CFB', '#E3E2E3'],
          borderWidth: 0,
      
          // reduce the thikness
          cutout: 70,
        }],
        labels: ['attempted', 'unattempted']
      }
      setData(temp);
      console.log(temp);
    }

    function calculateCorrectness(){
      const studentCorrectLength = location.state.question.studentsCorrect.length;
      const studentIncorrectLength = location.state.question.studentsIncorrect.length;
      console.log(studentCorrectLength, studentIncorrectLength);
      const temp1 = {
        datasets: [{
          data: [studentCorrectLength, studentIncorrectLength],
          backgroundColor: ['#90BCFF', '#E0E0E1'],
          borderWidth: 0,
      
          // reduce the thikness
          cutout: 70,
        }],
        labels: ['correct', 'incorrect']
      }
      setData1(temp1);
    }

    useEffect(() => {
        const a = getSampleInput();
        const b = a.split("\r\n");
        setsampleInputFileData(b);
        const c = getSampleOutput();
        const d = c.split("\r\n");
        setsampleOutputFileData(d);
        const e = getInput();
        const f = e.split("\r\n");
        setinputFileData(f);
        const g = getOutput();
        const h = g.split("\r\n");
        setoutputFileData(h);
    }, [])

    useEffect(() => {
      calculateAttempted();
      calculateCorrectness();
    }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white px-6 py-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro SC', 'SF Pro Text', 'PingFang SC', 'Arial', 'Hiragino Sans GB', 'Heiti SC', 'Microsoft Yahei', sans-serif", color: "#212121"}}>
          <div className="question__title_detail flex gap-2 text-lg font-semibold text-[#212121] items-start" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"}}>
            <h1>{location.state.questionNo}. </h1>
            <h2 className='capitalize'>{location.state.question.title}</h2>
            <div className="edit_question text-[#BAB8BF] mt-2 text-sm underline cursor-pointer">
              Edit
            </div>
          </div>
          <div className="question__diffeculty py-2 flex items-center">
            <p className='text-xs pr-2 font-semibold text-[#898989]' style={{letterSpacing: "1px"}}>Diffeculty : </p>
            <p className={`text-xs capitalize ${location.state.question.difficulty === 'easy' ? 'text-[#97D01E]' : location.state.question.difficulty === 'medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{location.state.question.difficulty}</p>
          </div>
          <div className="seperate__line bg-[#E8E8E8]" style={{minWidth: "100%", minHeight: "1px"}}></div>
          <div className="question__body pt-4 text-sm flex md:flex-col" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'", letterSpacing: "1px"}}>
            <div className='w-3/5 md:w-full'>
              <p>
                {
                  question__description ? question__description.map((data, index) => {
                    return (
                      <>
                        <p key={index}>{data}</p>
                        <br />
                      </>
                    )
                  })
                  :
                  console.log('')
                }
              </p>
              <div>
                <p className='mt-6 text-sm font-bold'>Sample Input</p>
                <div className="input__data bg-[#F7F6F8] p-4 w-full my-4 rounded-md flex gap-4">
                  <p className='text-sm font-semibold text-[#545356]'>Input: </p>
                  <div>
                    {
                      sampleInputFileData ? sampleInputFileData.map((data, index) => {
                        return (
                          <p className='text-sm' key={index}>{data}</p>
                        )
                      })
                      :
                      console.log('')
                    }
                  </div>
                </div>
                <p className='mt-6 text-sm font-bold'>Sample Output</p>
                <div className="input__data bg-[#F7F6F8] p-4 w-full my-6 rounded-md flex gap-4">
                  <p className='text-sm font-semibold text-[#545356]'>Output: </p>
                  <div>
                    {
                      sampleOutputFileData ? sampleOutputFileData.map((data, index) => {
                        return (
                          <p className='text-sm' key={index}>{data}</p>
                        )
                      })
                      :
                      console.log('')
                    }
                  </div>
                </div>
                <p className='mt-6 text-sm font-bold'>Input</p>
                <div className="input__data bg-[#F7F6F8] p-4 w-full my-6 rounded-md flex gap-4">
                  <p className='text-sm font-semibold text-[#545356]'>Input: </p>
                  <div>
                    {
                      inputFileData ? inputFileData.map((data, index) => {
                        return (
                          <p className='text-sm' key={index}>{data}</p>
                        )
                      })
                      :
                      console.log('')
                    }
                  </div>
                </div>
                <p className='mt-6 text-sm font-bold'>Output</p>
                <div className="input__data bg-[#F7F6F8] p-4 w-full my-6 rounded-md flex gap-4">
                  <p className='text-sm font-semibold text-[#545356]'>Output: </p>
                  <div>
                    {
                      outputFileData ? outputFileData.map((data, index) => {
                        return (
                          <p className='text-sm' key={index}>{data}</p>
                        )
                      })
                      :
                      console.log('')
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className='w-2/5 flex flex-col items-center justify-center md:w-full'>
              <div className='w-full h-[40vh] flex flex-col items-center justify-center'>
                <Doughnut className='w-full text-xs' data={data} options={options} />
              </div>
              <p className='pt-4 pb-6 text-sm font-semibold'>Submission Detail</p>
              <div className='w-full h-[35vh] flex flex-col items-center justify-center'>
                <Doughnut className='w-full text-xs' data={data1} options={options} />
              </div>
              <p className='pt-4 text-sm font-semibold'>Correct vs Incorrect Answers</p>
              <div className="detail my-2 py-2 px-4 text-white capitalize font-semibold rounded-sm shadow-xl cursor-pointer" style={{backgroundImage: "linear-gradient(to right top, #8b37bf, #8840cb, #8349d7, #7c52e3, #745aef, #5471f9, #3085fe, #0095ff, #25b0ff, #5bc8ff, #8edefe, #c0f2ff)", letterSpacing: "1px"}}
                onClick={() => {
                  navigate('/teacher/question/totalsubmit', {state: location.state.question._id});
                }}
              >
                detail
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default QuestionDetail