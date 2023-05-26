import React, { useEffect, useState } from 'react';
import './Codeeditor.css';
import Codemirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { githubDark } from '@uiw/codemirror-theme-github';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { xcodeDark } from '@uiw/codemirror-theme-xcode';
import axios from 'axios';
import QDescription from './Options/QDescription';
import Solutions from './Options/Solutions';
import Submission from './Options/Submission';
import { useLocation, useNavigate } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane';
import { backend_url } from '../../BackendRoutes';
import { IoIosArrowDropup } from 'react-icons/io';
var base64 = require('base-64');

function Codeeditor() {
  const [theme, setTheme] = useState(dracula);
  const [language, setLanguage] = useState(javascript);
  const [allLanguages, setAllLanguages] = useState()
  const [code, setCode] = useState();
  const [options, setOptions] = useState("questions");
  const [output, setOutput] = useState("");
  const [opScreen, setOpScreen] = useState(false);
  const [thin, setThin] = useState(false);
  const [slide, setSlide] = useState(false);
  const [run, setRun] = useState(false);
  const arr = [dracula, githubDark, sublime, xcodeDark];
  const themeName = ['Dracula', 'GithubDark', 'Sublime', 'XcodeDark'];
  const lang = ['C++', 'JavaScript', 'C', 'Java', 'HTML'];

  const student_id = localStorage.getItem('student__id');
  const university = localStorage.getItem('university');

    const location = useLocation();
    const navigate = useNavigate();
    console.log(location, location.state.courseDetail.course.courseType, "*");

// atob

  function chooseOptions(event, options) {
    event.preventDefault();
    setOptions(options);
  }

    const submit = async () => {
      // console.log(location.state.courseDetail.course.courseType, "*");
        if(location.state.courseDetail.course.courseType === "public"){
          console.log("Public.");
          try{
            setOpScreen(true);
            setOutput('');
            // console.log(code);
            const sub_res = await axios.post(backend_url + '/moocs/question/code/submit', {code: code, student_id: student_id, question_id: location.state.question._id, language_id: language});
            console.log(sub_res.data);
            // setOutput(base64.decode(sub_res.data.stdout));
            setRun(false);
            setOutput(sub_res.data.status.description);
          }catch(err){
            console.log(err);
            alert('Something went wrong');
          }
        }
        else{
          try{
            setOpScreen(true);
            setOutput('');
            console.log(code);
            const sub_res = await axios.post(backend_url + '/submit/student', {code: code, student_id: student_id, question_id: location.state.question._id, language_id: language});
            console.log(sub_res.data);
            // setOutput(base64.decode(sub_res.data.stdout));
            setRun(false);
            setOutput(sub_res.data.status.description);
          }catch(err){
            console.log(err);
            alert('Something went wrong');
          }
        }
    }

  async function runCode() {
    setOpScreen(true);
    setOutput('');
    console.log(code);
    console.log(location);
    const res = await axios.post(backend_url + '/submit', { sourceCode: code, languageId: language, sampleInput: location.state.question.sampleInput, sampleOutput: location.state.question.sampleOutput});
    // setOutput(res.data.status.description);
    setRun(true);
    setOutput(base64.decode(res.data.stdout));
    console.log(res.data);
  }

  function hideScreen() {
    setOpScreen(false);
  }

  async function getLanguageOptions() {
    const res = await axios.post(backend_url + '/languages');
    console.log(res.data);
    setAllLanguages(res.data)
  }

  useEffect(() => {
    getLanguageOptions();
  }, [])

  return (
    <div className='parent w-full flex bg-white min-h-screen md:flex-col'>
      {/* <div className="divder tooltip_1 hover:bg-[#B8B8B8]" onClick={() => setSlide(!slide)}>
            <div className='tooltiptext_1 text-xs font-semibold'>Click to adjust size</div>
        </div> */}
      <div className='md:hidden w-full'>
        <SplitPane split="vertical" defaultSize="50%">
          <Pane initialSize="50%" maxSize="800px">
            {/* question detail section */}
            <div className={`res`} id="left">
              <div className="res-header flex justify-between items-center text-[#6b7780]">
                <div className={`br flex justify-center w-1/3 question ${options === 'questions' ? 'bg-[#f0f1f2]' : null} text-sm py-2 border-r-[1px] border-r-[#d1d5db] border-y-[1px] border-y-[transparent]`} onClick={(event) => chooseOptions(event, 'questions')}>
                  <h1 className='font-semibold'>Question</h1>
                </div>
                <div className={`br flex justify-center w-1/3 sol ${options === 'solutions' ? 'bg-[#f0f1f2]' : null} text-sm py-2 border-r-[1px] border-[#d1d5db]`} onClick={(event) => chooseOptions(event, 'solutions')}>
                  <h1 className='font-semibold'>Solution</h1>
                </div>
                <div className={`br flex justify-center w-1/3 ${options === 'submission' ? 'bg-[#f0f1f2]' : null} text-sm py-2`} onClick={(event) => chooseOptions(event, 'submission')}>
                  <h1 className='font-semibold'>Submission</h1>
                </div>
              </div>
              <div className="back__to__preious__page pt-2 flex items-center gap-2 text-[#6b7780ff] font-bold pl-4 uppercase text-xs cursor-pointer" onClick={() => navigate('/student/course/assignment', { state: { assignment: location.state.assignmentDetail, course: location.state.courseDetail } })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <p className='font-bolder' style={{ fontFamily: "sans-serif" }}>back</p>
              </div>
              <div className="options inner_op">
                {
                  options === "questions" ? <QDescription question={location.state.question} /> : options === "solutions" ? <Solutions /> : options === "submission" ? <Submission /> : null
                }
              </div>
            </div>
          </Pane>
          <Pane initialSize="50%" maxSize="800px">
            {/* code editor section */}
            <div className={`ce relative text-lg`}>
              <div className='editorHead text-sm flex pt-1 pb-[7px] border-[red] justify-between px-8'>
                <div className='languageDropdown'>
                  <select className='themeSelector w-full px-1 py-1 rounded-sm border-[1px] border-[#d1d5db] text-[#6b7780] font-semibold' onChange={(e) => setLanguage(e.target.value)}>
                    {allLanguages?.map((item, index) => {
                      return <option key={index} value={item.id}>{item.name}</option>
                    }
                    )}
                  </select>
                </div>

                <div className='themeDropdown'>
                  <select className='themeSelector w-full px-1 py-1 rounded-sm border-[1px] border-[#d1d5db] text-[#6b7780] font-semibold' onChange={(e) => {
                    setTheme(arr[e.target.value])
                  }}>
                    {
                      Object.keys(arr).map((item, key, index) => {
                        return <option key={index} value={item}>{themeName[key]}</option>
                      }
                      )
                    }
                  </select>
                </div>
              </div>
              <Codemirror
                value=""
                spellCheck={true}
                autoCorrect={true}
                placeholder="Type here..."
                height='86vh'
                style={{ fontSize: "14px" }}
                theme={theme}
                extensions={[javascript(), cpp(), html()]}
                onChange={(editor, data, value) => {
                  setCode(editor);
                }
                }
              />
              <div className="footer flex justify-start gap-10 items-center">
                <div className='text-xl text-[#6b7780ff] font-semibold bg-[#f0f1f2ff] w-8 h-8 ml-4 flex items-center justify-center shadow-md rounded-sm border-[1px] border-[#6b7780]' onClick={(event) => setOpScreen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </div>
                <div className='flex gap-10 mx-auto'>
                  <div className="run px-8 rounded-xl py-1 flex justify-center items-center my-2 cursor-pointer font-semibold" onClick={runCode}>Run</div>
                  <div className="submit px-4 py-1 flex justify-center items-center my-2 rounded-xl cursor-pointer font-semibold" onClick={submit}>Submit</div>
                </div>
              </div>
              {/* <div className={opScreen === false ? 'hide-op' : 'output'}>
                <div className="dw bg-slate-300 flex justify-between items-center gap-2 pr-8 cursor-pointer" onClick={hideScreen}>
                  <div className='pt-1 pb-1 pl-4'>OUTPUT</div>
                  <div className='flex items-center'>
                    Hide
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div> */}
                <div className={opScreen === false ? 'hide-op' : 'output'}>
                  <div className="dw bg-slate-300 flex justify-between items-center gap-2 pr-8 cursor-pointer" onClick={hideScreen}>
                    <div className='pt-1 pb-1 pl-4'>OUTPUT</div>
                    <div className='flex items-center'>
                      Hide
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                  <div className='output_box'>
                    <div className={`p-2 font-semibold scroll ${run === true ? 'text-[#6b7780ff]' : output === 'Accepted' ? 'text-success' : 'text-[red]'}`}>{output !== '' ? output : <div className='flex justify-center flex-col items-center'><img style={{height: "100px"}} src="/loading1.gif" alt="" /><p className='text-[#000000] text-xs -top-4 relative'>compiling....</p></div>}</div>
                  </div>
                </div>
            </div>
          </Pane>
        </SplitPane>
      </div>

      <div className='hidden md:block'>
        <SplitPane split="horizontal" defaultSize="50%">
          <Pane initialSize="50%" maxSize="800px">
            {/* question detail section */}
            <div className={`res`} id="left">
              <div className="res-header flex justify-between items-center text-[#6b7780]">
                <div className={`br flex justify-center w-1/3 question ${options === 'questions' ? 'bg-[#f0f1f2]' : null} text-sm py-2 border-r-[1px] border-r-[#d1d5db] border-y-[1px] border-y-[transparent]`} onClick={(event) => chooseOptions(event, 'questions')}>
                  <h1 className='font-semibold'>Question</h1>
                </div>
                <div className={`br flex justify-center w-1/3 sol ${options === 'solutions' ? 'bg-[#f0f1f2]' : null} text-sm py-2 border-r-[1px] border-[#d1d5db]`} onClick={(event) => chooseOptions(event, 'solutions')}>
                  <h1 className='font-semibold'>Solution</h1>
                </div>
                <div className={`br flex justify-center w-1/3 ${options === 'submission' ? 'bg-[#f0f1f2]' : null} text-sm py-2`} onClick={(event) => chooseOptions(event, 'submission')}>
                  <h1 className='font-semibold'>Submission</h1>
                </div>
              </div>
              <div className="back__to__preious__page pt-2 flex items-center gap-2 text-[#6b7780ff] font-bold pl-4 uppercase text-xs cursor-pointer" onClick={() => navigate('/student/course/assignment', { state: { assignment: location.state.assignmentDetail, course: location.state.courseDetail } })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <p className='font-bolder' style={{ fontFamily: "sans-serif" }}>back</p>
              </div>
              <div className="options inner_op">
                {
                  options === "questions" ? <QDescription question={location.state.question} /> : options === "solutions" ? <Solutions /> : options === "submission" ? <Submission /> : null
                }
              </div>
            </div>
          </Pane>
          <Pane initialSize="50%" maxSize="800px">
            {/* code editor section */}
            <div className={`ce relative text-lg`}>
              <div className='editorHead text-sm flex pt-1 pb-[7px] border-[red] justify-between px-8'>
                <div className='languageDropdown'>
                  <select className='themeSelector w-full px-1 py-1 rounded-sm border-[1px] border-[#d1d5db] text-[#6b7780] font-semibold' onChange={(e) => setLanguage(e.target.value)}>
                    {allLanguages?.map((item, index) => {
                      return <option key={index} value={item.id}>{item.name}</option>
                    }
                    )}
                  </select>
                </div>

                <div className='themeDropdown'>
                  <select className='themeSelector w-full px-1 py-1 rounded-sm border-[1px] border-[#d1d5db] text-[#6b7780] font-semibold' onChange={(e) => {
                    setTheme(arr[e.target.value])
                  }}>
                    {
                      Object.keys(arr).map((item, key, index) => {
                        return <option key={index} value={item}>{themeName[key]}</option>
                      }
                      )
                    }
                  </select>
                </div>
              </div>
              <Codemirror
                value=""
                spellCheck={true}
                autoCorrect={true}
                placeholder="Type here..."
                height='86vh'
                style={{ fontSize: "14px" }}
                theme={theme}
                extensions={[javascript(), cpp(), html()]}
                onChange={(editor, data, value) => {
                  setCode(editor);
                }
                }
              />
              <div className="footer flex justify-between gap-10 items-center mx-2">
                <div className='text-xl text-[#6b7780ff] font-semibold bg-[#f0f1f2ff] w-8 h-8 flex items-center justify-center shadow-md rounded-sm border-[1px] border-[#6b7780]' onClick={(event) => setOpScreen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                </div>
                <div className="run px-8 rounded-xl py-1 flex justify-center items-center my-2 cursor-pointer font-semibold sm:text-sm" onClick={runCode}>Run</div>
                <div className="submit px-4 py-1 flex justify-center items-center my-2 rounded-xl cursor-pointer font-semibold sm:text-sm" onClick={submit}>Submit</div>
                {/* <div className='flex gap-10 mx-auto'>
                  </div> */}
              </div>
              <div className={opScreen === false ? 'hide-op' : 'output'}>
                <div className="dw bg-slate-300 flex justify-between items-center gap-2 pr-8 cursor-pointer" onClick={hideScreen}>
                  <div className='pt-1 pb-1 pl-4'>OUTPUT</div>
                  <div className='flex items-center'>
                    Hide
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
                <div className={opScreen === false ? 'hide-op' : 'output'}>
                  <div className="dw bg-slate-300 flex justify-between items-center gap-2 pr-8 cursor-pointer" onClick={hideScreen}>
                    <div className='pt-1 pb-1 pl-4'>OUTPUT</div>
                    <div className='flex items-center'>
                      Hide
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                  <div className='output_box'>
                    <div className={`p-2 font-semibold scroll ${output === 'Accepted' ? 'text-success' : 'text-[red]'}`}>
                      {output === '????' ? null : output}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}

export default Codeeditor



        // ${thin === true ? 'w-1/3' : 'w-1/2'}
        // ${thin === true ? 'w-2/3' : 'w-1/2'}