import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Sidebaruniversity from '../Sidebaruniversity/Sidebaruniversity';

function Course() {
    // get the course name from the url
    const{course} = useParams();
    const { openClose, unvSign } = useSelector((state) => state.counter);

  return (
    <div>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
    </div>
  )
}

export default Course