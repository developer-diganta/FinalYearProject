import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingHeader() {
    const[smallHeader, setSmallHeader] = useState(false);
    const[sticky, setSticky] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setSticky(true);
            } else {
                setSticky(false);
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

  return (
    <div className={`bg-white relative ${sticky ? 'shadow-lg' : ''} ${sticky ? 'w-full' : ''}`} style={{position: sticky ? "fixed" : "static", transition: "top 0.8s ease", zIndex: "200"}}>
        <div className="landing_header flex justify-between">
            <div className="landing_header_left pl-8" onClick={() => navigate('/')}>
                <img className='bg w-28' src="/SLATE.png" alt="" />
            </div>
            <div className='flex items-center'>
                <div className="landing_header_right md:hidden flex gap-10 items-center pr-8">
                    <div className='nav_link home' style={{color: "#9900ff"}} onClick={() => navigate('/')}>Home</div>
                    <div className='nav_link about'>About</div>
                    <div className='nav_link contactus' onClick={() => navigate('/university')}>For University</div>
                    
                </div>
                <div className="md_page hidden md:block pr-8 py-2">
                    <div className='border-2 p-3 rounded-xl' onClick={() => setSmallHeader(!smallHeader)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div className={`w-full ${smallHeader === false ? 'hidden' : 'block'} shadow-lg absolute z-50 bg-white`} style={{borderTop: "1px solid #7F8C9D"}}>
            <div className='flex flex-col items-center gap-4 py-2'>
                <div className='home'>Home</div>
                <div className='about'>About</div>
                <div className='contactus'>Contact</div>
                
            </div>
        </div>
    </div>
  )
}

export default LandingHeader