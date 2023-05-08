import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backend_url } from '../../../../BackendRoutes';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SidebarStudent from '../../Sidebar/SidebarStudent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Codemirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function StudentAnalysis() {
    const[data, setData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Dataset 1',
            data: [{x: 'Sales', y: 20}, {x: 'Revenue', y: 10}],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
    })
    const[submissions, setSubmissions] = useState([]);
    const[allLanguages, setAllLanguages] = useState();
    const[code1, setCode1] = useState();
    const[showCode, setShowCode] = useState(false);

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Student acceptance',
          },
        },
      };
    const student__token = localStorage.getItem('student__token');
    const student__id = localStorage.getItem('student__id');
    const student__email = localStorage.getItem('student__email');
    const university = localStorage.getItem('university');

    const navigate = useNavigate();

    const { openClose, unvSign } = useSelector((state) => state.counter);

    const location = useLocation();
    console.log(location);

    async function getQuestionDetail(){
        const instance = axios.create({
            headers: {
                'x-auth-token': student__token
            }
        })
        const response = await instance.post(backend_url + '/student/question/allAnalysis', {studentId: student__id, questionId: location.state._id});
        console.log(response);
        let submissionAccuricy = [];
        let allSub = response.data.allSubmissions;
        console.log(allSub, typeof(allSub));
        let myIndex = 0;
        for(let student in allSub){
            let studentArray = allSub[student];
            let correct = 0;
            let total = studentArray.length;
            for(let j=0; j<studentArray.length; j++){
                if(studentArray[j].status === "3"){
                    correct++;
                }
            }
            let accuracy = Math.ceil((correct/total)*100);
            submissionAccuricy.push(accuracy);
            if(student === student__id){
                myIndex = submissionAccuricy.length;
                setSubmissions(allSub[student]);
                console.log(allSub[student]);
            }
        }

        let labels = [submissionAccuricy.length];
        
        const randomColor = []
        for(let i=0; i<submissionAccuricy.length; i++){
            if(i === myIndex-1){
                labels[i] = 'you: ' + submissionAccuricy[i] + ' %';
                randomColor.push('#fd8e45ff');
            }
            else{
                labels[i] = '';
                randomColor.push('#c266ff');
            }
        }

        
        let temp = {
            labels: labels,
            datasets: [
              {
                label: 'Dataset 1',
                data: submissionAccuricy,
                backgroundColor: randomColor,
              },
            ],
        }
        console.log(temp);
        setData(temp);
    }

    function formateDate(inputDate){
        const date = new Date(inputDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        
        const hours = "00";
        const minutes = "00";
        const seconds = String(date.getSeconds()).padStart(2, "0");
        
        const outputDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return outputDate;
    }

    function getTheLanguage(languageId){
        for(let i=0; i<allLanguages.length; i++){
            if(allLanguages[i].id === languageId){
                return allLanguages[i].name;
            }
        }
    }

    async function getAllLanguages(){
        const res = await axios.post(backend_url + '/languages');
        console.log(res.data);
        setAllLanguages(res.data);
    }

    function getStatus(number){
        if(number === '3'){
            return 'correct';
        }
        else if(number === '4'){
            return 'wrong answer';
        }
        else{
            return 'compile error';
        }
    }

    
    function getCode(code){
        console.log(typeof(code));
        setCode1(code);
    }

    useEffect(() => {
        getQuestionDetail();
        getAllLanguages();
    }, [])

  return (
    <div className='current__courses flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarStudent />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='w-4/6 mx-auto'>
                <Bar options={options} data={data} />
            </div>
            <div>
            <div className='py-4 gap-2 px-4 flex items-start'>
                <p className='text-sm text-[#6b7780ff]'>Question: </p>
                <p className='text-[#1890ff] text-lg' >{location.state.title}</p>
            </div>
            <div className="submissions flex">
                <div className='w-11/12'>
                    <div className='px-4'>
                        <table className='border-[1px] border-[#dededf] my-4 rounded-lg'>
                            <thead className={`${submissions.length <= 0 ? 'hidden' : 'block'} bg-[#f9fafb] border-b-[1px] border-b-[#dededf] w-full`}>
                                {
                                    console.log("**************.", submissions, submissions.length)
                                }
                                <tr className='text-[#555555]'>
                                    <th className='w-1/4'>Time</th>
                                    <th className='w-1/4'>Lang</th>
                                    <th className='w-1/4'>Status</th>
                                    <th className='w-1/4'>Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions?.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td className='w-1/4 text-center py-1 text-sm'>{formateDate(row.dateCreated)}</td>
                                        <td className='w-1/4 text-center py-1 text-xs'>{getTheLanguage(row.language)}</td>
                                        <td className={`w-1/4 text-center py-1 text-xs ${getStatus(row.status) === 'correct' ? 'text-success' : 'text-[red]'}`}>{getStatus(row.status)}</td>
                                        <td className='w-1/4 text-center py-1 text-sm text-[#5f9ad2] cursor-pointer'
                                            onClick={() => {
                                                getCode(row.code)
                                                setShowCode(true)
                                            }}                        
                                        >code</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <div className={`absolute w-[100vw] ${showCode ? 'flex' : 'hidden'} flex-col items-center justify-center z-[999] h-[100vh]`} style={{backgroundColor: "rgba(0, 0, 0, 0.4)"}}>
            <div className='bg-[#cdcbcdff] w-[70vw] px-4 font-bold py-1' onClick={() => setShowCode(false)}>Close</div>
            <Codemirror
                value={code1 ? code1 : ''}
                spellCheck={true}
                autoCorrect={true}
                placeholder="Type here..."
                height='60vh'
                width='70vw'
                style={{ fontSize: "14px", borderRadius: "20px", backgroundColor: 'black' }}
                theme={dracula}
                onChange={(editor, data, value) => {
                // setCode(editor);
                }
                }
            />
        </div>
    </div>
  )
}

export default StudentAnalysis