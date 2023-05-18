import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function CourseDescription({course}) {
  const[resources, setResources] = useState();
  const[resourcesToBeAdded, setResourcesToBeAdded] = useState();

  async function getLinks(){
    const links = "https://www.example.com,https://www.google.com,https://www.openai.com,https://www.wikipedia.org,https://www.github.com";
    const linkArray = links.split(',');
    console.log(linkArray);
    setResources(linkArray);
  }

  async function addResources(event){
    event.preventDefault();
    console.log(resourcesToBeAdded);
  }

  useEffect(() => {
    getLinks();
  }, [])

  return (
    <div>
        <div className="course__detail">
            <div className='py-4 px-4 text-base flex items-center gap-4'>
              <h4>Course Name: </h4>
              <p className='text-base font-semibold' style={{letterSpacing: "1px"}}>{course?.description}</p>
            </div>
            <div className='py-4 px-4 text-base flex items-center gap-4'>
              <h4>Course Type: </h4>
              <p className='font-semibold'>{course?.courseType}</p>
            </div>
            <div className='py-4 px-4 text-base flex items-center gap-4 sm:items-start'>
              <h4>Compilers: </h4>
              <div className='flex items-center gap-2 sm:flex-col'>
                {
                  course?.courseCompilers?.map((compiler, index) => (
                    <p className='uppercase font-semibold' key={index}>{compiler}</p>
                  ))
                }
              </div>
            </div>
        </div>
        <div className="resources py-4 px-4">
          <div className='w-36 bg-[#6b7780] sm:hidden px-4 rounded-3xl cursor-pointer py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}}>Resources</div>
          {/* <div className='divider bg-divider mt-2 min-h-[1px] min-w-[90%] max-w-[95%] mx-2'></div> */}
          <div className='border-[1px] border-[#cdcbcdff] rounded-lg my-4 py-2 px-4 bg-[#f9fafbff]'>
            {
              resources?.map((link, index) => (
                <p key={index} className='py-2'>
                  <a className='text-[#2937f0ff]' target='none' href={link}>{link}</a>
                </p>
              ))
            }
          </div>
          <div className='w-48 bg-[#6b7780] sm:hidden px-4 rounded-3xl cursor-pointer py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}}>Add Resources</div>
          <form className='my-4' onSubmit={(event) => addResources(event)}>
            <p className='text-xs pb-2'>* Please provide only resource links separated by ',' .</p>
            <textarea name="" id="" cols="30" rows="4" className='w-full py-2' onChange={(event) => setResourcesToBeAdded(event.target.value)}></textarea>
            <button type="submit" className='bg-[#dededfff] px-4 py-1 my-2 rounded-sm text-sm font-sans'>
              Add
            </button>
          </form>
        </div>
    </div>
  )
}

export default CourseDescription