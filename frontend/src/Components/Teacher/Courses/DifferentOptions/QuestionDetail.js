import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Red', 'Green', 'Blue'],
  datasets: [{
    data: [10, 20, 30],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
  }]
};

const options = {
  title: {
    display: true,
    text: 'My Doughnut Chart'
  }
};

function QuestionDetail() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const location = useLocation();
    const[inputFileData, setinputFileData] = useState("");
    const[outputFileData, setoutputFileData] = useState("");

    console.log(location);
    console.log(location.state.question.input, typeof(location.state.question.input));
    const getInput = (event) => {
      let base64String = location.state.question.input;
      let base64String2 = base64String.split("base64,")[1];
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
      let base64String2 = base64String.split("base64,")[1];
      console.log(base64String2);
      return decodeURIComponent(
        atob(base64String2)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    };

    useEffect(() => {
        const a = getInput();
        const b = a.split("\r\n");
        setinputFileData(b);
        const c = getOutput();
        const d = c.split("\r\n");
        setoutputFileData(d);
    }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white px-6 py-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
          <div className="question__title flex gap-2 text-lg font-semibold text-[#212121]" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"}}>
            <h1>{location.state.questionNo}. </h1>
            <h1 className='capitalize'>{location.state.question.title}</h1>
          </div>
          <div className="question__diffeculty py-2">
            <p className={`text-xs ${location.state.question.difficulty === 'Easy' ? 'text-[#97D01E]' : location.state.question.difficulty === 'Medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{location.state.question.difficulty}</p>
          </div>
          <div className="seperate__line bg-[#E8E8E8]" style={{minWidth: "100%", minHeight: "1px"}}></div>
          <div className="question__body pt-4 text-sm" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'", letterSpacing: "1px"}}>
            <p>{location.state.question.question}</p>
          </div>
          <div className="input__data">
            <p>Input: </p>
            {
              inputFileData ? inputFileData.map((data, index) => {
                return (
                  <p key={index}>{data}</p>
                )
              })
              :
              console.log('')
            }
          </div>
          <div className="input__data">
            <p>Output: </p>
            {
              outputFileData ? outputFileData.map((data, index) => {
                return (
                  <p key={index}>{data}</p>
                )
              })
              :
              console.log('')
            }
          </div>
          <div>
            <h2>My Doughnut Chart</h2>
            <div className='w-2/4 bg-lightGreen h-60'>
              <Doughnut className='w-64 h-60' data={data} options={options} />
            </div>
          </div>
        </div>
    </div>
  )
}

export default QuestionDetail