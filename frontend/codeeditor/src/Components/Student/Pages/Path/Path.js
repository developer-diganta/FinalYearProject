import React from 'react';
import { useState } from 'react';
import Sidebar from '../../../Sidebar/Sidebar';
import './Path.css';

const val = {
    path_name: "C++"
}

const questions = [
    {
        question: "1",
        description: "What is the output of the following code snippet?",
        difficulty: "Easy",
        status: "Solved"
    },
    {
        question: "2",
        description: "What is the output of the following code snippet?",
        difficulty: "Easy",
        status: "Solved"
    },
    {
        question: "3",
        description: "Find the shortest path between two nodes in a graph.",
        difficulty: "Medium",
        status: "Not Solved"
    },
    {
        question: "4",
        description: "Find the continuous subarray with the largest sum.",
        difficulty: "Hard",
        status: "Solved"
    },
    {
        question: "5",
        description: "Find the continuous subarray with the largest sum.",
        difficulty: "Easy",
        status: "Not Solved"
    },
    {
        question: "1",
        description: "What is the output of the following code snippet?",
        difficulty: "Easy",
        status: "Solved"
    },
    {
        question: "2",
        description: "What is the output of the following code snippet?",
        difficulty: "Easy",
        status: "Solved"
    },
    {
        question: "3",
        description: "Find the shortest path between two nodes in a graph.",
        difficulty: "Medium",
        status: "Not Solved"
    },
    {
        question: "4",
        description: "Find the continuous subarray with the largest sum.",
        difficulty: "Hard",
        status: "Solved"
    },
    {
        question: "5",
        description: "Find the continuous subarray with the largest sum.",
        difficulty: "Easy",
        status: "Not Solved"
    }
]

function Path() {

    const[openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="path flex w-full">
        {/* <div className='left 2xl:w-1/5'>
            <div className="left_inner 2xl:w-1/5 pt-2">
                <div className="logo_parent">
                <div className="logo flex justify-center items-center bg-white">
                    <img src="/tan.png" alt="Coding Ninjas" />
                </div>
                </div>
                <div className="profile h-full flex flex-col justify-between">
                    <div className="profile_img flex justify-center mb-2 pt-10 flex-col items-center">
                        <img className='w-2/4' src="/profile.png" alt="profile" />
                        <h2 className='py-4 font-bold text-lg space-x-2' style={{letterSpacing: "2px"}}>Priyankshi Sharma</h2>
                    </div>
                    <div className="buttons flex flex-col items-center">
                        <div className='nav_items dashboard w-3/4'>
                            <h1>dashboard</h1>
                        </div>
                        <div className='nav_items path w-3/4'>
                            <h1>path</h1>
                        </div>
                        <div className='nav_items calender w-3/4'>
                            <h1>calender</h1>
                        </div>
                        <div className='nav_items reminder w-3/4'>
                            <h1>reminder</h1>
                        </div>
                    </div>
                    <div className="left_footer">
                        <div>@2021 Coding Ninjas</div>
                    </div>
                </div>
            </div>
        </div> */}
        <Sidebar openSidebarVal={openSidebar} />
        <div className="left 2xl:w-1/5 md:w-0"></div>
        <div className='right 2xl:w-4/5 md:w-full'>
            <div className="right_header flex justify-between px-4 py-2">
                <div className="name font-semibold text-2xl flex gap-4 items-center">
                    <div className='md:block hidden' onClick={() => setOpenSidebar(!openSidebar)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="#FFF" class="w-8 h-8" style={{filter: 'drop-shadow(3px 3px 2px rgb(0 0 0 / 0.2))'}}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                    </div>
                    Path
                </div>
                <div className="icons flex gap-2">
                    <div className="icon"></div>
                    <div className="icon"></div>
                    <div className="icon"></div>
                    <div className="icon"></div>
                </div>
            </div>
            <div className="path_name flex justify-center">
                {val.path_name}
            </div>
            <div className="sort_selection_area flex justify-end md:text-sm md:justify-center mr-10 text-sm">
                <select id="countries" placeholder='Sory by difficulty' class="bg-white border text-lg border-gray-300 rounded-lg block w-48 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                {/* <option selected="">Sory by difficulty</option> */}
                <option className='md:text-sm' value="All">All</option>
                <option className='md:text-sm' value="US">Easy</option>
                <option className='md:text-sm' value="CA">Medium</option>
                <option className='md:text-sm' value="FR">Hard</option>
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
                    {questions.map((question, index) => (
                        <div className="indi_question flex justify-between w-full">
                            <h4>{index+1}</h4>
                            <p className='px-1'> . </p>
                            <div className='w-3/5 pr-4 question_description'>{question.description}</div>
                            <div className='w-1/5' style={{color: question.difficulty === 'Easy' ? '#30C8E8' : question.difficulty === 'Medium' ? '#FFB90F' : '#CB2A00'}}>{question.difficulty}</div>
                            <div className='w-1/5 flex justify-center'>{question.status === 'Solved' ? <div className='solve tooltip'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#048F09" class="w-4 h-4"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg><span class="tooltiptext text-xs font-thin">Solved</span></div> : <div className='not_solve tooltip'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#5E0101" class="w-3 h-3"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" /></svg><span class="tooltiptext text-xs font-thin">Not Solved</span></div>}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="screen_overlay md:block hidden">
            <div style={{minHeight: '100vh', minWidth: "100vw", position: "fixed", backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: "888", top: "0", left: "0", overflow: "hidden", display: openSidebar === true ? 'block' : "none"}}>
                <div className='flex justify-end z-999 fixed right-0' onClick={() => setOpenSidebar(!openSidebar)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Path