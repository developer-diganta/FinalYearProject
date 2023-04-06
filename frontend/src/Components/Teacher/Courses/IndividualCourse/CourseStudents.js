import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { backend_url } from '../../../../BackendRoutes';

function CourseStudents({currentCourse}) {
    const[allStudents, setAllStudents] = useState([]);
    console.log(currentCourse);
    const teacher__token = localStorage.getItem('teacher__token');
    const teacher__email = localStorage.getItem('teacher__email');

    async function getStudents(){
        try {
          const instance = axios.create({
            headers: {
              'x-auth-token': teacher__token
            }
          });
    
          console.log("jgfwjegfkw", currentCourse.course.university);
          const res = await axios.post(backend_url + '/teacher/university/student', {universityId: currentCourse.course.university});
          console.log(res);
          setAllStudents(res.data);
        } catch (error) {
          console.log(error);
          alert("Something went wrong");
          if(error.response.status === 401){
            // navigate('/teacher/login');
          }
        }
      }
  
      
      let addStudentsList = [];
      for(let i=0; i<allStudents.length; i++){
          let flag = false;
        //   console.log(allStudents[i]);
          for(let j=0; j<allStudents[i].courses.length; j++){
              if(allStudents[i].courses[j].course === currentCourse.course._id){
                //   console.log(allStudents[i].courses[j]._id, currentCourse.course._id);
                //   console.log("\n");
                  flag = true;
                }
            }
            if(flag){
                addStudentsList.push(allStudents[i]);
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
                <div key={index} className='flex justify-between w-11/12 mx-auto items-center mt-4 mb-3 border-[1px] border-[#6b7780] rounded-full'>
                    <div className='flex items-center px-2 py-2'>
                        <div className='w-8 h-8 rounded-full flex justify-center items-center text-white mr-4 font-bold sm:text-sm sm:w-6 sm:h-6' style={{backgroundImage: "linear-gradient(to right top, #7633b7, #7739c7, #7640d9, #7347ea, #6e4ffc)"}}>{index+1}</div>
                        <div className='flex items-center gap-8'>
                            <p className='text-lg font-semibold sm:text-sm'>{item.name}</p>
                            <p className='text-sm text-gray-500 sm:text-xs'>{item.email}</p>
                        </div>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default CourseStudents