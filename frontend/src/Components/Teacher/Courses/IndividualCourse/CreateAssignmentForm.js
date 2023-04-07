import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { CgChevronDoubleRight } from 'react-icons/cg';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../../../BackendRoutes';
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
// import './Courses.css';

function CreateAssignmentForm() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const[name, setName] = useState();
    const[description, setDescription] = useState();
    const[universityId, setUniversityId] = useState();
    const teacther__id = localStorage.getItem('teacher__id');
    const teacher__token = localStorage.getItem('teacher__token');
    const teacher__email = localStorage.getItem('teacher__email');
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);

    async function setNewCourse(event){
        event.preventDefault();
        console.log(name, description);
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': teacher__token
                }
            });
            const new__course = await instance.post(backend_url + '/teacher/assignment/add', {
            universityId: universityId,
            name: name,
            description: description,
            email: teacher__email,
            courseId: location.state.course._id
            });
            console.log(new__course);
            if(new__course.status === 200){
                alert("course created successfully");
                navigate('/teacher/courses');
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
                navigate('/teacher/courses/createassignment');
            }
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
        const {university} = teacher__data.data;
        setUniversityId(university);
    }

    useEffect(() => {
        setAllDetails();
    }, [])

  return (
    <div className='assignment__create__form flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='st__map font-sans flex py-2 pl-4 bg-[#F6F7F7] items-center gap-2 text-sm'>
                <p className='cursor-pointer hover:text-[#763dfe] hover:underline'>Courses</p>
                <CgChevronDoubleRight />
                <p>{location.state.course.name}</p>
            </div>
            <form className="course__form mt-8 flex flex-col bg-white h-auto w-4/5 sm:w-11/12 py-8 px-6 rounded-md shadow-xl mx-auto my-auto" onSubmit={setNewCourse}>
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Assignment name</p>
                <input className='course__name mb-8 shadow-sm' type="text" onChange={(event) => setName(event.target.value)} />
                <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Assignment description</p>
                <textarea className='course__description mb-8 h-28 shadow-sm' type="text" onChange={(event) => setDescription(event.target.value)} />
                <button type='submit' className='bg-[#2d3142] text-white py-2 px-8 mt-16 text-lg font-semibold w-32 mx-auto'>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default CreateAssignmentForm