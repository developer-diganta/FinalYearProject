import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../../BackendRoutes';
import SidebarTEacher from '../Sidebar/SidebarTEacher';
import './Courses.css';

function CourseCreateForm() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const[name, setName] = useState();
    const[description, setDescription] = useState();
    const[courseType, setCourseType] = useState();
    const[startDate, setStartDate] = useState();
    const[endDate, setEndDate] = useState();
    const[compilers, setCompilers] = useState([]);
    const[department, setDepartment] = useState();
    const[school, setSchool] = useState();
    const[Programme, setProgramme] = useState();
    const token = localStorage.getItem('signup_token');
    const unv__id = localStorage.getItem('university__id');
    const navigate = useNavigate();

    async function setNewCourse(event){
        event.preventDefault();
        console.log(name, description, courseType, startDate, endDate, compilers);
        const date1 = new Date(startDate);
        const date2 = new Date(endDate);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const course__duration = diffDays;
        const instance = axios.create({
            headers: {
              'x-auth-token': token,
            },
        });
        const new__course = await instance.post(backend_url + '/university/course/add', {
        universityId: unv__id,
        name: name,
        description: description,
        courseCode: "abcd",
        courseType: courseType,
        expectedCourseDuration: course__duration,
        courseCompilers: compilers,
        courseStartDate: startDate,
        });
        console.log(new__course);
        if(new__course.data.message === "Course added successfully"){
            console.log("course added successfully");
            navigate('/university/courses');
        }
        else{
            alert("something went wrong");
        }
    }

    function addCompilers(comp){
        // find comp in compilers array
        if(!compilers.includes(comp)){
            setCompilers([...compilers, comp]);
        }
    }

  return (
    <div className='course__create__form flex'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`pt-4 pl-6 ml-1/5 flex justify-center bg-[#f3f4f6] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen`} style={{float: "right", overflow: "scroll"}}>
            <form className="course__form flex flex-col bg-white w-4/5 py-8 px-6 rounded-md shadow-lg" onSubmit={setNewCourse}>
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Course name</p>
                <input className='course__name mb-8 shadow-sm' type="text" onChange={(event) => setName(event.target.value)} />
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Course description</p>
                <textarea className='course__description mb-8 h-28 shadow-sm' type="text" onChange={(event) => setDescription(event.target.value)} />
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>course type</p>
                <input className='course__type mb-8 shadow-sm' type="text" onChange={(event) => setCourseType(event.target.value)} />
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Schools</p>
                <select className='course__school mb-8 shadow-sm' type="text" onChange={(event) => setSchool(event.target.value)}>
                    <option value="cse">CSE</option>
                    <option value="ece">ECE</option>
                    <option value="eee">EEE</option>
                    <option value="mech">MECH</option>
                    <option value="civil">CIVIL</option>
                </select>
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Department</p>
                <select className='course__department mb-8 shadow-sm' type="text" onChange={(event) => setDepartment(event.target.value)}>
                    <option value="cse">CSE</option>
                    <option value="ece">ECE</option>
                    <option value="eee">EEE</option>
                    <option value="mech">MECH</option>
                    <option value="civil">CIVIL</option>
                </select>
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Programme</p>
                <select className='course__department mb-8 shadow-sm' type="text" onChange={(event) => setProgramme(event.target.value)}>
                    <option value="cse">CSE</option>
                    <option value="ece">ECE</option>
                    <option value="eee">EEE</option>
                    <option value="mech">MECH</option>
                    <option value="civil">CIVIL</option>
                </select>
                <div className="date__ares flex mb-8 gap-10">
                    <div>
                        <p className='pb-2 capitalize text-[#444d5c] font-semibold'>start</p>
                        <input className='start__date shadow-sm' type="date" onChange={(event) => setStartDate(event.target.value)} />
                    </div>
                    <div>
                        <p className='pb-2 capitalize text-[#444d5c] font-semibold'>end</p>
                        <input className='end__date shadow-sm' type="date" onChange={(event) => setEndDate(event.target.value)} />
                    </div>
                </div>
                <p className='compiler__option pb-2 capitalize text[#444d5c] font-semibold'>compilers</p>
                <div className="course__compiler flex gap-8">
                    <div className="compilers cpp font-semibold text-[#444d5c]" id='cpp' onClick={() => {
                        addCompilers('cpp')
                        document.getElementById('cpp').style.backgroundColor = '#9900ff';
                        document.getElementById('cpp').style.color = '#FFF';
                        }}>cpp</div>
                    <div className="compilers python font-semibold text-[#444d5c]" id='python' onClick={() => {
                        addCompilers('python')
                        document.getElementById('python').style.backgroundColor = '#9900ff';
                        document.getElementById('python').style.color = '#FFF';
                        }}>python</div>
                    <div className="compilers java font-semibold text-[#444d5c]" id='java' onClick={() => {
                        addCompilers('java')
                        document.getElementById('java').style.backgroundColor = '#9900ff';
                        document.getElementById('java').style.color = '#FFF';
                        }}>java</div>
                    <div className="compilers javascript font-semibold text-[#444d5c]" id='javascript' onClick={() => {
                        addCompilers('javascript')
                        document.getElementById('javascript').style.backgroundColor = '#9900ff';
                        document.getElementById('javascript').style.color = '#FFF';
                        }}>javascript</div>
                </div>
                <button type='submit' className='bg-[#2d3142] text-white py-2 px-8 mt-16 text-lg font-semibold w-32 mx-auto'>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default CourseCreateForm