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

function Codeeditor() {
    const[theme, setTheme] = useState(dracula);
    const[language, setLanguage] = useState(javascript);
    const arr = [dracula, githubDark, sublime, xcodeDark];
    const themeName = ['Dracula', 'GithubDark', 'Sublime', 'XcodeDark'];
    const lang = ['C++', 'JavaScript', 'C', 'Java', 'HTML'];

    return (
        <div className="ce w-1/2 text-lg pb-2 mx-2 shadow-2xl">
          <div className='editorHead py-2 flex justify-between'>
            <div className='languageDropdown'>
              <select className='themeSelector w-full px-4 py-2 rounded-lg bg-white border-2 border-gray-300' onChange={(e) => setLanguage(e.target.value)}>
                {lang.map((item, index) => {
                  return <option key={index} value={index}>{item}</option>
                }
                )}
              </select>
            </div>

            <div className='themeDropdown'>
              <select className='themeSelector w-full px-4 py-2 rounded-lg bg-white border-2 border-gray-300' onChange={(e) => {
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
            height='90vh'
            theme={theme}
            extensions={[javascript(), cpp(), html()]}
            onChange={(editor, data, value) => {
              console.log(value);
            }
            }
          />
          <div className="footer flex justify-center gap-10">
              <div className="run px-8 rounded-xl py-1 flex justify-center items-center my-2 cursor-pointer font-semibold" style={{border: "1px solid #90a4ae"}}>Run</div>
              <div className="submit px-4 py-1 flex justify-center items-center my-2 rounded-xl cursor-pointer font-semibold" style={{border: "1px solid #90a4ae"}}>Submit</div>
          </div>
        </div>
    );
}

export default Codeeditor