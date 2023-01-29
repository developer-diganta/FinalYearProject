import React from 'react'
import { FaBell } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";

function TeacherHeader() {
  return (
    <div className='flex justify-between bg-[#eaecef] py-2 px-8 items-center'>
        <div className='text-lg font-semibold' style={{letterSpacing: "2px"}}>Teacher</div>
        <div className='flex items-center gap-6'>
            <div className="add p-1">
              <IoCreateOutline className='text-2xl font-bold text-[#567189] cursor-pointer' />
            </div>
            <div className="notification relative p-1 cursor-pointer">
              <FaBell className='text-xl text-[#8D8DAA]' />
              <div className="red_dot absolute top-1 right-1" style={{minWidth: "7px", minHeight: "7px", borderRadius: "50%", backgroundColor: "#FF0032"}}></div>
            </div>
            <div className="profile h-8 w-8 flex justify-center items-center p-4 bg-white rounded-md cursor-pointer" style={{border: "2px solid #733ef0"}}>
                <h2 className='text-[#733ef0] font-bold text-lg'>TH</h2>
            </div>
        </div>
    </div>
  )
}

export default TeacherHeader