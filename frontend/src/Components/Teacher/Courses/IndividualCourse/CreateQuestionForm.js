import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../../../BackendRoutes';
import SidebarTEacher from '../../Sidebar/SidebarTEacher'
import '../Courses.css'
import { encode, decode } from 'base-64';

function CreateQuestionForm() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    const [questionTitle, setQuestionTitle] = useState();
    const [questionDescription, setQuestionDescription] = useState();
    const [questionDifficulty, setQuestionDifficulty] = useState();
    const [inputFile, setInputFile] = useState();
    const [outputFile, setOutputFile] = useState();
    const [sampleInput, setsampleInput] = useState();
    const [sampleOutput, setsampleOutput] = useState();
    const [tags, setTags] = useState([]);
    const [score, setScore] = useState();
    const teacherToken = localStorage.getItem('teacher__token');
    const teacherId = localStorage.getItem('teacher__id');
    const email = localStorage.getItem('teacher__email');
    const location = useLocation();
    const navigate = useNavigate();
    const [base64In, setBase64In] = useState(null);
    const [base64Out, setBase64Out] = useState(null);
    console.log(location);

    function submitValue(e) {
        const value = e.target.value;
        if (e.target.checked) {
            setTags([...tags, value]);
        } else {
            setTags(tags.filter((tag) => tag !== value));
        }
    }

    async function getFormDetail(e) {
        e.preventDefault();
        console.log(inputFile, base64In);
        console.log(outputFile, base64Out, questionDifficulty);
        // console.log(questionTitle, questionDescription, questionDifficulty, inputFile, outputFile, tags);
        if (location.state.course.courseType === "public") {
            try {
                const instance = axios.create({
                    headers: {
                        'x-auth-token': teacherToken,
                    },
                });
                const question__create__response = await instance.post(backend_url + '/moocs/teacher/add/question', {
                    moocId: location.state.course._id,
                    moocAssignmentId: location.state.assignment._id,
                    title: questionTitle,
                    question: questionDescription,
                    input: base64In,
                    output: base64Out,
                    sampleInput: sampleInput,
                    sampleOutput: sampleOutput,
                    difficulty: questionDifficulty,
                    category: 'coding',
                    tags: tags,
                    score: score
                });
                console.log(question__create__response);
                if (question__create__response.status === 200) {
                    // alert('Question added successfully');
                    alert('Question added successfully');
                    navigate('/teacher/courses/assignment/' + location.state.assignment.name, { state: location.state });
                }
            } catch (error) {
                console.log(error);
                alert('Something went wrong. Please try again.');
            }
        }
        else {
            try {
                const instance = axios.create({
                    headers: {
                        'x-auth-token': teacherToken,
                    },
                });
                const question__create__response = await instance.post(backend_url + '/teacher/assignment/addQuestion', {
                    courseId: location.state.course._id,
                    universityId: location.state.course.university,
                    assignmentId: location.state.assignment._id,
                    teacherId: teacherId,
                    title: questionTitle,
                    question: questionDescription,
                    input: base64In,
                    output: base64Out,
                    sampleInput: sampleInput,
                    sampleOutput: sampleOutput,
                    difficulty: questionDifficulty,
                    category: 'coding',
                    tags: tags,
                    datePublished: new Date(),
                    score: score,
                    email: email
                });
                console.log(question__create__response);
                if (question__create__response.status === 200) {
                    // alert('Question added successfully');
                    alert('Question added successfully');
                    navigate('/teacher/courses/assignment/' + location.state.assignment.name, { state: location.state });
                }
            } catch (error) {
                console.log(error);
                alert('Something went wrong. Please try again.');
            }
        }

    }

    return (
        <div className='create__question__form flex md:block'>
            <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
                <SidebarTEacher />
            </div>
            <div className={`dashboard_1 bg-[#F6F6F6] px-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen sm:px-0`} style={{ float: "right" }}>
                <div className="question__secondary__navbar flex items-center max-w-[95%] mx-auto my-4">
                    <div className='flex items-center cursor-pointer' style={{ color: "#6b7780" }} onClick={() => navigate('/teacher/courses/assignment/' + location.state.assignment.name, { state: location.state })}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                        </svg>
                        <p className='course__name__in__question pl-2' style={{ fontFamily: "Whitney SSm A,Whitney SSm B,Avenir,Segoe UI,Ubuntu,Helvetica Neue,Helvetica,Arial,sans-serif" }}>
                            back
                        </p>
                    </div>
                    <div className='mx-auto text-lg font-bold text-[#6b7780]'>Create Question</div>
                    {/* <div className='bg-[#6b7780] px-4 rounded-3xl cursor-pointer py-1 text-sm text-white flex items-center justify-center hover:border-2 hover:border-[#6b7780] hover:text-[#6b7780] hover:bg-white border-2 border-[#6b7780] duration-500' style={{fontFamily: "sans-serif", letterSpacing: "2px"}} 
              >Add Question <span className='text-lg pl-2'>+</span> </div> */}
                </div>
                <div className='divider bg-divider min-h-[1px] min-w-[90%] max-w-[95%] mx-auto'></div>

                <form className='flex flex-col bg-white w-4/5 py-8 px-6 rounded-md shadow-lg mt-4 mb-10 mx-auto sm:w-full' action="" onSubmit={getFormDetail}>
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Question Title</p>
                    <input className='question__title' type="text" onChange={(event) => setQuestionTitle(event.target.value)} />
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Question Description</p>
                    <textarea className='question__description' type="text" onChange={(event) => setQuestionDescription(event.target.value)} />
                    {/* create select for easy, medium and hard */}
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Question Difficulty</p>
                    <select name="" id="" onChange={(event) => {
                        console.log(event.target.value);
                        setQuestionDifficulty(event.target.value)
                    }}>
                        <option>Choose diffeculty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <div className='inout flex justify-between sm:flex-col'>
                        <div>
                            <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Input File</p>
                            <input className='input__file' type="file" onChange={(event) => {
                                setInputFile(event.target.files[0])
                                const reader = new FileReader();
                                reader.readAsDataURL(event.target.files[0]);
                                reader.onload = () => {
                                    console.log(reader.result);
                                    setBase64In(reader.result);
                                };
                            }} />
                        </div>
                        <div>
                            <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Output File</p>
                            <input className='output__file' type="file" onChange={(event) => {
                                setOutputFile(event.target.files[0])
                                const reader2 = new FileReader();
                                reader2.readAsDataURL(event.target.files[0]);
                                reader2.onload = () => {
                                    setBase64Out(reader2.result);
                                };
                            }} />
                        </div>
                    </div>
                    <div className='sample__inout flex justify-between sm:flex-col'>
                        <div>
                            <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Sample Input File</p>
                            <input className='input__file' type="file" onChange={(event) => {
                                // setInputFile(event.target.files[0])
                                const reader3 = new FileReader();
                                reader3.readAsDataURL(event.target.files[0]);
                                reader3.onload = () => {
                                    setsampleInput(reader3.result);
                                };
                            }} />
                        </div>
                        <div>
                            <p className='pb-2 capitalize text-[rgb(68,77,92)] font-semibold pt-8'>Sample Output File</p>
                            <input className='output__file' type="file" onChange={(event) => {
                                // setOutputFile(event.target.files[0])
                                const reader4 = new FileReader();
                                reader4.readAsDataURL(event.target.files[0]);
                                reader4.onload = () => {
                                    setsampleOutput(reader4.result);
                                };
                            }} />
                        </div>
                    </div>
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Score</p>
                    <input className='question__title' type="text" onChange={(event) => setScore(event.target.value)} />
                    {/* checkbox for tags of question */}
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Tags</p>
                    <div className='tags__checkbox grid grid-cols-3 sm:grid-cols-2'>
                        <div className='form_check sm:gap-2 flex items-center'>
                            <input value={'array'} type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Array</label>
                        </div>
                        <div className='form_check sm:gap-2 flex items-center'>
                            <input value={'string'} type="checkbox" onChange={submitValue} />
                            <label htmlFor="">String</label>
                        </div>
                        <div className='form_check sm:gap-2 flex items-center'>
                            <input value={'linkedlist'} type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Linked List</label>
                        </div>
                        <div className='form_check sm:gap-2 flex items-center'>
                            <input value='stack' type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Stack</label>
                        </div>
                        <div className='form_check sm:gap-2 flex items-center'>
                            <input value='queue' type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Queue</label>
                        </div>
                        <div className='form_check sm:gap-2 flex items-center'>
                            <input value='tree' type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Tree</label>
                        </div>
                    </div>
                    <button type='submit' className='bg-[#6b7780] rounded-lg w-32 py-1 text-base text-white font-semibold mt-4 mx-auto' style={{ letterSpacing: "1px" }}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CreateQuestionForm