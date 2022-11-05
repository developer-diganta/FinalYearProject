import React from 'react';
import { useDispatch } from 'react-redux';
import { incrementAsync } from '../../Redux/Counter';
import "./Header.css";

function Header({show}) {
    const dispatch = useDispatch();
  return (
    <div className='header' style={{position: "sticky", top: "0"}}>
        <div className="flex justify-between px-4 py-2">
            <div className="name font-semibold text-2xl flex gap-4 items-center">
                <div className='' onClick={() => dispatch(incrementAsync(10))}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
                {
                    show === 'logo' ?
                    <div className="flex items-center text-2xl gap-1">
                        <h1>L</h1>
                        <img className='w-10 h-10' style={{borderRadius: "50%", border: "1px solid #000000"}} src="/tan.png" alt="Coding Ninjas" />
                        <h1>GO</h1>
                    </div>
                    :
                    <p>{show}</p>
                }
            </div>
            <div className="icons flex gap-2">
                <div className="icon home flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </div>
                <div className="icon"></div>
                <div className="icon"></div>
                <div className="icon"></div>
            </div>
        </div>
    </div>
  )
}

export default Header