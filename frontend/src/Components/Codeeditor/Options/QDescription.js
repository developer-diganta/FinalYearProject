import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import { Questions } from '../../../Question';

function QDescription({question}) {

  const[sampleInputFileData, setsampleInputFileData] = useState("");
  const[sampleOutputFileData, setsampleOutputFileData] = useState("");
  const{id} = useParams();
  console.log(question);
  const question__description = question.question.split("\n");
  // const question = Questions.filter((question) => question.id === parseInt(id))[0];

  const getSampleInput = (event) => {
    let base64String = question.sampleInput;
    let base64String2 = base64String.split("base64,")[1];
    console.log(base64String2);
    return decodeURIComponent(
      atob(base64String2)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  };

  const getSampleOutput = (event) => {
    let base64String = question.sampleOutput;
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
    const a = getSampleInput();
    const b = a.split("\r\n");
    setsampleInputFileData(b);
    const c = getSampleOutput();
    const d = c.split("\r\n");
    setsampleOutputFileData(d);
}, [])

  return (
    <div className='question__solve text-[#414242]' style={{fontFamily: "sans-serif"}}>
      {
        question ?
          <div>
            <div>
              <h1 className='text-2xl pb-2 font-semibold'>{question.title}</h1>
            </div>
            <div className='question__difficulty flex items-center gap-2'>
              <p className='text-xs text-[#969898]' style={{letterSpacing: "2px"}}>Diffeculty: </p>
              <p className={`text-xs uppercase font-bold ${question.difficulty === 'easy' ? 'text-[#97D01E]' : question.difficulty === 'medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} `} style={{letterSpacing: "2px", fontWeight: "800"}}>{question.difficulty}</p>
            </div>
            <div className='divider min-w-[100%] min-h-[1px] bg-[#D1D2D2] my-2'></div>
            <div>
              <p>
                {
                  question__description ? question__description.map((data, index) => {
                    return (
                      <>
                        <p className='text-sm' style={{letterSpacing: "1px"}} key={index}>{data}</p>
                        <br />
                      </>
                    )
                  })
                  :
                  console.log('')
                }  
              </p>
            </div>
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
            </div>
          </div>
        :
        console.log("dkjfsdkjksj.")
      }
    </div>
  )
}

export default QDescription