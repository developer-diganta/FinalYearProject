import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
import { useEffect } from 'react';
import axios from 'axios';
import { backend_url } from '../../../../BackendRoutes';
import { useState } from 'react';
import Codemirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';

function IndividualSubmission() {
    const[question, setQuestion] = useState();
    const[review, setReview] = useState();
    const location = useLocation();
    console.log(location);
    const { openClose } = useSelector((state) => state.counter);
    const teacher__token = localStorage.getItem('teacher__token');
    const teacher__id = localStorage.getItem('teacher__id');
    const teacher__email = localStorage.getItem('teacher__email');
    const universityId = localStorage.getItem('university');
    const navigate = useNavigate();

    async function getIndividualSubmissionDetail(){
        try {
            const instance = axios.create(
                {
                    headers: {
                        'x-auth-token': teacher__token
                    }
                }
            )
            const response = await instance.post(backend_url + '/teacher/course/questionById', {questionId: location.state.submissions.question, email: teacher__email});
            console.log(response);
            setQuestion(response.data.question);
        } catch (error) {
            console.log(error);
            alert('something went wrong');
            if(error.response.status === 401){
                // localStorage.removeItem('teacher__token');
                navigate('/teacher/signup');
            }
        }
    }

    function getStatus(number){
        if(number === '3'){
            return 'correct';
        }
        else if(number === '4'){
            return 'wrong answer';
        }
        else{
            return 'pending';
        }
    }

    async function changePlag(){
        console.log("****");
        try {
            const instance = axios.create(
                {
                    headers: {
                        'x-auth-token': teacher__token
                    }
                }
            )
            const response = await instance.post(backend_url + '/teacher/analysis/student/submission/changePlagarism', {submissionId: location.state.submissions._id, plagValue: location.state.submissions.plagarized ? 0 : 1, email: teacher__email});
            console.log(response);
            alert(response.data.message);
            navigate('/teacher/dashboard');
        } catch (error) {
            console.log(error);
            alert('something went wrong');
            if(error.response.status === 401){
                // localStorage.removeItem('teacher__token');
                navigate('/teacher/signup');
            }
        }
    }

    async function submitReview(event){
        event.preventDefault();
        try {
            const instance = axios.create(
                {
                    headers: {
                        'x-auth-token': teacher__token
                    }
                }
            )
            const response = await instance.post(backend_url + '/teacher/analysis/student/submission/grade', {submissionId: location.state.submissions._id, review: review, email: teacher__email});
            console.log(response);
            alert(response.data.message);
        } catch (error) {
            console.log(error);
            alert('something went wrong');
            if(error.response.status === 401){
                // localStorage.removeItem('teacher__token');
                navigate('/teacher/signup');
            }
        }
    }

    useEffect(() => {
        getIndividualSubmissionDetail();
    }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro SC', 'SF Pro Text', 'PingFang SC', 'Arial', 'Hiragino Sans GB', 'Heiti SC', 'Microsoft Yahei', sans-serif", color: "#212121"}}>
            <div>
                <h1 className='text-[#1890ff] pt-4 px-4 text-xl font-base' style={{fontWeight: "400", letterSpacing: "1px"}}>{question ? question.title : null}</h1>
            </div>
            <div className={`submission__detail px-4 pt-6`}>
                <h4 className='text-lg font-semibold text-[#6b7780ff]'>Submission Detail</h4>
                <div className={`border-[1px] border-[#dcdcdcff] bg-white my-3 py-4 px-4 flex justify-between rounded-md ${location.state.submissions.plagarized ? 'shadow-lg shadow-[red]' : 'shadow-md shadow-[#a1efb2ff]'}`} style={{fontFamily: "sans-serif", letterSpacing: "1px"}}>
                    <div>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm'>Time: </p>
                            <p className='text-[#737373]'>{location.state.submissions.dateCreated}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm pt-2'>Language: </p>
                            <p className='pt-2 text-[#737373]'>{location.state.language}</p>
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm'>Status: </p>
                            <p className={`text-lg ${getStatus(location.state.submissions.status) === 'correct' ? 'text-success' : 'text-[red]'}`}>{getStatus(location.state.submissions.status)}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm'>Plagarised: </p>
                            <p className={`text-lg ${location.state.submissions.plagarized ? 'text-[red]' : 'text-[#737373]'}`}>{location.state.submissions.plagarized ? 'plagarized' : 'not plagarized'}</p>
                        </div>
                        <div className="change__plagarised__button mt-2">
                            <div className='bg-[#ff006a] text-center py-2 rounded-sm text-white cursor-pointer w-[90%]'
                                onClick={() => changePlag()}                       
                            >Change Plagarism</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="code__submittes">
                <h4 className='text-lg font-semibold text-[#6b7780ff] px-4 mt-6'>Code</h4>
                <div className='w-4/5 mx-4 my-3 rounded-lg'>
                    <Codemirror
                        value={location.state.submissions.code}
                        spellCheck={true}
                        autoCorrect={true}
                        placeholder="Type here..."
                        height='50vh'
                        style={{ fontSize: "14px", borderRadius: "20px" }}
                        theme={dracula}
                        onChange={(editor, data, value) => {
                        // setCode(editor);
                        }
                        }
                    />
                </div>
            </div>
            
            <div className='code__review pb-4'>
                <h4 className='text-lg font-semibold text-[#6b7780ff] px-4 mt-6'>Review</h4>
                <form className='mx-4 mt-2' action="" onClick={(event) => submitReview(event)}>
                    <textarea name="" id="" cols="30" rows="4" style={{width: "100%"}} onChange={(event) => setReview(event.target.value)}></textarea>
                    <button className='submit__review px-4 py-1 text-white rounded-sm mt-2' style={{letterSpacing: "1px"}}>Submit</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default IndividualSubmission