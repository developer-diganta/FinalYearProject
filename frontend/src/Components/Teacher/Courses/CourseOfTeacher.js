import React from 'react'
import { useSelector } from 'react-redux';
import SidebarTEacher from '../Sidebar/SidebarTEacher';
import { MdDoubleArrow } from 'react-icons/md';
import CourseOptions from './CourseOptions';
import { useParams, useLocation } from 'react-router-dom';
import Question from './DifferentOptions/Question';
import Student from './DifferentOptions/Student';
import Syllabus from './DifferentOptions/Syllabus';
import axios from 'axios';
import { backend_url } from '../../../BackendRoutes';
import { localCompletionSource } from '@codemirror/lang-javascript';

function Course() {
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const { options, courseId } = useParams();
  const location = useLocation();
  const token = localStorage.getItem('teacher__token');
  console.log(options, courseId, location.state);

  async function getCourseDetails(){
    // const instance = axios.create({
    //   headers: {
    //     'x-auth-token': token,
    //   },
    // });
    //     console.log("courseId.", courseId);
    // const course__data = await instance.post(backend_url + '/university/course/details', {courseId: courseId,  universityId: unv__id});
    // console.log("acceptedTeachers", course__data);
    // // setTeacher(course__data.data);
  }

  return (
    <div className='flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarTEacher />
      </div>
      <div className={`dashboard_1 bg-[#F6F6F6] px-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
          <div className='pb-1 my-2 mx-2' style={{backgroundImage: "radial-gradient(circle, #c0392b, #c7254c, #c2206e, #af3090, #8e44ad)"}}>
              <div className='bg-[#E2DEED] font-semibold p-1 flex gap-2 items-center' style={{letterSpacing: "1px"}}>
                <h2>{location.state.coursestate === 'previous' ? 'Previous Course' : 'Current Course'}</h2>
                <MdDoubleArrow className='rounded-full m-1 w-6 h-6 p-1 text-white' style={{backgroundImage: "linear-gradient(to right top, #ef32d9, #ff1987, #ff7332, #fbb800, #a8eb12)"}} />
                <h2>{location.state.course.name}</h2>
              </div>
          </div>
          <div className='flex mx-2 gap-4'>
            <div className='left_dashboard w-5/6'>
              {
                (() => {
                  switch (options) {
                    case 'questions':
                      return <Question coursestate={location.state.coursestate} courseDetail={location.state.course} />;
                    case 'students':
                      return <Student />;
                    case 'syllabus':
                      return <Syllabus />;
                    default:
                      return <div>Invalid Page</div> ;
                  }
                })()
              }
            </div>
            <div className='right__dashboard w-1/6 pt-16'>
              <CourseOptions />
            </div>
          </div>
      </div>
    </div>
  )
}

export default Course