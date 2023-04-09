import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { backend_url } from '../../../../BackendRoutes';
import { useNavigate } from 'react-router-dom';

function AddStudentToCourse({currentCourse}) {
    const[allStudents, setAllStudents] = useState([]);

    const teacher__token = localStorage.getItem('teacher__token');
    const teacherId = localStorage.getItem('teacher__id');
    const teacher__email = localStorage.getItem('teacher__email');
    
    const navigate = useNavigate();

    console.log(currentCourse);

    async function getStudents(){
        try {
          const instance = axios.create({
            headers: {
              'x-auth-token': teacher__token
            }
          });
    
          console.log("jgfwjegfkw", currentCourse.course.university);
          const res = await instance.post(backend_url + '/teacher/university/student', {universityId: currentCourse.course.university, email: teacher__email});
          console.log(res);
          setAllStudents(res.data);
        } catch (error) {
          console.log(error);
          alert("Something went wrong");
          if(error.response.status === 401){
            navigate('/teacher/login');
          }
        }
      }
    let addStudentsList = [];
    for(let i=0; i<allStudents.length; i++){
        if(allStudents[i].status === 'active'){
            let flag = false;
            for(let j=0; j<allStudents[i].courses.length; j++){
                if(allStudents[i].courses[j].course === currentCourse.course._id){
                    // console.log(allStudents[i].courses[j]._id, currentCourse.course._id);
                    // console.log("\n");
                    flag = true;
                }
            }
            if(!flag){
                addStudentsList.push(allStudents[i]);
            }
        }
    }
    async function AddStudent(studentId){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': teacher__token,
                },
            });
            const all__courses = await instance.post(backend_url + `/teacher/course/addStudent`, {teacherId: teacherId, email: teacher__email, courseId: currentCourse.course._id, studentId: studentId});
            console.log(all__courses);
            if(all__courses.status === 200){
                alert(all__courses.data.message);
            }
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }

    useEffect(() => {
        getStudents();
    }, [])

  return (
    <div>
        {
            // map the all students and show the names of the students and an add button to add them in the course
            addStudentsList?.map((item,index)=>(
                <div key={index} className='flex justify-between w-11/12 mx-auto items-center mt-4 mb-3 border-[1px] border-[#6b7780]'>
                    <div className='flex items-center px-2 py-2'>
                        <div className='w-5 h-5 text-sm font-sans rounded-full flex justify-center items-center text-white mr-4 font-bold sm:text-xs' style={{backgroundImage: "linear-gradient(to right top, #7633b7, #7739c7, #7640d9, #7347ea, #6e4ffc)"}}>{index+1}</div>
                        <div className='flex items-center gap-8'>
                            <p className='text-lg font-semibold sm:text-sm'>{item.name}</p>
                            <p className='text-sm text-gray-500'>{item.email}</p>
                        </div>
                    </div>
                    <div className='pr-2'>
                        <button className='bg-[#FFF44F] px-2 py-1 rounded-sm font-semibold sm:hidden' onClick={() => AddStudent(item._id)}>Add</button>
                        <button className='bg-[#FFF44F] px-2 py-1 rounded-sm font-semibold hidden sm:block w-8 h-8 rounded-full' onClick={() => AddStudent(item._id)}>+</button>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default AddStudentToCourse