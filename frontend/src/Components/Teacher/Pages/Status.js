import React from 'react'
import './Pages.css'

function Status() {
  return (
    <div className='flex flex-col justify-center items-center' style={{minWidth: "100vw", minHeight: "100vh"}}>
        <h2 className='pendingText'>PENDING</h2>
        <img className='w-1/2' src="/pending.svg" alt="" />
    </div>
  )
}

export default Status