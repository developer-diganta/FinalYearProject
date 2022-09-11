import React from 'react';
import { ResizableBox } from 'react-resizable';
import './Signup.css';

function Signup() {
  return (
    <div className="signup">
        <h1>Signup</h1>
        {/* create form to signup */}
        <form action="" className='flex flex-col'>
            <input type="text" placeholder="Enter your name" />
            <input type="email" placeholder="Enter your email" />
            <input type="password" placeholder="Enter your password" />
            <input type="password" placeholder="Confirm your password" />
            <button>Signup</button>
        </form>


        <div>
          <ResizableBox  className='bg-red-400' width={200} height={200}
            minConstraints={[100, 100]} maxConstraints={[1000, 300]}>
          <span><img src="tan.png" alt="" /></span>
          </ResizableBox>
        </div>


    </div>
  )
}

export default Signup