import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import SidebarTEacher from '../../Sidebar/SidebarTEacher';
import './Submission.css';
import axios from 'axios';
import { backend_url } from '../../../../BackendRoutes';

function IndividualStudentAnalysis() {
    const[allLanguages, setAllLanguages] = useState([]);
    const { openClose } = useSelector((state) => state.counter);
    const location = useLocation();
    console.log(location)

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

    async function getAllLanguages(){
        const res = await axios.post(backend_url + '/languages');
        console.log(res.data);
        setAllLanguages(res.data);
    }

    useEffect(() => {
        getAllLanguages();
    }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <SidebarTEacher />
        </div>
        <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro SC', 'SF Pro Text', 'PingFang SC', 'Arial', 'Hiragino Sans GB', 'Heiti SC', 'Microsoft Yahei', sans-serif", color: "#212121"}}>
            <div className='flex items-center pl-4 my-2 gap-4'>
                <div className='subm py-4 px-4 text-white text-lg uppercase font-semibold rounded-sm' style={{letterSpacing: "2px"}}>
                    submission details
                </div>
                <div className='text-[#6b7780ff]' style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'", letterSpacing: "2px"}}>
                    <div className='flex gap-4'>
                        <p>Name - </p>
                        <p className='font-semibold'>{location.state.student.name}</p>
                    </div>
                    <div className='flex gap-4'>
                        <p>Email - </p>
                        <p className='font-semibold'>{location.state.student.email}</p>
                    </div>
                </div>
            </div>
            <div className='divider bg-divider min-h-[1px] min-w-[100%] max-w-[100%]'></div>
            <div className="submissions">
                <table className='mx-auto border-[1px] border-[#dededf] my-4 rounded-lg'>
                    <thead className='bg-[#f9fafb] border-b-[1px] border-b-[#dededf]'>
                        <tr className='text-[#555555]'>
                            <th className='w-1/4'>Time</th>
                            <th className='w-1/4'>Lang</th>
                            <th className='w-1/4'>Status</th>
                            <th className='w-1/4'>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {location.state.submissions.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className='w-1/4 text-center py-1 text-sm'>{formateDate(row.dateCreated)}</td>
                            <td className='w-1/4 text-center py-1 text-sm'>{getTheLanguage(row.language)}</td>
                            <td className={`w-1/4 text-center py-1 text-sm ${getStatus(row.status) === 'correct' ? 'text-success' : 'text-[red]'}`}>{getStatus(row.status)}</td>
                            <td className='w-1/4 text-center py-1 text-sm text-[#5f9ad2] cursor-pointer'>detail</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default IndividualStudentAnalysis