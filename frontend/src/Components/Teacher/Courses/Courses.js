import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { BsArrowBarRight, BsArrowReturnRight } from 'react-icons/bs';
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../../BackendRoutes';
import SidebarTEacher from '../Sidebar/SidebarTEacher';
import { IoIosArrowDown } from 'react-icons/io';
import './Courses.css';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

function Courses() {
  const[previousCourses, setPreviousCourses] = useState([]);
  const[dropDown, setDropDown] = useState(false);
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const teacherId = localStorage.getItem('teacher__id');
    const teacherToken = localStorage.getItem('teacher__token');
    const teacher__email = localStorage.getItem('teacher__email');
    const navigate = useNavigate();
    // make an array of courses
    // const courses = [
    //     {
    //         id: 1,
    //         title: 'Course 1',
    //         description: 'This is the description of the course 1',
    //         date: '2023-01-26',
    //         time: '10:00',
    //         status: 'pending'
    //     },
    //     {
    //         id: 2,
    //         title: 'Course 2',
    //         description: 'This is the description of the course 2',
    //         date: '2023-01-01',
    //         time: '10:00',
    //         status: 'pending'
    //     },
    //     {
    //         id: 3,
    //         title: 'Course 3',
    //         description: 'This is the description of the course 3',
    //         date: '2023-01-16',
    //         time: '10:00',
    //         status: 'pending'
    //     },
    // ]

    async function getPreviousCourses(){
        const instance = axios.create({
            headers: {
                'x-auth-token': teacherToken,
            },
        });
        const all__courses = await instance.post(backend_url + `/teacher/course/getCourses`, {teacherId: teacherId, email: teacher__email});
        console.log(all__courses);
        // const previous__courses = all__courses.data.filter((course) => {
        //     const today = new Date();
        //     const course__date = new Date(course.courseStartDate);
        //     console.log(today, course__date);
        //     const diffTime = Math.abs(today - course__date);
        //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        //     console.log(diffDays); 
        //     return course.expectedCourseDuration >= diffDays;
        // });
        setPreviousCourses(all__courses.data);
    }
    useState(() => {
        getPreviousCourses();
    }, [])
  return (
    <div className='current__courses flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
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
                            <div className='py-2 px-2 text-sm w-48 border-2 border-[#6b7780ff] hover:text-[#6b7780ff] hover:bg-[#FFF] cursor-pointer duration-300' style={{fontFamily: "sans-serif", letterSpacing: "2px"}}>Submission Date</div>
                        </div>
                    </div>
                    <div className='bg-[#6b7780] px-4 rounded-3xl cursor-pointer py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onClick={() => navigate('/teacher/cretatecourse')}>Create Course <span className='text-lg pl-2'>+</span> </div>
                </div>
            </div>
            <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>
            <div className="courses grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mx-6">
                {
                    previousCourses.map((course) => (
                        <div className="course mr-4 my-4 flex hover:scale-105 hover:shadow-lg text-[#515a61] duration-200" key={course._id} style={{}}>
                            <div className='w-10/12 p-3' style={{
                                    borderTop: "1px solid #9ea7ae",
                                    borderLeft: "1px solid #9ea7ae",
                                    borderBottom: "1px solid #9ea7ae",
                                }}>
                                <div className="course__title text-lg font-semibold pb-2">
                                    <h3>{course.name}</h3>
                                </div>
                                <div className="course__description text-sm">
                                    <p>{course.description}</p>
                                </div>
                            </div>
                            <div className='w-2/12 bg-[#bac0c5] p-3 flex justify-center items-center text-white font-bold text-xl cursor-pointer'
                                style={{
                                    border: "1px solid #9ea7ae"
                                }}
                                onClick={() => navigate('/teacher/courses/' + course._id, {state: {course, coursestate: 'current'}})}
                            >
                                {/* <BsArrowReturnRight className='font-bold' /> */}
                                {/* <BsArrowBarRight /> */}
                                <MdOutlineArrowForwardIos />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Courses