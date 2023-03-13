import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { backend_url } from '../../../../BackendRoutes';
import './IndividualCourse.css';

function StudentsOfCourse() {
    const location = useLocation();
    console.log(location);
    async function getStudents(){
      try {
        // const instance = axios.create({
        //   headers: {
        //     'x-auth-token': university__token
        //   }
        // });
  
        console.log("jgfwjegfkw", backend_url);
        const res = await axios.post(backend_url + '/university/student', {universityId: location.state.course.university});
        console.log(res);
        // setStudents(res.data.filter((item,index)=>{
        //     return item.status === 'waitlist'
        // }));
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
        if(error.response.status === 401){
          // navigate('/university/login');
        }
      }
    }

    useEffect(() => {
        getStudents();
    }, [])

  return (
    <div>
        <p>StudentsOfCourse</p>
        <div class="bun">
        <div class="fill"></div>
        <div class="percent">75%</div>
        </div>
    </div>
  )
}

export default StudentsOfCourse