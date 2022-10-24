import React, { useState } from 'react';
import './Sidebar.css';
//import useDispatch()
import { useDispatch, useSelector } from 'react-redux';
import { incrementAsync } from '../../Redux/Counter';

function Sidebarstudent({openSidebarVal, theme}) {
    // console.log(openSidebarVal);
    const[sidebar, setSidebar] = useState('path');
    const dispatch = useDispatch();
    const { value, sideb } = useSelector((state) => state.counter);
  return (
    <div>
        <div className="sideb w-1/5 block md:hidden text-base">
            <div className='test block md:hidden'>
                <div className="sec_1 pl-4 pb-2 pt-2" style={{borderBottom: "1px solid #7F8C9D"}}>
                    <div className="flex items-center text-2xl gap-1 text-white font-serif tracking-wider">
                        SLATE
                    </div>
                </div>
                <div className="sec_2">
                    <div className="profile flex flex-col items-center">
                        <img className='w-24 h-24 shadow-xl mt-6' style={{borderRadius: "50%", border: "1px solid #b0b0b0"}} src="/profile.png" alt="" />
                        <h1 className='text-xl font-bold text-white pt-4' >Tiasha Dhar</h1>
                        <p className='text-sm font-bold text-white pt-2'>B.Tech IT</p>
                        <div className='bg-divide w-4/5 my-8' style={{minWidth: "80px", minHeight: "1px"}}></div>
                    </div>
                </div>
                <div className="sec_3">
                    <div className={`elements my-4 flex gap-4 w-full items-center px-3 py-2 ${sidebar === 'dashboard' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        <div className='flex justify-between w-8/12'>
                            <h1 className='font-semibold'>Dashboard</h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full px-3 py-2 ${sidebar === 'path' ? 'active' : 'not_active'}`}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#293462" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg> */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                        </svg>
                        <div className='flex justify-between w-8/12'>
                            <h1 className="font-semibold">Path</h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full items-center px-3 py-2 ${sidebar === 'calender' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>
                        <div className='flex justify-between w-8/12'>
                            <h1 className='font-semibold'>Calender</h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full items-center px-3 py-2 ${sidebar === 'reminder' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className='flex justify-between w-8/12'>
                            <h1 className='font-semibold'>Reminder</h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full items-center px-3 py-2 ${sidebar === 'reminder' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className='flex justify-between w-8/12'>
                            <h1 className='font-semibold'>Reminder</h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full items-center px-3 py-2 ${sidebar === 'reminder' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className='flex justify-between w-8/12'>
                            <h1 className='font-semibold'>Reminder</h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full items-center px-3 py-2 ${sidebar === 'reminder' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className='flex justify-between w-8/12'>
                            <h1 className='font-semibold'>Reminder</h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div className='hidden md:block'>
            <div className={`sidebar_mobile w-1/4 sm:w-full ${sideb === true ? 'block' : 'hidden'}`}>
                <div className="sec_1 pl-4 py-2 flex justify-between" style={{borderBottom: "1px solid #E0E0E0"}}>
                    <div className="flex items-center text-sm gap-1">
                        <h1>L</h1>
                        <img className='w-4 h-4' style={{borderRadius: "50%", border: "1px solid #4D5559"}} src="/tan.png" alt="Coding Ninjas" />
                        <h1>GO</h1>
                    </div>
                    <div onClick={() => {
                        dispatch(incrementAsync(4))
                        console.log(sideb);
                        }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </div>
                </div>
                <div className="sec_2">
                    <div className="profile flex flex-col items-center">
                        <img className='w-16 h-16 shadow-xl mt-6' style={{borderRadius: "50%", border: "1px solid #b0b0b0"}} src="/profile.png" alt="" />
                        <h1 className='text-md font-bold text-text pt-4' >Tiasha Dhar</h1>
                        <p className='text-xs font-bold text-text pt-2'>B.Tech IT</p>
                        <div className='bg-divide w-full my-8' style={{minWidth: "80px", minHeight: "1px"}}></div>
                    </div>
                </div>
                <div className="sec_3">
                    <div className={`elements my-4 flex gap-4 w-full mx-auto py-2 pl-2 ${sidebar === 'dashboard' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#B0B0B0" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        <h1 className='text-text font-bold'>Dashboard</h1>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full mx-auto py-2 pl-2 ${sidebar === 'path' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#293462" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                        <h1 className="font-bold" style={{color: "#293462"}}>Path</h1>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full mx-auto py-2 pl-2 ${sidebar === 'calender' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#B0B0B0" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>
                        <h1 className='text-text font-bold'>Calender</h1>
                    </div>
                    <div className={`elements my-4 flex gap-4 w-full mx-auto py-2 pl-2 ${sidebar === 'reminder' ? 'active' : 'not_active'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#B0B0B0" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className='text-text font-bold'>Reminder</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export {Sidebarstudent}