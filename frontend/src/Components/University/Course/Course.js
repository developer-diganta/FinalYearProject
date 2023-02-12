import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { backend_url } from '../../../BackendRoutes';
import Sidebaruniversity from '../Sidebaruniversity/Sidebaruniversity';

function Course() {
    // get the course name from the url
    const{courseId} = useParams();
    const token = localStorage.getItem('signup_token');
    const unv__id = localStorage.getItem('university__id');
    const[teachet, setTeacher] = useState([]);
    const[selecttedTeacher, setSelectedTeacher] = useState();

    const arr = [1, 2, 3, 4, 5, 6, 7, 8];

    const { openClose, unvSign } = useSelector((state) => state.counter);
    async function getAllAcceptedTeachers(){
      const instance = axios.create({
        headers: {
          'x-auth-token': token,
        },
      });
      const accepted__teachers = await instance.post(backend_url + '/university/teacher', {universityId: unv__id});
      console.log("acceptedTeachers", accepted__teachers);
      setTeacher(accepted__teachers.data);
    }
    
    async function getCourseDetails(){
      const instance = axios.create({
        headers: {
          'x-auth-token': token,
        },
      });
          console.log("courseId.", courseId);
      const course__data = await instance.post(backend_url + '/university/course/details', {courseId: courseId,  universityId: unv__id});
      console.log("acceptedTeachers", course__data);
      // setTeacher(course__data.data);
    }

    async function assignTeacherToCourse(){
        const instance = axios.create({
          headers: {
            'x-auth-token': token,
          },
        });
        const new__course__add__teacher = await instance.post(backend_url + '/university/course/add/teacher', {
            universityId: unv__id,
            courseId: courseId,
            teacherId: selecttedTeacher,
        })
        console.log(new__course__add__teacher);
        if(new__course__add__teacher.data.message === "Course added successfully"){
        }
    }


    
    useEffect(() => {
      getAllAcceptedTeachers();
      getCourseDetails();
    }, [])

  return (
    <div className='flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <Sidebaruniversity />
      </div>
      <div className={`pt-4 pl-6 bg-[#f8f9fa] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen`} style={{float: "right"}}>
          <div className="select__teachers mb-8">
              <p className='pb-4 capitalize text-[#444d5c] font-semibold'>select teacher</p>
              {/* cretae a selecter for teachers */}
              <select className='select__teacher shadow-sm w-full py-2 h-10' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} onChange={(event) => setSelectedTeacher(event.target.value)}>
                  <option value="0">select teacher</option>
                  {teachet.map((teacher) => (
                      <option value={teacher._id}>{teacher.name}</option>
                  ))}
              </select>
          </div>
          <button className='bg-[#D9CFEF] py-2 px-4 rounded-sm text-sm' style={{fontFamily: "sans-serif", letterSpacing: "1px"}} onClick={() => {
            assignTeacherToCourse();
          }}>Set Teacher</button>
          <div className="student__add">
            <p className='pb-4 pt-10 capitalize text-[#444d5c] font-semibold'>Add Students</p>
            <div className="students__options bg-white shadow-xl px-8 py-4 h-48 rounded-md" style={{overflowY: "scroll", border: "1px solid #D7D6D9"}}>
                
                {
                  arr.map((ele) => {
                    return (
                      <div className="student__option flex justify-between px-4 py-1 my-2 bg-[#F4F1F9]" 
                      // style={{border: "1px solid red"}}
                      >
                          <p className="name">name</p>
                          <p className="email">email</p>
                          <p className="roll">role</p>
                          <input style={{width: "20px"}} value={ele} type="checkbox" />
                      </div>
                    )
                  })
                }
            </div>
            <button className='bg-[#D9CFEF] py-2 px-4 rounded-sm text-sm my-8' style={{fontFamily: "sans-serif", letterSpacing: "1px"}} onClick={() => {
            // assignTeacherToCourse();
          }}>Add Students</button>
          </div>
      </div>
    </div>
  )
}

export default Course