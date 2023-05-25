import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { backend_url } from '../../BackendRoutes';
import LandingHeader from './LandingHeader'
import './LandingPage.css'

function SignupOption() {
    const navigate = useNavigate();

    async function checkForUniversitySignup() {
        const unv__id = localStorage.getItem('university__id');
        const token = localStorage.getItem('signup_token');
        const email = localStorage.getItem('university__email');
        if (token) {
            try {
                const instance = axios.create({
                    headers: {
                        'x-auth-token': token
                    }
                })
                const universityDetails = await instance.post(backend_url + '/university/details', {universityId: unv__id, email: email});
                console.log(universityDetails);
                if (universityDetails.data.universityDetails.isdeleted === false) {
                    navigate('/university/dashboard');
                }
                else {
                    alert("Something went wrong. Please try again");
                }
            } catch (err) {
                console.log(err);
                alert("Something went wrong");
                localStorage.removeItem('signup_token');
                navigate('/university/signup');
            }
        }
        else {
            navigate('/university/signup');
        }
    }

    async function checkForSignup() {
        const token = localStorage.getItem('teacher__token');
        const teacher__id = localStorage.getItem('teacher__id');
        const teacher__email = localStorage.getItem('teacher__email');
        if (token) {
            try {
                const instance = axios.create({
                    headers: {
                        'x-auth-token': token,
                    }
                });
                const res = await instance.post(backend_url + '/teacher/data', { teacherId: teacher__id, email: teacher__email });
                console.log("15", res.data.status);
                if (res.data.status === "active") {
                    navigate('/teacher/dashboard');
                }
                else {
                    navigate('/teacher/status');
                }
            } catch (err) {
                console.log(err);
                alert("Something went wrong");
                localStorage.removeItem('teacher__token');
                navigate('/teacher/signup');
            }
        }
        else {
            navigate('/teacher/signup');
        }
    }

    async function checkForStudentSignup() {
        console.log("Check??")
        const student__token = localStorage.getItem('student__token');
        const student__id = localStorage.getItem('student__id');
        const student__email = localStorage.getItem('student__email');
        if (student__token) {
            try {
                const instance = axios.create({
                    headers: {
                        'x-auth-token': student__token,
                    }
                });

                console.log(student__token, instance);
                const res = await instance.post(backend_url + '/student/data', { studentId: student__id, email: student__email, message: 'I am hrtr' });
                console.log("15", res.data.status);
                if (res.data.status === "active") {
                    navigate('/student/dashboard');
                }
                else {
                    navigate('/student/status');
                }
            } catch (error) {
                console.log(error);
                alert("Something went wrong");
                navigate('/student/signup');
            }
        }
        else {
            navigate('/student/signup');
        }
    }

    return (
        <div>
            <LandingHeader />
            <div className="signupOption_body relative md:pb-20" style={{ minHeight: "90vh", backgroundColor: "#f7f7f7" }}>
                <img className='absolute bottom-0 z-0 md:hidden' src="wave.svg" alt="" />
                <img className='absolute bottom-0 rotate-360 z-0 opacity-80 md:hidden' src="wave_2.svg" alt="" />
                <h1 className='flex justify-center text-2xl font-semibold py-4'>Sign up as a - </h1>
                <div className="signup_options flex justify-center gap-28 pt-10 z-50 md:flex-col md:items-center ">
                    <div className="as_teacher relative shadow-xl rounded-full w-64 h-64 bg-white z-20 hover:shadow-2xl cursor-pointer" onClick={() => {
                        checkForUniversitySignup();
                    }}>
                        <img className='w-full h-full' src="unv.svg" alt="" />
                        <p className='flex justify-center pt-4 text-2xl font-semibold'>University</p>
                    </div>
                    <div className="as_teacher relative shadow-xl rounded-full w-64 h-64 bg-white z-20 hover:shadow-2xl cursor-pointer" onClick={() => {
                        checkForSignup();
                    }}>
                        <img className='w-full h-full' src="teacher.svg" alt="" />
                        <p className='flex justify-center pt-4 text-2xl font-semibold'>Teacher</p>
                    </div>
                    <div className="as_student relative shadow-xl rounded-full w-64 h-64 bg-white z-20 hover:shadow-2xl cursor-pointer" onClick={() => {
                        checkForStudentSignup();
                    }}>
                        <img className='w-full h-full' src="student.svg" alt="" />
                        <p className='flex justify-center pt-4 text-2xl font-semibold'>Student</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupOption