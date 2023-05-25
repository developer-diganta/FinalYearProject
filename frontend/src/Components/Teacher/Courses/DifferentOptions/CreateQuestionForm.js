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
    const[questionTitle, setQuestionTitle] = useState();
    const[questionDescription, setQuestionDescription] = useState();
    const[questionDifficulty, setQuestionDifficulty] = useState();
    const[inputFile, setInputFile] = useState();
    const[outputFile, setOutputFile] = useState();
    const[sampleInput, setsampleInput] = useState();
    const[sampleOutput, setsampleOutput] = useState();
    const[tags, setTags] = useState([]);
    const teacherToken = localStorage.getItem('teacher__token');
    const teacherId = localStorage.getItem('teacher__id');
    const location = useLocation();
    const navigate = useNavigate();
    const[base64In, setBase64In] = useState(null);
    const[base64Out, setBase64Out] = useState(null);

    function submitValue(e){
        const value = e.target.value;
        if(e.target.checked){
            setTags([...tags, value]);
        }else{
            setTags(tags.filter((tag) => tag !== value));
        }
    }

    async function getFormDetail(e){
        e.preventDefault();
        console.log(inputFile, base64In);
        console.log(outputFile, base64Out);
        // console.log(questionTitle, questionDescription, questionDifficulty, inputFile, outputFile, tags);

        const instance = axios.create({
            headers: {
                'x-auth-token': teacherToken,
            },
        });
        const question__create__response = await instance.post(backend_url + '/teacher/course/addQuestion', {
            courseId: location.state._id,
            universityId: location.state.university,
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
        });
        console.log(question__create__response);
        if(question__create__response.data.message === 'Question added successfully'){
            // alert('Question added successfully');
            alert('Question added successfully');
            navigate('/teacher/dashboard');
        }
    }

    return (
        <div className='create__question__form flex md:block'>
            <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
                <SidebarTEacher />
            </div>
            <div className={`dashboard_1 bg-[#F6F6F6] px-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
                <form className='flex flex-col bg-white w-4/5 py-8 px-6 rounded-md shadow-lg mt-4 mb-10 mx-auto' action="" onSubmit={getFormDetail}>
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold'>Question Title</p>
                    <input className='question__title' type="text" onChange={(event) => setQuestionTitle(event.target.value)} />
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Question Description</p>
                    <textarea className='question__description' style={{whiteSpace: 'pre-line'}} type="text" onChange={(event) => setQuestionDescription(event.target.value)} />
                    {/* create select for easy, medium and hard */}
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Question Difficulty</p>
                    <select name="" id="" onChange={(event) => setQuestionDifficulty(event.target.value)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <div className='inout flex justify-between'>
                        <div>
                            <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Input File</p>
                            <input className='input__file' type="file" onChange={(event) => {
                                setInputFile(event.target.files[0])
                                const reader = new FileReader();
                                reader.readAsDataURL(event.target.files[0]);
                                reader.onload = () => {
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
                    <div className='sample__inout flex justify-between'>
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
                    {/* checkbox for tags of question */}
                    <p className='pb-2 capitalize text-[#444d5c] font-semibold pt-8'>Tags</p>
                    <div className='tags__checkbox grid grid-cols-3'>
                        <div className='form_check'>
                            <input value={'array'} type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Array</label>
                        </div>
                        <div className='form_check'>
                            <input value={'string'} type="checkbox" onChange={submitValue} />
                            <label htmlFor="">String</label>
                        </div>
                        <div className='form_check'>
                            <input value={'linkedlist'} type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Linked List</label>
                        </div>
                        <div className='form_check'>
                            <input value='stack' type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Stack</label>
                        </div>
                        <div className='form_check'>
                            <input value='queue' type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Queue</label>
                        </div>
                        <div className='form_check'>
                            <input value='tree' type="checkbox" onChange={submitValue} />
                            <label htmlFor="">Tree</label>
                        </div>
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CreateQuestionForm