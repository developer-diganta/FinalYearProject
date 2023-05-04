import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { BsArrowReturnRight } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../../BackendRoutes';
import SidebarStudent from '../Sidebar/SidebarStudent';
// import SidebarTEacher from '../Sidebar/SidebarTEacher';

function StudentCurrentCourse() {
  const[previousCourses, setPreviousCourses] = useState([]);
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const studentId = localStorage.getItem('student__id');
    const studentToken = localStorage.getItem('student__token');
    const studentEmail = localStorage.getItem('student__email');
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
        console.log("Hit.");
        const instance = axios.create({
            headers: {
                'x-auth-token': studentToken,
            },
        });
        const all__courses = await instance.post(backend_url + `/student/courses`, {studentId: studentId, email: studentEmail});
        console.log(all__courses);
        const previous__courses = all__courses.data.filter((course) => {
            const today = new Date();
            const course__date = new Date(course.courseStartDate);
            console.log(today, course__date);
            const diffTime = Math.abs(today - course__date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(diffDays); 
            return course.expectedCourseDuration >= diffDays;
        });
        setPreviousCourses(previous__courses);
    }
    useState(() => {
        getPreviousCourses();
    }, [])
  return (
    <div className='current__courses flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarStudent />
        </div>
        <div className={`dashboard_1 bg-[#fbfbfb] ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='pb-1 my-2 mx-2' style={{backgroundImage: "radial-gradient(circle, #c0392b, #c7254c, #c2206e, #af3090, #8e44ad)"}}>
                <h2 className='bg-[#E2DEED] font-semibold p-1' style={{letterSpacing: "1px"}}>Current courses</h2>
            </div>
            <div className="courses grid grid-cols-2 mx-2">
                {
                    previousCourses.map((course) => (
                        <div className="course mr-4 my-4 flex hover:scale-105 hover:shadow-lg" key={course._id} style={{}}>
                            <div className='w-10/12 bg-[#E2DEED] p-3'>
                                <div className="course__title text-lg font-semibold pb-2">
                                    <h3>{course.name}</h3>
                                </div>
                                <div className="course__description text-sm">
                                    <p>{course.description}</p>
                                </div>
                                <p className='text-sm font-semibold text-[#7F00FF]'>Not Completed</p>
                            </div>
                            <div className='w-2/12 bg-[#8a66ec] p-3 flex justify-center items-center text-white font-bold text-xl cursor-pointer'
                                onClick={() => navigate('/student/currentcourse/questions', {state: {course, coursestate: 'current'}})}
                            >
                                <BsArrowReturnRight />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default StudentCurrentCourse