import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import '../Courses.css'

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  datasets: [{
    data: [60, 40],
    backgroundColor: ['#8B5CFB', '#E3E2E3'],
    borderWidth: 0,

    // reduce the thikness
    cutout: 70,
  }],
  labels: ['Submitted', 'Not Submitted']
};

const options = {
  cutoutPercentage: 40
};

function QuestionDetail() {
    const { openClose } = useSelector((state) => state.counter);
    const location = useLocation();
    const question__description = location.state.question.question.split("\n");
    console.log(question__description);
    const[inputFileData, setinputFileData] = useState("");
    const[outputFileData, setoutputFileData] = useState("");
    const[sampleInputFileData, setsampleInputFileData] = useState("");
    const[sampleOutputFileData, setsampleOutputFileData] = useState("");

    console.log(location);
    console.log(location.state.question.input, typeof(location.state.question.input));

    const getInput = (event) => {
      let base64String = location.state.question.input;
      let base64String2 = base64String;
      console.log(base64String2);
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
      console.log(base64String2);
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
      console.log(base64String2);
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
      console.log(base64String2);
      return decodeURIComponent(
        atob(base64String2)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    };

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

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white px-6 py-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro SC', 'SF Pro Text', 'PingFang SC', 'Arial', 'Hiragino Sans GB', 'Heiti SC', 'Microsoft Yahei', sans-serif", color: "#212121"}}>
          <div className="question__title flex gap-2 text-lg font-semibold text-[#212121] items-center" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"}}>
            <h1>{location.state.questionNo}. </h1>
            <h1 className='capitalize'>{location.state.question.title}</h1>
            <div className="edit_question text-[#BAB8BF] text-sm underline cursor-pointer">
              Edit
            </div>
          </div>
          <div className="question__diffeculty py-2 flex items-center">
            <p className='text-xs pr-2 font-semibold text-[#898989]' style={{letterSpacing: "1px"}}>Diffeculty : </p>
            <p className={`text-xs capitalize ${location.state.question.difficulty === 'easy' ? 'text-[#97D01E]' : location.state.question.difficulty === 'medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{location.state.question.difficulty}</p>
          </div>
          <div className="seperate__line bg-[#E8E8E8]" style={{minWidth: "100%", minHeight: "1px"}}></div>
          <div className="question__body pt-4 text-sm flex" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'", letterSpacing: "1px"}}>
            <p className='w-3/5'>
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
            <div className='w-2/5 flex flex-col items-center justify-center'>
              <div className='h-60 w-full flex justify-center'>
                <Doughnut className='w-full text-xs' data={data} options={options} />
              </div>
              <p className='pt-4'>Submission Detail</p>
            </div>
          </div>
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
  )
}

export default QuestionDetail