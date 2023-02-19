import React from 'react'
import { FaBell } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function StudentHeader() {
  const navigate = useNavigate();
  return (
    <div className='flex justify-between bg-[#eaecef] py-2 px-8 items-center'>
        <div className='text-lg font-semibold' style={{letterSpacing: "2px"}}>Student</div>
        <div className='flex items-center gap-6'>
            {/* <div className="add p-1">
              <IoCreateOutline className='text-2xl font-bold text-[#567189] cursor-pointer' />
            </div> */}
            <div className="notification relative p-1 cursor-pointer">
              <FaBell className='text-xl text-[#8D8DAA]' />
              <div className="red_dot absolute top-1 right-1" style={{minWidth: "7px", minHeight: "7px", borderRadius: "50%", backgroundColor: "#FF0032"}}></div>
            </div>
            <div className="profile h-10 w-10 flex justify-center items-center bg-white rounded-full cursor-pointer" style={{backgroundImage: "linear-gradient(to bottom, #fc0153, #fc0079, #ec00a5, #c500d3, #763dfe)"}} onClick={() => navigate('/student/profile')}>
                <h2 className='text-[#733ef0] h-9 w-9 font-bold text-base bg-white rounded-full flex justify-center items-center'>ST</h2>
            </div>
        </div>
    </div>
  )
}

export default StudentHeader