import React, { useState } from 'react';
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
import { backend_url } from '../../../../src/BackendRoutes';
// import { ResizableBox } from 'react-resizable';
var base64 = require('base-64');

function Codeeditor() {
    const[theme, setTheme] = useState(dracula);
    const[language, setLanguage] = useState(javascript);
    const[code, setCode] = useState();
    const[options, setOptions] = useState("questions");
    const[output, setOutput] = useState("ABCD");
    const[opScreen, setOpScreen] = useState(false);
    const[thin, setThin] = useState(false);
    const[slide, setSlide] = useState(false);
    // const[loading, setLoading] = useState(false);
    const arr = [dracula, githubDark, sublime, xcodeDark];
    const themeName = ['Dracula', 'GithubDark', 'Sublime', 'XcodeDark'];
    const lang = ['C++', 'JavaScript', 'C', 'Java', 'HTML'];

    function chooseOptions(event, options) {
        event.preventDefault();
        setOptions(options);
    }

    const submit = async () => {
        setOpScreen(true);
        setOutput('');
        console.log(code);
        const sub_res = await axios.post(backend_url + '/submit', {sourceCode: code});
        console.log(sub_res.data.stdout);
        setOutput(base64.decode(sub_res.data.stdout));
    }

    function hideScreen(){
      setOpScreen(false);
    }

    const left = document.getElementById("left");
    const right = document.getElementById("right");

    const handleWidth = (e) => {
      if(slide){
        const p = e.clientX/window.innerWidth*100;
        left.style.width = `${p}%`;
        right.style.width = `${100-p}%`;
      }
    }
    
    const checkSlider = () => {
      // event.preventDefault();
      console.log(slide);
      if(slide){
        setSlide(false);
      }
    }

    document.onmousemove = e => handleWidth(e);
    document.ontouchmove = e => handleWidth(e.touches[0]);

    return (
      <div className='parent w-full flex'>
        <div className={`ce relative text-lg w-1/2`} id="left" onClick={() => checkSlider()} style={{minWidth: "40vw"}}>
          <div className='editorHead py-3 flex justify-between px-8'>
            <div className='languageDropdown'>
              <select className='themeSelector w-full px-1 py-1 rounded-sm bg-white border-2 border-gray-300' onChange={(e) => setLanguage(e.target.value)}>
                {lang.map((item, index) => {
                  return <option key={index} value={index}>{item}</option>
                }
                )}
              </select>
            </div>

            <div className='themeDropdown'>
              <select className='themeSelector w-full px-1 py-1 rounded-sm bg-white border-2 border-gray-300' onChange={(e) => {
                setTheme(arr[e.target.value])
                }}>
                {
                  Object.keys(arr).map((item, key) => {
                    return <option value={item}>{themeName[key]}</option>
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
            height='82vh'
            theme={theme}
            extensions={[javascript(), cpp(), html()]}
            onChange={(editor, data, value) => {
              setCode(editor);
            }
            }
          />
          <div className="footer flex justify-center gap-10">
              <div className="run px-8 rounded-xl py-1 flex justify-center items-center my-2 cursor-pointer font-semibold">Run</div>
              <div className="submit px-4 py-1 flex justify-center items-center my-2 rounded-xl cursor-pointer font-semibold" onClick={submit}>Submit</div>
          </div>
          <div className={opScreen === false ? 'hide-op' : 'output'}>
            <div className="dw bg-slate-300 flex justify-between items-center gap-2 pr-8 cursor-pointer" onClick={hideScreen}>
              <div className='pt-1 pb-1'>OUTPUT</div>
              <div className='flex items-center'>
                Hide
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
            <div className='output_box'>
              <div className='p-2 font-semibold scroll'>{output !== '' ? output : <div className='flex justify-center'><img style={{height: "100px"}} src="loading.gif" alt="" /></div>}</div>
            </div>
          </div>
        </div>
        <div className="divder tooltip_1 hover:bg-[#B8B8B8]" onClick={() => setSlide(!slide)}>
            <div className='tooltiptext_1 text-xs font-semibold'>Click to adjust size</div>
        </div>
        <div className={`res pl-4 pr-4 pt-1 w-1/2`} id="right" onClick={() => checkSlider()} style={{minWidth: "40vw"}}>
          <div className="res-header flex justify-between items-center py-2">
              {/* create three divs named question, submit, solution */}
               <div className="br question" onClick={(event) => chooseOptions(event, 'questions')}>
                  <h1>Question</h1>
               </div>
               <div className="br sol" onClick={(event) => chooseOptions(event, 'solutions')}>
                  <h1>Solution</h1>
               </div>
               <div className="br subm" onClick={(event) => chooseOptions(event, 'submission')}>
                  <h1>Submission</h1>
               </div>
               {/* <div className="size flex gap-3">
                  <div className="box" onClick={() => {setThin(false)
                    console.log(thin)
                  }}>
                    <div className="box_fill_1"></div>
                  </div>
                  <div className="box" onClick={() => {setThin(true)
                      console.log(thin)
                    }}>
                    <div className="box_fill_2"></div>
                  </div>
               </div> */}
          </div>
          <div className="options">
            <div className='inner_op'>
                {
                  options === "questions" ? <QDescription /> : options === "solutions" ? <Solutions /> : options === "submission" ? <Submission /> : null
                }
            </div>
          </div>
        </div>
      </div>
    );
}

export default Codeeditor



        // ${thin === true ? 'w-1/3' : 'w-1/2'}
        // ${thin === true ? 'w-2/3' : 'w-1/2'}