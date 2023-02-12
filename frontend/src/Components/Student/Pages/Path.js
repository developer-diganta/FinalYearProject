import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementAsync } from '../../../../Redux/Counter';
import { Sidebarstudent } from '../../../Sidebar/Sidebar';
import Header from '../../../AppHeader/Header';
import './Path.css';
import { useNavigate } from 'react-router-dom';
import { Questions } from '../../../../Question';

const val = {
    path_name: "C++"
}


function Path() {
    const[openSidebar, setOpenSidebar] = useState(false);
    const[diffeculty, setDiffeculty] = useState('All');
    const[question, setQuestion] = useState(Questions);
    const dispatch = useDispatch();
    const {value, sideb} = useSelector(state => state.counter);

    const navigate = useNavigate();

    function changeDiffeculty(event){
        event.preventDefault();
        setDiffeculty(event.target.value);
        if(event.target.value !== 'All'){
            console.log(event.target.value, Questions, Questions.filter((question) => question.difficulty === event.target.value));
            setQuestion(Questions.filter((question) => question.difficulty === event.target.value));
        }
        else{
            setQuestion(Questions);
        }
    }

  return (
    <div className="path flex w-full">
        <Sidebarstudent openSidebarVal={openSidebar} />
        <div className="left 2xl:w-1/5 md:w-0"></div>
        <div className='right 2xl:w-4/5 md:w-full'>
            <Header show={'Path'} />
            <div className="path_name flex justify-center">
                {val.path_name}
            </div>
            <div className="sort_selection_area flex justify-end md:text-sm md:justify-center mr-10 text-sm">
                <select id="countries" placeholder='Sory by difficulty' class="bg-white border text-lg border-gray-300 rounded-lg block w-48 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" onChange={(event) => changeDiffeculty(event)}>
                {/* <option selected="">Sory by difficulty</option> */}
                <option className='md:text-sm' value="All">All</option>
                <option className='md:text-sm' value="Easy">Easy</option>
                <option className='md:text-sm' value="Medium">Medium</option>
                <option className='md:text-sm' value="Hard">Hard</option>
                </select>
            </div>
            <div className="question_container w-4/5 mx-auto mt-8">
                <div className="question_header flex justify-between w-full">
                    <div className='w-3/5 sm:w-2/4 text-lg font-bold'>Question</div>
                    <div className='w-1/5 sm:w-1/4 text-lg font-bold'>Difficulty</div>
                    <div className='w-1/5 sm:w-1/4 text-lg font-bold flex justify-center'>Status</div>
                </div>
                <div className='bottom_divider min-h-1 min-w-full mb-8'></div>
                <div className="questions">
                    {
                        
                        console.log(question)
                    }
                    {
                    question.map((question, index) => (
                        <div className="indi_question flex justify-between w-full cursor-pointer"
                         onClick={() => navigate(`/${question.id}/solve`)}
                         >
                            <h4>{index+1}</h4>
                            <p className='px-1'> . </p>
                            <div className='w-3/5 pr-4 question_description'>{question.description}</div>
                            <div className='w-1/5' style={{color: question.difficulty === 'Easy' ? '#30C8E8' : question.difficulty === 'Medium' ? '#FFB90F' : '#CB2A00'}}>{question.difficulty}</div>
                            <div className='w-1/5 flex justify-center'>{question.status === 'Solved' ? <div className='solve tooltip'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#048F09" class="w-4 h-4"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg><span class="tooltiptext text-xs font-thin">Solved</span></div> : <div className='not_solve tooltip'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#5E0101" class="w-3 h-3"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" /></svg><span class="tooltiptext text-xs font-thin">Not Solved</span></div>}</div>
                        </div>
                    )) 
                        // Questions ? console.log("Error", Questions[0]) : console.log("Error")
                    }
                </div>
            </div>
        </div>
        <div className="screen_overlay md:block hidden sm:hidden">
            <div style={{minHeight: '100vh', minWidth: "100vw", position: "fixed", backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: "888", top: "0", left: "0", overflow: "hidden", display: sideb === true ? 'block' : "none"}}>
                
            </div>
        </div>
    </div>
  )
}

export default Path