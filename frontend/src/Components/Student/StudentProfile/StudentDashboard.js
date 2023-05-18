import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StudentHeader from '../Pages/StudentHeader';
import SidebarStudent from '../Sidebar/SidebarStudent';
import axios from 'axios';
import { backend_url } from '../../../BackendRoutes';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ProgressBar from '../Pages/ProgressBar';
import './StudentProfile.css';
// import Calendar from 'react-calendar'
// import { AiOutlineClose } from "react-icons/ai";
// import { setUniversityDetail } from '../../../Redux/Counter';
// import { IoLocationOutline } from 'react-icons/io5';
// import { FaUniversity } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const q = {
  total: 100,
  completed: 30,
  remaining: 70,
  easy: 40,
  easyComplete: 18,
  medium: 30,
  mediumComplete: 9,
  hard: 30,
  hardComplete: 3,
}


function StudentDashboard() {
    const[student, setStudent] = useState();
    const[program, setProgram] = useState();
    const[department, setDepartment] = useState();
    const[school, setSchool] = useState();
    const[data, setData] = useState({
        datasets: [{
          data: [50, 10, 40],
          backgroundColor: ['#34c9be', '#f7596d', '#E3E2E3'],
          borderWidth: 0,
      
          // reduce the thikness
          cutout: 70,
        }],
        labels: ['Submitted', 'Not Submitted']
    });
    const[questions, setQuestions] = useState();
    const[totalQuestion, setTotal] = useState();
    const[totalCourses, setTotalCourses] = useState();
    const[easy, setEasy] = useState(0);
    const[medium, setMedium] = useState(0);
    const[hard, setHard] = useState(0);


    const { openClose, unvSign } = useSelector((state) => state.counter);

    const student__id = localStorage.getItem('student__id');
    const student__token = localStorage.getItem('student__token');
    const student__email = localStorage.getItem('student__email');
    const universityDetail = localStorage.getItem('university');
    const navigate = useNavigate();

    const detail = {
        width: 260,
        // color: '#9fa0ff',
        color: '#2a9d8f',
        percent: ((q.easyComplete)/q.easy)*100,
    }
    
    const detail2 = {
        width: 260,
        // color: '#ff8500',
        color: '#e9c46a',
        percent: ((q.mediumComplete)/q.medium)*100,
    }
    
    const detail3 = {
        width: 260,
        // color: '#6a040f',
        color: '#e76f51',
        percent: ((q.hardComplete)/q.hard)*100,
    }

    async function getStudentData(){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': student__token,
                },
            });
            const all__courses = await instance.post(backend_url + `/student/data`, {studentId: student__id, email: student__email});
            console.log(all__courses.data);
            if(all__courses.data.isdeleted === true){
                alert("Account has been deleted. To restore it back, contact admin");
                localStorage.removeItem('student__token');
                localStorage.removeItem('student__id');
                localStorage.removeItem('student__email');
                navigate('/');
            }
            const programData = all__courses.data.program;
            setStudent(all__courses.data);
            setTotalCourses(all__courses.data.courses.length);

            const universityData = await axios.post(backend_url + `/university/details`, {universityId: universityDetail, email: student__email});
            console.log(universityData);

            const sch = universityData.data.universityDetails.schools;

            for(let i=0; i<sch.length; i++){
                const dept =  sch[i].departments;
                for(let j=0; j<dept.length; j++){
                    const prog = dept[j].programs;
                    for(let k=0; k<prog.length; k++){
                        if(prog[k].id === programData){
                            console.log(sch[i].name, dept[j].name, prog[k].name);
                            setSchool(sch[i].name);
                            setDepartment(dept[j].name);
                            setProgram(prog[k].name);
                        }
                    }
                }
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            if(error.response.status === 401){
                navigate('/student/signup')
            }
        }
    }

    async function getQuestionDetailsForStudent(){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': student__token,
                },
            });
            const question__details = await instance.post(backend_url + `/student/performance`, {studentId: student__id, email: student__email});
            console.log(question__details.data);
            setQuestions(question__details.data);
            let totalQuestion = question__details.data.easy+question__details.data.medium+question__details.data.hard;
            let accepted = question__details.data.easyAccepted+question__details.data.mediumAccepted+question__details.data.hardAccepted;
            let rejected = question__details.data.easyRejected+question__details.data.mediumRejected+question__details.data.hardRejected;
            let easyPer = (question__details.data.easyAccepted*100)/question__details.data.easy;
            setEasy(question__details.data.easy === 0 ? 0 : easyPer);
            let mediumPer = (question__details.data.mediumAccepted*100)/question__details.data.medium;
            setMedium(question__details.data.medium === 0 ? 0 : mediumPer);
            let hardPer = (question__details.data.hardAccepted*100)/question__details.data.hard;
            setHard(question__details.data.hard === 0 ? 0 : hardPer);
            console.log(totalQuestion, accepted, rejected);
            let temp = {
                datasets: [{
                  data: [accepted, rejected, totalQuestion],
                  backgroundColor: ['#34c9be', '#f7596d', '#E3E2E3'],
                  borderWidth: 0,
              
                  // reduce the thikness
                  cutout: 70,
                }],
                labels: ['accept', 'reject', 'total']
            }
            setData(temp);
            setTotal(totalQuestion);
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    useEffect(() => {
        getStudentData();
        getQuestionDetailsForStudent();
    }, [])

  return (
    <div className='student__dashboard flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarStudent />
        </div>
        <div className={`dashboard_1 bg-[#fbfbfb] ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <StudentHeader />
            <div className='flex gap-2 mx-4 my-4 sm:flex-col sm:mx-10 xxs:mx-4'>
                <div className='w-4/6 pr-4 py-0 md:w-3/6 sm:w-full sm:pr-0'>
                    <div className='flex items-start justify-between gap-4 md:flex-col'>
                        <div className='flex items-center bg-white w-1/2 flex-col rounded-md shadow-lg md:w-full'>
                        <Doughnut 
                            data={data}
                        />
                        <p className='my-4'>
                            Total Questions: {totalQuestion ? totalQuestion : 0}
                        </p>
                        </div>
                        <div className='flex flex-col w-1/2 gap-4 md:w-full'>
                        <div className="total__courses bg-white py-4 rounded-md shadow-lg">
                            <div className='text-xs bg-white rounded-full w-28 h-28 mx-auto flex flex-col items-center justify-center' style={{border: "2px solid #f77f00"}}>
                            <p className='text-[#f77f00] text-2xl font-bold'>{totalCourses ? totalCourses : 0}</p>
                            <p className='text-2xs' style={{fontSize: "10px"}}>Total Courses</p>
                            </div>
                        </div>
                        <div className='bg-white py-2 rounded-md shadow-lg px-4'>
                            <div className='my-2 mx-2'>
                                <div className='flex items-center text-xs'>
                                    <p className='w-2/5'>Easy</p>
                                    {console.log(questions)}
                                    <p>{questions ? questions.easyAccepted ? questions.easyAccepted : 0 : 0} / {questions ? questions.easy ? questions.easy: 0 : 0}</p>
                                </div>
                                <div style={{ '--value-color': '#2a9d8f' }}>
                                    <ProgressBar value={easy} bgColor="#e3e2e3" />
                                </div>
                            </div>
                            <div className='my-6 mx-2'>
                                <div className='flex items-center text-xs'>
                                    <p className='w-2/5'>Medium</p>
                                    <p>{questions ? questions.mediumAccepted ? questions.mediumAccepted : 0 : 0} / {questions ? questions.medium ? questions.medium : 0 : 0}</p>
                                </div>
                                <div style={{ '--value-color': '#e9c46a' }}>
                                    <ProgressBar value={medium} bgColor="#e3e2e3" />
                                </div>
                            </div>
                            <div className='my-6 mx-2'>
                                <div className='flex items-center text-xs'>
                                    <p className='w-2/5'>Hard</p>
                                    <p>{questions ? questions.hardAccepted ? questions.hardAccepted : 0 : 0} / {questions ? questions.hard ? questions.hard : 0 : 0}</p>
                                </div>
                                <div style={{ '--value-color': '#e76f51' }}>
                                    <ProgressBar value={hard} bgColor="#e3e2e3" />
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className='w-2/6 md:w-3/6 sm:w-full pt-2 pb-8 flex items-center bg-white rounded-md shadow-lg flex-col min-h-[94vh]'>
                    <div className='mt-8' style={{objectFit: 'cover'}}>
                    <div className='profile__pic w-28 h-28 text-4xl'>{student ? (student.name.charAt(0)) : null}</div>
                    </div>
                    <div className='flex flex-col items-center'>
                    <h4 className='text-2xl font-bold pt-3 pb-1'>{student?.name}</h4>
                    <h4 className='text-sm text-[#7C7D7D] pb-6' style={{letterSpacing: "1px"}}>{student?.email}</h4>
                    <button className='w-56 bg-[#E8DEFF] py-2 rounded-md text-[#5F6161] text-sm font-semibold' style={{letterSpacing: "1px"}}>Edit Profile</button>
                    </div>
                    <div className="divider bg-[#D1D2D2] my-6" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                    <div className='w-full'>
                        <div className='my-4 flex flex-col items-start pl-4'>
                            <p>School</p>
                            <h4 className='text-[#7C7D7D] text-sm font-semibold'>{program}</h4>
                        </div>
                        <div className="divider bg-[#D1D2D2] mx-auto" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                        <div className="university my-4 pt-2 flex flex-col items-start pl-4">
                            <p>Department</p>
                            <h4 className='text-[#7C7D7D] text-sm font-semibold'>{department}</h4>
                        </div>
                        <div className="divider bg-[#D1D2D2] mx-auto" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
                        <div className="stream flex flex-col items-start pl-4">
                            <p className='pt-4 pb-2'>Program</p>
                            <h4 className='text-[#7C7D7D] text-sm font-semibold'>{school}</h4>
                        </div>
                    </div>
                    {/* <div className="divider bg-[#D1D2D2] my-4" style={{minWidth: "100%", minHeight: "1px"}}></div> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default StudentDashboard