import React from 'react'
import '../TeacherProfile.js/TeacherProf.css'
import TeacherHeader from './TeacherHeader'
import Calendar from 'react-calendar'
import { useState } from 'react'
import './Pages.css'
import { useEffect } from 'react'
import { AiOutlineClose } from "react-icons/ai";

var activity = [
    {
        id: 1,
        title: 'Task 1',
        description: 'This is the description of the task 1',
        date: '2023-01-26',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 2,
        title: 'Task 2',
        description: 'This is the description of the task 2',
        date: '2023-01-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 3,
        title: 'Task 3',
        description: 'This is the description of the task 3',
        date: '2023-01-16',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 4,
        title: 'Task 4',
        description: 'This is the description of the task 4',
        date: '2023-01-04',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 5,
        title: 'Task 5',
        description: 'This is the description of the task 5',
        date: '2023-01-17',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 6,
        title: 'Task 6',
        description: 'This is the description of the task 6',
        date: '2022-09-05',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 7,
        title: 'Task 7',
        description: 'This is the description of the task 7',
        date: '2021-09-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 8,
        title: 'Task 8',
        description: 'This is the description of the task 8',
        date: '2021-09-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 9,
        title: 'Task 9',
        description: 'This is the description of the task 9',
        date: '2021-09-01',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 10,
        title: 'Task 10',
        description: 'This is the description of the task 10',
        // today date
        date: '2023-01-19',
        time: '10:00',
        status: 'pending'
    },
    {
        id: 11,
        title: 'Task 11',
        description: 'This is the description of the task 11',
        date: '2023-01-19',
        time: '10:00',
        status: 'pending'
    },
]

function Dashboard() {
    const[value, onChange] = useState(new Date());
    const[date, setDate] = useState('')
    const[dateClick, setDateClick] = useState(false)

    function getDayActivity(date) {
        // format date in yyyy-mm-dd format
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
        console.log(month.length);
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        console.log([year, month, day].join('-'));
        console.log(activity.filter(item => item.date == [year, month, day].join('-')));
        // console.log(tasks);
        setDate([year, month, day].join('-'));
    }

    useEffect(() => {
        var d = new Date();
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
        console.log(month.length);
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        console.log([year, month, day].join('-'));
        console.log(activity.filter(item => item.date == [year, month, day].join('-')));
        // console.log(tasks);
        setDate([year, month, day].join('-'));
    }, [])

  return (
    <div className='dashboard_1 bg-[#fbfbfb]'>
        <TeacherHeader />
        <div className='flex gap-2 mx-6 mt-10 '>
            <div className="calender w-2/4 rounded-lg shadow-2xl p-4">
                <Calendar onChange={onChange} value={value} 

                    // activeStartDate={new Date()}
                    allowPartialRange={true}
                    onClickDay={(value, event) => {
                        // console.log(value, event)
                        getDayActivity(value)
                        setDateClick(true)
                    }}
                />
            </div>
            <div className={`${dateClick ? 'task' : ''} w-2/4 bg-[#2D3436] ${dateClick === true ? '' : 'hidden'}`}>
                <div className='flex justify-center items-center relative bg-[#733ef0] pl-1' style={{paddingTop: "14px", paddingBottom: "14px"}}>
                    <AiOutlineClose className='text-2xl cursor-pointer text-white absolute left-2' onClick={() => setDateClick(!dateClick)} />
                    <h1 className='text-[#FFF] font-bold'>{date ? date : ''}</h1>
                </div>
                {
                    activity.filter(item => item.date == date).length === 0 ? 
                    <div className='flex justify-center items-center h-96 flex-col gap-4'>
                        <img className='w-32 h-32 bg-white rounded-full shadow-md' src="/empty_bird.svg" alt="" />
                        <h4 className='text-white font-semibold' style={{letterSpacing: "1px"}}>nothing for today!!</h4>
                    </div>
                    :
                    activity.filter(item => item.date == date).map((item, key) => (
                        <div className='task_1 rounded-lg shadow-2xl p-4 mt-10'>
                            <div className='flex justify-between'>
                                <div className='flex gap-2 items-center'>
                                    <div className='flex flex-col'>
                                        <h1 className='text-[#FFF] font-bold'>{item.title}</h1>
                                        <p className='text-[#FFF]'>{item.description}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-[#FFF]'>{item.time}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Dashboard