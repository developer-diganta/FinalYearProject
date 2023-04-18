import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backend_url } from '../../../../BackendRoutes';

function TotalSubmission() {
    const[submittedStudents, setSubmittedStudents] = useState([]);
    const[studentMap, setStudentMap] = useState(new Map());
    const { openClose } = useSelector((state) => state.counter);

    const location = useLocation();
    console.log(location);
    const teacher__token = localStorage.getItem('teacher__token');
    const teacher__id = localStorage.getItem('teacher__id');
    const teacher__email = localStorage.getItem('teacher__email');
    const universityId = localStorage.getItem('university');
    const navigate = useNavigate();

    async function getSubmissionDetail(){
        try {
            const instance = axios.create(
                {
                    headers: {
                        'x-auth-token': teacher__token
                    }
                }
            )
            const response = await instance.post(backend_url + '/teacher/analysis/question', {questionId: location.state, email: teacher__email})
            console.log(response);
            let temp = new Set();
            let tempMap = new Map();
            for(let i=0; i<response.data.submissions.length; i++){
                // console.log(response.data.submissions[i]);
                temp.add(response.data.submissions[i].student);
                if(tempMap.has(response.data.submissions[i].student)){
                    tempMap.get(response.data.submissions[i].student).push(response.data.submissions[i])
                }
                else{
                    tempMap.set(response.data.submissions[i].student, [response.data.submissions[i]]);
                }
            }
            let students = [];
            for (const student of temp) {
                // console.log(student);
                const res = await instance.post(backend_url + '/student/data', {studentId: student, email: teacher__email});
                // console.log(res);
                students.push(res.data);
            }
            setSubmittedStudents(students);
            console.log(tempMap);
            setStudentMap(tempMap)
        } catch (error) {
            console.log(error);
            alert('something went wrong');
            if(error.response.status === 401){
                // localStorage.removeItem('teacher__token');
                // navigate('/teacher/signup');
            }
        }
    }

    useEffect(() => {
        getSubmissionDetail();
    }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white px-6 py-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro SC', 'SF Pro Text', 'PingFang SC', 'Arial', 'Hiragino Sans GB', 'Heiti SC', 'Microsoft Yahei', sans-serif", color: "#212121"}}>
            <h1 className='text-2xl font-bold uppercase text-[#6b7780ff]' style={{letterSpacing: "1px", wordSpacing: "10px"}}>Students submitted</h1>
            <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%]'></div>
            {
                submittedStudents?.map((student, index) => (
                    <div className='bg-white my-6 py-2 px-4 rounded-sm shadow-md cursor-pointer border-[1px] border-[#97a0a6] hover:bg-[#f0f1f2] duration-150'
                    onClick={() => navigate('/teacher/studentanalysis', {state: {student: student, submissions: studentMap.get(student._id)}})}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='question__title flex gap-10 w-full items-center justify-between'>
                          <h3 className='w-1/3 text-base text-[#606b73] font-semibold pb-1 xxs:text-xs' style={{ fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif" }}>{index + 1}. {student.name}</h3>
                          <h4 className='w-1/3 text-[#6b7780ff] font-semibold pb-1 xxs:text-xs' style={{ fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif" }}>{student.email}</h4>
                          <div className='w-1/3 text-[#6b7780ff] font-semibold pb-1 xxs:text-xs flex items-center gap-4' style={{ fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif" }}>
                            <div>
                                Total submissions: 
                            </div>
                            <div className='bg-[#6e4ffcff] px-2 py-1 flex items-center justify-center text-white rounded-sm' style={{width: "30px"}}>{studentMap?studentMap.get(student._id).length:null}</div>
                        </div>
                        </div>
                      </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default TotalSubmission