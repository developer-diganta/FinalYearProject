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
    const[courseCode, setCourseCode] = useState();
    const[courseType, setCourseType] = useState();
    const[startDate, setStartDate] = useState();
    const[endDate, setEndDate] = useState();
    const[compilers, setCompilers] = useState([]);
    const[department, setDepartment] = useState();
    const[school, setSchool] = useState();
    const[Programme, setProgramme] = useState();
    const[universityId, setUniversityId] = useState();
    const teacther__id = localStorage.getItem('teacher__id');
    const teacher__token = localStorage.getItem('teacher__token');
    const teacher__email = localStorage.getItem('teacher__email');
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
              'x-auth-token': teacher__token,
            },
        });
        console.log(date1.toISOString(date1));
        // make the date1 in this format 2021-05-01T00:00:00.000Z

        if(courseType === "public"){
            try {
                const response = await instance.post(backend_url + '/moocs/add', {
                    universityId: universityId,
                    teacherId: teacther__id,
                    programId: Programme,
                    name: name,
                    description: description,
                    courseCode: courseCode,
                    courseType: courseType,
                    expectedCourseDuration: course__duration,
                    courseCompilers: compilers,
                    courseStartDate: date1.toISOString(),
                    approvalStatus: true
                });
                console.log(response);
                alert(response.data.message);
            } catch (error) {
                console.log(error);
                if(error.response.status === 401){
                    alert("please login again");
                    localStorage.removeItem('teacher__token');
                    navigate('/teacher/login');
                }
                else{
                    alert(error.response.data.message + ". please try again");
                    navigate('/teacher/cretatecourse');
                }
            }
        }
        else{
            try {
                const new__course = await instance.post(backend_url + '/teacher/course/add', {
                universityId: universityId,
                name: name,
                description: description,
                courseCode: courseCode,
                courseType: courseType,
                expectedCourseDuration: course__duration,
                courseCompilers: compilers,
                courseStartDate: date1.toISOString(),
                programId: Programme,
                teacherId: teacther__id,
                email: teacher__email,
                });
                console.log(new__course);
                if(new__course.data.message === "Course added successfully"){
                    console.log("course added successfully");
                    navigate('/teacher/courses');
                }
                else{
                    alert("something went wrong. please try again.");
                }
            
            } catch (error) {
                console.log(error);
                if(error.response.status === 401){
                    alert("please login again");
                    localStorage.removeItem('teacher__token');
                    navigate('/teacher/login');
                }
                else{
                    alert(error.response.data.message + ". please try again");
                    navigate('/teacher/cretatecourse');
                }
            }
        }
    }

    function addCompilers(comp){
        // find comp in compilers array
        if(!compilers.includes(comp)){
            setCompilers([...compilers, comp]);
        }
    }

    async function setAllDetails(){
        let teacher__data;
        try {
            teacher__data = await axios.post(backend_url + '/teacher/data', {teacherId: teacther__id});
            console.log(teacher__data);
        } catch (error) {
            console.log(error);
        }
        let university__detail;
        const {university} = teacher__data.data;
        setUniversityId(university);
        try {
            university__detail = await axios.post(backend_url + '/university/details', {universityId: university});
            console.log(university__detail);
            let programArray = [];
            university__detail.data.universityDetails.schools.map((item) => item.departments.map((item) => item.programs.map((item) => programArray.push(item))));
            setDepartment(programArray);
            console.log(programArray);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setAllDetails();
    }, [])

  return (
    <div className='course__create__form flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`pt-4 pl-6 ml-1/5 flex justify-center sm:py-0 bg-[#f3f4f6] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-screen sm:px-0 sm:w-full sm:mx-0`} style={{float: "right"}}>
            <form className="course__form flex flex-col bg-white w-4/5 px-6 rounded-md shadow-lg sm:w-full sm:rounded-[0px] sm:text-sm" onSubmit={setNewCourse}>
                <h1 className='text-center py-4 text-lg font-bold'>Cerate new course</h1>
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Course name</p>
                <input className='course__name mb-8 shadow-sm' type="text" onChange={(event) => setName(event.target.value)} />
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Course description</p>
                <textarea className='course__description mb-8 h-28 shadow-sm' type="text" onChange={(event) => setDescription(event.target.value)} />
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>course type</p>
                {/* <input className='course__type mb-8 shadow-sm' type="text" onChange={(event) => setCourseType(event.target.value)} /> */}
                <select className='course__type mb-8 shadow-sm' type="text" onChange={(event) => setCourseType(event.target.value)}>
                    <option>Choose course type</option>
                    <option value="public">Public Course</option>
                    <option value="private">Private Course</option>
                </select>
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>course code</p>
                <input className='course__code mb-8 shadow-sm' type="text" onChange={(event) => setCourseCode(event.target.value)} />
                {/* <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Schools</p>
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
                </select> */}
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Programme</p>
                <select className='course__department mb-8 shadow-sm' type="text" onChange={(event) => setProgramme(event.target.value)}>
                    <option value="">Choose programme</option>
                    {
                        department?.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))
                    }
                </select>
                <div className="date__ares flex mb-8 gap-10 sm:flex-col">
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
                <div className="course__compiler flex gap-8 sm:grid sm:grid-cols-2 sm:gap-x-14">
                    <div className="compilers cpp font-semibold text-[#444d5c] sm:text-center" id='cpp' onClick={() => {
                        addCompilers('cpp')
                        document.getElementById('cpp').style.backgroundColor = '#9900ff';
                        document.getElementById('cpp').style.color = '#FFF';
                        }}>cpp</div>
                    <div className="compilers python font-semibold text-[#444d5c] sm:text-center" id='python' onClick={() => {
                        addCompilers('python')
                        document.getElementById('python').style.backgroundColor = '#9900ff';
                        document.getElementById('python').style.color = '#FFF';
                        }}>python</div>
                    <div className="compilers java font-semibold text-[#444d5c] sm:text-center" id='java' onClick={() => {
                        addCompilers('java')
                        document.getElementById('java').style.backgroundColor = '#9900ff';
                        document.getElementById('java').style.color = '#FFF';
                        }}>java</div>
                    <div className="compilers javascript font-semibold text-[#444d5c] sm:text-center" id='javascript' onClick={() => {
                        addCompilers('javascript')
                        document.getElementById('javascript').style.backgroundColor = '#9900ff';
                        document.getElementById('javascript').style.color = '#FFF';
                        }}>javascript</div>
                </div>
                <button type='submit' className='bg-[#2d3142] text-white py-2 px-8 mt-16 text-lg font-semibold w-32 mx-auto mb-4'>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default CourseCreateForm