import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import SidebarStudent from '../Student/Sidebar/SidebarStudent';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiArrowRightSFill } from 'react-icons/ri';
import './PublicCourses.css';
import { HiStar } from 'react-icons/hi';
import axios from 'axios';
import { backend_url } from '../../BackendRoutes';
import {  BsArrowRight } from 'react-icons/bs';
import { FaUniversity } from 'react-icons/fa';

function SinglePublicCourse() {
  const[enrolled, setEnrolled] = useState(false);
  const[university, setUniversity] = useState();
  const[teacher, setTeacher] = useState();
  const[rating, setRating] = useState(1);

  const { openClose } = useSelector((state) => state.counter);
  const location = useLocation().state;
  console.log(location);

  const student__token = localStorage.getItem('student__token');
  const student__id = localStorage.getItem('student__id');
  const student__email = localStorage.getItem('student__email');
  const navigate = useNavigate();

  function changeDate(dateParm) {
    const date = new Date(dateParm);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }
  
  async function enrollToTheCourse(){
    const instance = axios.create({
      headers: {
          'x-auth-token': student__token,
      },
    });
    const response = await instance.post(backend_url + `/moocs/student/enroll`, {studentId: student__id, moocId: location.course._id});
    console.log(response.data);
    if(response.data.status === 200){
      alert("You are enrolled to the course");
    }
    else{
      alert(response.data.message);
    }
    navigate('/publiccourses');
  }

  function checkIfEnrolled(){
    // console.log(location.detail.moocs);
    for(let i=0; i<location.detail.moocs.length; i++){
      console.log(location.detail.moocs[i].mooc, location.course._id);
      if(location.detail.moocs[i].mooc === location.course._id){
        setEnrolled(true);
      }
    }
  }

  async function setUniversityDetail(){
    try {
      const instance = axios.create({
          headers: {
              'x-auth-token': student__token,
          },
      });
      const universityData = await axios.post(backend_url + `/university/details`, {universityId: location.course.university, email: student__email});
      console.log(universityData);
      setUniversity(universityData.data.universityDetails.name)
    } catch (error) {
      
    }
  }

  async function getTeacherDetail(){
    try {
      const instance = axios.create({
          headers: {
              'x-auth-token': student__token,
          },
      });
      const teacherData = await instance.post(backend_url + `/teacher/data`, {teacherId: location.course.teacher, email: student__email});
      console.log(teacherData);
      setTeacher(teacherData.data.name)
    } catch (error) {
      console.log(error);
    }
  }

  async function submitRating(){
    console.log(rating);
  }

  useEffect(() => {
    setUniversityDetail();
    getTeacherDetail();
    checkIfEnrolled();
  }, [])

  return (
    <div className='individual__course flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarStudent />
      </div>
      <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
        {/* <div className="nav__bar bg-[#f0f1f2ff] py-2 flex text-xs items-center px-4">
          <div className='public__left__nav'>Public Courses</div>
          <div>
            <RiArrowRightSFill />
          </div>
          <div>{location.course.name}</div>
        </div> */}
        <div className="course__details">
            <div className={`color__card pl-10 pt-10 pb-10 min-h-[40vh]`} >
                <p className='course__title__card text-[5rem] uppercase w-10/12 lg:text-[3rem] lg:w-full md:text-[2rem] md:pr-4' style={{fontFamily: "'Open Sans', sans-serif", color: "rgba(255, 255, 255, 0.6"}}>{location.course.name}</p>
                <div className='flex items-center gap-8'>
                    <div className={`${enrolled ? 'hidden' : 'block'} enroll__course bg-[#f65b66] w-36 h-16 rounded-sm flex items-center justify-center font-serif text-white shadow-primary shadow-lg cursor-pointer hover:scale-105 duration-150 mt-8`} style={{letterSpacing: "2px"}}
                    onClick={() => {
                      enrollToTheCourse()
                    }}
                    >
                        Enroll
                    </div>
                </div>
                <div className={`${enrolled ? 'block' : 'hidden'} flex items-center gap-8`}>
                    <div className={`enrolled__to__course bg-[#f65b66] w-36 h-16 rounded-sm flex items-center justify-center font-serif text-white shadow-primary shadow-lg mt-8`} style={{letterSpacing: "2px"}}>
                        Enrolled
                    </div>
                    <div className='h-16 mt-8 flex items-center font-semibold font-serif cursor-pointer hover:scale-105 duration-150' style={{color: "rgba(255, 255, 255, 0.6)", letterSpacing: "1px"}}
                      onClick={() => {
                        navigate('/publiccourses/assignment', {state: {course: location.course, assignment: " "}})
                      }}
                    >
                      Go to the Course
                      <BsArrowRight className='ml-2 font-bold text-lg' />
                    </div>
                </div>
            </div>
            <div className='pl-10 pt-6 w-10/12 mb-8'>
                <h1 className="course__text__title text-2xl font-bold font-sans text-[#5b6064] pb-4" style={{letterSpacing: "2px"}}>{location.course.name}</h1>
                <p className="course__text__description text-sm font-sans text-[#5b6064]" style={{letterSpacing: "1px"}}>{location.course.description}</p>
                <div className="course__text__description text-sm flex items-center gap-2 font-sans text-[#5b6064] mt-4">
                  <FaUniversity className='text-[#7C7D7D] text-xl' />
                  <p className='text-lg' style={{fontStyle: "italic"}}>{university}</p>
                </div>
                <div>
                  <div className='flex items-center gap-1 border-[1px] border-[#adb5bdff] justify-center w-16 my-4 rounded-md py-1'>
                      <HiStar className='text-[#ffd200] text-xl' />
                      <p className='font-sans text-sm font-semibold'>4.5</p>
                  </div>
                  <div className={`${enrolled ? 'block' : 'hidden'} mb-4`}>
                    <p className='text-lg font-bold font-sans text-[#5b6064] pb-2'>Rate this course between 1 to 5</p>
                    <div className='flex items-center'>
                      <select className='themeSelector w-28 px-1 py-1 rounded-sm border-[1px] font-sans border-[#d1d5db] text-[#6b7780] font-semibold' onChange={(e) => setRating(e.target.value)}>
                        <option key={1} value={1}>1 star</option>
                        <option key={2} value={2}>2 star</option>
                        <option key={3} value={3}>3 star</option>
                        <option key={4} value={4}>4 star</option>
                        <option key={5} value={5}>5 star</option>
                      </select>
                      <button className='bg-[#dededfff] ml-2 px-2 py-1 rounded-sm text-sm font-semibold font-sans text-[#5b6064]' type='submit' onClick={submitRating}>Submit</button>
                    </div>
                  </div>

                </div>
                <p className='text-lg font-bold font-sans border-b-[1px] text-[#5b6064] border-[#5b6064] pb-1'>Course created by</p>
                <div className="course__instructor flex items-center font-sans gap-2 mt-4">
                    <div className='uppercase bg-[#6b7780ff] h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-bold'>{teacher ? teacher.charAt(0) : null}</div>
                    <p className='font-semibold text-[#5b6064]' style={{letterSpacing: "1px"}}>{teacher}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePublicCourse