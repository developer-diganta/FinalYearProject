import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CgChevronDoubleRight } from 'react-icons/cg';
import { IoIosArrowDown } from 'react-icons/io';
import { MdDoubleArrow, MdOutlineArrowForwardIos } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import { backend_url } from '../../../BackendRoutes';
import SidebarStudent from '../Sidebar/SidebarStudent';
import './StudentCourse.css';

function StudentCourse() {
    const[courses, setCourses] = useState([]);
    const[dropDown, setDropDown] = useState(false);
    const { openClose } = useSelector((state) => state.counter);
    const student__id = localStorage.getItem('student__id');
    const student__token = localStorage.getItem('student__token');
    const student__email = localStorage.getItem('student__email');
    const universityDetail = localStorage.getItem('university');
    const navigate = useNavigate();

    const options = {
      day: "numeric",
      month: "short",
      year: "numeric"
    };

  async function getCourses(){
    try {
      const instance = axios.create({
          headers: {
              'x-auth-token': student__token,
          },
      });
      const all__courses = await instance.post(backend_url + `/student/courses`, {studentId: student__id, email: student__email});
      console.log(all__courses.data.courses);
      // const previous__courses = all__courses.data.filter((course) => {
      //     const today = new Date();
      //     const course__date = new Date(course.courseStartDate);
      //     console.log(today, course__date);
      //     const diffTime = Math.abs(today - course__date);
      //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      //     console.log(diffDays); 
      //     return course.expectedCourseDuration >= diffDays;
      // });
      const dateObj = new Date(all__courses);
      
      let coursesArray = []
      for(let i=0; i<all__courses.data.courses.length; i++){
        const courseDetail = await instance.post(backend_url + `/university/course/details`, {universityId: universityDetail, courseId: all__courses.data.courses[i].course});
        courseDetail.data.completed = all__courses.data.courses[i].completed;
        courseDetail.data.courseScore = all__courses.data.courses[i].courseScore;
        courseDetail.data.progress = all__courses.data.courses[i].progress;
        console.log(courseDetail);
        coursesArray.push(courseDetail.data);
      }
      setCourses(coursesArray);

    } catch (error) {
        console.log(error);
        alert('Something went wrong');
    }
  }

  useEffect(() => {
    getCourses();
  }, [])

  return (
    <div className='current__courses flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarStudent />
      </div>
      <div className={`dashboard_1 bg-[#fbfbfb] ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
        {/* <div className='bg-[#E2DEED] font-semibold py-1 px-8 flex gap-2 items-center' style={{letterSpacing: "1px"}}>
          <h2>{location.state.coursestate === 'previous' ? 'Previous Course' : 'Current Course'}</h2>
          <MdDoubleArrow className='rounded-full m-1 w-6 h-6 p-1 text-white' style={{backgroundImage: "linear-gradient(to right top, #ef32d9, #ff1987, #ff7332, #fbb800, #a8eb12)"}} />
          <h2>{location.state.course.name}</h2>
        </div>
        <div className='questions px-8'>
          {
            allQuestions ? allQuestions.map((question, index) => {
              return (
                <div className='question bg-white my-6 py-6 px-4 flex justify-between items-end rounded-sm shadow-lg cursor-pointer hover:text-[#C11FF5]' 
                // onClick={() => navigate('/teacher/question/questiondetail', {state: {question, courseDetail: courseDetail, questionNo: index+1}})}
                >
                  <div className=''>
                    <div className='question__title'>
                      <h3 className='text-xl font-semibold pb-1' style={{fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif"}}>{index+1}. {question.title}</h3>
                    </div>
                    <div className='question__difficulty'>
                      <p className={`text-xs ${question.difficulty === 'Easy' ? 'text-[#97D01E]' : question.difficulty === 'Medium' ? 'text-[#FEC831]' : 'text-[#FB4A3F]'} font-semibold`}>{question.difficulty}</p>
                    </div>
                  </div>
                  <div>
                    <div className='solve__question px-4 py-2 rounded-sm hover:scale-105 cursor-pointer hover:shadow-lg' onClick={() => {
                      navigate('/student/question/solve', {state: question})
                      }}>Solve Question</div>
                  </div>
                </div>
              )
            })
            :
            console.log("")
          }
        </div> */}
        <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Home</p>
                <CgChevronDoubleRight />
                <p>Courses</p>
            </div>
            <div className='flex justify-between w-11/12 mx-auto items-center mt-4 mb-3'>
                <h1 className='text-xl font-bold'>All Courses</h1>
                <div className="flex items-center gap-4">
                    <div className='relative'>
                        <div className='bg-[#6b7780] px-4 rounded-3xl py-2 cursor-pointer text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => setDropDown(!dropDown)}>Sort By 
                            <IoIosArrowDown className='text-lg ml-2' /> 
                        </div>
                        <div className={`option__div bg-[#6b7780ff] text-white absolute -left-4 mt-1 z-50 ${!dropDown ? 'hidden' : 'block'}`} >
                            <div className='py-2 px-2 text-sm w-48 border-2 border-[#6b7780ff] hover:text-[#6b7780ff] hover:bg-[#FFF] cursor-pointer duration-300' style={{fontFamily: "sans-serif", letterSpacing: "2px"}}>Active Courses</div>
                            <div className='py-2 px-2 text-sm w-48 border-2 border-[#6b7780ff] hover:text-[#6b7780ff] hover:bg-[#FFF] cursor-pointer duration-300' style={{fontFamily: "sans-serif", letterSpacing: "2px"}}>Completed Courses</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
            {
                courses.length > 0 ? 
                    <div className="courses grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mx-6">
                        {
                            courses.map((course, index) => (
                                <div className="course mr-4 my-4 flex hover:scale-105 hover:shadow-lg text-[#515a61] duration-200" key={index} style={{}}>
                                    <div className='w-10/12 p-3' style={{
                                            borderTop: "1px solid #9ea7ae",
                                            borderLeft: "1px solid #9ea7ae",
                                            borderBottom: "1px solid #9ea7ae",
                                        }}>
                                        <div className="course__title flex justify-between items-center text-lg font-semibold pb-2">
                                            <h3 className='capitalize'>{course.name}</h3>
                                            <p className='text-xs'>{new Date(course.courseStartDate).toLocaleDateString("en-US", options)}</p>
                                        </div>
                                        <div className="course__description text-sm flex justify-between gap-4 items-center">
                                            <p className='capitalize course__description__p'>{course.description}</p>
                                            <p className='course__status'>{Math.ceil(new Date() - new Date(course.courseStartDate))/(1000 * 3600 * 24) > course.expectedCourseDuration ? 'Completed' : 'Ongoing'}</p>
                                        </div>
                                    </div>
                                    <div className='w-2/12 bg-[#bac0c5] p-3 flex justify-center items-center text-white font-bold text-xl cursor-pointer'
                                        style={{
                                            border: "1px solid #9ea7ae"
                                        }}
                                        onClick={() => navigate('/student/courses/' + course._id, {state: course})}
                                    >
                                        {/* <BsArrowReturnRight className='font-bold' /> */}
                                        {/* <BsArrowBarRight /> */}
                                        <MdOutlineArrowForwardIos />
                                    </div>
                                </div>
                            ))
                        }
                    </div> :
                    <div>
                        <div className='flex justify-center items-center w-full flex-col'>
                            <img src="/teacherrC.svg" className='w-48 h-48 mt-20 opacity-50' alt="" />
                            <h2 className='py-4 font-semibold'>No Courses Found.</h2>
                        </div>
                    </div>
            }
      </div>
    </div>

  )
}

export default StudentCourse