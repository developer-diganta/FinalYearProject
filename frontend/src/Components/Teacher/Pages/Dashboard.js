import React from 'react'
import '../TeacherProfile.js/TeacherProf.css'
import TeacherHeader from './TeacherHeader'
import Calendar from 'react-calendar'
import { useState } from 'react'
import './Pages.css'
import { useEffect } from 'react'
import { AiOutlineClose } from "react-icons/ai";
import SidebarTEacher from '../Sidebar/SidebarTEacher'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backend_url } from '../../../BackendRoutes'
import { MdOutlineArrowForwardIos } from 'react-icons/md'

var activity = [
    {
        id: 1,
        title: 'Task 1',
        description: 'This is the description of the task 1',
        date: '2023-01-26',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 2,
        title: 'Task 2',
        description: 'This is the description of the task 2',
        date: '2023-01-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Task 3',
        description: 'This is the description of the task 3',
        date: '2023-01-16',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 4,
        title: 'Task 4',
        description: 'This is the description of the task 4',
        date: '2023-01-04',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 5,
        title: 'Task 5',
        description: 'This is the description of the task 5',
        date: '2023-01-17',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 6,
        title: 'Task 6',
        description: 'This is the description of the task 6',
        date: '2022-09-05',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 7,
        title: 'Task 7',
        description: 'This is the description of the task 7',
        date: '2021-09-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 8,
        title: 'Task 8',
        description: 'This is the description of the task 8',
        date: '2021-09-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 9,
        title: 'Task 9',
        description: 'This is the description of the task 9',
        date: '2021-09-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 10,
        title: 'Task 10',
        description: 'This is the description of the task 10',
        // today date
        date: '2023-01-19',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 11,
        title: 'Task 11',
        description: 'This is the description of the task 11',
        date: '2023-01-19',
        time: '10:00',
        status: 'pending'
    },
]

function Dashboard() {
    const[teacher, setTeacher] = useState();
    const[department, setDepartment] = useState();
    const[school, setSchool] = useState();
    const[currentCourses, setCurrentCourses] = useState();
    const[previousCourses, setPreviousCourses] = useState();

    const { openClose, unvSign } = useSelector((state) => state.counter);
    const teacher__id = localStorage.getItem('teacher__id');
    const teacher__token = localStorage.getItem('teacher__token');
    const teacher__email = localStorage.getItem('teacher__email');
    const universityDetail = localStorage.getItem('university');
    const navigate = useNavigate();

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
        };

    function getDayDifference(target){
        const currentDate = new Date(); // Get the current date

        const targetDate = new Date(target); // Set the target date

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = currentDate - targetDate;

        // Convert the difference to days
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        return differenceInDays;
    }

    async function getTeacherDetails(){
        try {
            const instance = axios.create({
                headers: {
                  'x-auth-token': teacher__token,
                },
            });
            const response = await instance.post(backend_url + '/teacher/data', {email: teacher__email, teacherId: teacher__id});
            console.log(response);
            setTeacher(response.data);
            const programData = response.data.department;
            const universityData = await axios.post(backend_url + `/university/details`, {universityId: universityDetail, email: teacher__email});
            console.log(universityData);
            const sch = universityData.data.universityDetails.schools;
    
            for(let i=0; i<sch.length; i++){
                const dept =  sch[i].departments;
                for(let j=0; j<dept.length; j++){
                    if(dept[j].id === programData){
                        setSchool(sch[i].name);
                        setDepartment(dept[j].name);
                        console.log(dept[j]);
                    }
                }
            }

            const all__courses = await instance.post(backend_url + `/teacher/courses/getAll`, {teacherId: teacher__id, email: teacher__email});
            console.log(all__courses);
            let temp1 = [];
            let temp2 = [];
            for(let i=0; i<all__courses.data.courses.length; i++){
                let day = getDayDifference(all__courses.data.courses[i].courseStartDate);
                console.log(day);
                if(day > all__courses.data.courses[i].expectedCourseDuration){
                    temp2.push(all__courses.data.courses[i]);
                }
                else{
                    temp1.push(all__courses.data.courses[i]);
                }
            }
            setCurrentCourses(temp1);
            setPreviousCourses(temp2);
        } catch (error) {
            console.log(error);
            alert("Something went wrong.");
        }
    }

    useEffect(() => {
        getTeacherDetails();
    }, [])

  return (
    <div className='teacter__dashboard flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-[#fbfbfb] ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <TeacherHeader />
            <div className='m-4 flex gap-6 sm:flex-col'>
                <div className='w-2/6 md:w-3/6 sm:w-full pt-2 pb-8 flex items-center bg-white rounded-md shadow-lg flex-col min-h-[94vh]'>
                    <div className='mt-8' style={{objectFit: 'cover'}}>
                    <div className='profile__pic w-28 h-28 text-4xl'>{teacher ? (teacher.name.charAt(0)) : null}</div>
                    </div>
                    <div className='flex flex-col items-center'>
                    <h4 className='text-2xl font-bold pt-3 pb-1'>{teacher?.name}</h4>
                    <h4 className='text-sm text-[#7C7D7D] pb-6' style={{letterSpacing: "1px"}}>{teacher?.email}</h4>
                    <button className='w-56 bg-[#E8DEFF] py-2 rounded-md text-[#5F6161] text-sm font-semibold' style={{letterSpacing: "1px"}}>Edit Profile</button>
                    </div>
                    <div className="divider bg-[#D1D2D2] my-6" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                    <div className='w-full'>
                        <div className='my-4 flex flex-col items-start pl-4'>
                            <p>School</p>
                            <h4 className='text-[#7C7D7D] text-sm font-semibold'>{school}</h4>
                        </div>
                        <div className="divider bg-[#D1D2D2] mx-auto" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                        <div className="university my-4 pt-2 flex flex-col items-start pl-4">
                            <p>Department</p>
                            <h4 className='text-[#7C7D7D] text-sm font-semibold'>{department}</h4>
                        </div>
                        <div className="divider bg-[#D1D2D2] mx-auto" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                        <div className="stream flex flex-col items-start pl-4">
                            {/* <p className='pt-4 pb-2'>Program</p> */}
                            {/* <h4 className='text-[#7C7D7D] text-sm font-semibold'>{school}</h4> */}
                        </div>
                    </div>
                    {/* <div className="divider bg-[#D1D2D2] my-4" style={{minWidth: "100%", minHeight: "1px"}}></div> */}
                </div>
                <div className='w-4/6 pr-4 py-0 md:w-3/6 sm:w-full sm:pr-0 bg-[white] shadow-lg rounded-md'>
                    <div className="current__courses">
                        <h1 className='text-2xl font-bold text-center py-2'>Current Courses</h1>
                        <div className="divider bg-[#D1D2D2] mx-auto" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                        {
                            currentCourses?.map((course, index) => (
                                <div className='' onClick={() => navigate('/teacher/courses/' + course._id, {state: {course, coursestate: 'current'}})}>
                                    <div className="course mr-4 my-4 sm:mx-2 flex text-[#515a61] duration-200" key={course._id} style={{}}>
                                        <div className='p-3 mx-auto w-10/12' style={{
                                                border: "1px solid #9ea7ae"
                                            }}>
                                            <div className="course__title flex justify-between items-center text-lg font-semibold pb-2">
                                                <h3 className='teacher__course__title__h capitalize max-w-[200px]' style={{maxWidth: "240px !important"}}>{course.name}</h3>
                                                <p className='text-xs'>{new Date(course.courseStartDate).toLocaleDateString("en-US", options)}</p>
                                            </div>
                                            <div className="course__description text-sm flex justify-between gap-4 items-center">
                                                <p className='capitalize course__description__p'>{course.description}</p>
                                                <p className='course__status'>{Math.ceil(new Date() - new Date(course.courseStartDate))/(1000 * 3600 * 24) > course.expectedCourseDuration ? 'Completed' : 'Ongoing'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="current__courses">
                        <h1 className='text-2xl font-bold text-center py-2'>Previous Courses</h1>
                        <div className="divider bg-[#D1D2D2] mx-auto" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                        {
                            previousCourses?.map((course, index) => (
                                <div className='' onClick={() => navigate('/teacher/courses/' + course._id, {state: {course, coursestate: 'current'}})}>
                                    <div className="course mr-4 my-4 sm:mx-2 flex text-[#515a61] duration-200" key={course._id} style={{}}>
                                        <div className='p-3 mx-auto w-10/12' style={{
                                                border: "1px solid #9ea7ae"
                                            }}>
                                            <div className="course__title flex justify-between items-center text-lg font-semibold pb-2">
                                                <h3 className='teacher__course__title__h capitalize max-w-[200px]' style={{maxWidth: "240px !important"}}>{course.name}</h3>
                                                <p className='text-xs'>{new Date(course.courseStartDate).toLocaleDateString("en-US", options)}</p>
                                            </div>
                                            <div className="course__description text-sm flex justify-between gap-4 items-center">
                                                <p className='capitalize course__description__p'>{course.description}</p>
                                                <p className='course__status'>{Math.ceil(new Date() - new Date(course.courseStartDate))/(1000 * 3600 * 24) > course.expectedCourseDuration ? 'Completed' : 'Ongoing'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard