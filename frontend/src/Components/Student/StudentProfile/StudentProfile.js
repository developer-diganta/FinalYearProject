import React from 'react'
import { useSelector } from 'react-redux';
import SidebarStudent from '../Sidebar/SidebarStudent';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ProgressBar from '../Pages/ProgressBar';
import './StudentProfile.css';
import { IoLocationOutline } from 'react-icons/io5';
import { FaUniversity } from 'react-icons/fa';
// import plugin from 'tailwindcss';
// import ChartDataLabels from 'chartjs-plugin-doughnutlabel';

ChartJS.register(ArcElement, Tooltip, Legend);

const q = {
  total: 100,
  completed: 30,
  remaining: 70,
  easy: 40,
  easyComplete: 18,
  medium: 30,
  mediumComplete: 9,
  hard: 30,
  hardComplete: 3,
}

const data = {
  datasets: [{
    data: [30, 70],
    backgroundColor: ['#8B5CFB', '#E3E2E3'],
    borderWidth: 0,
    cutout: 130,
  }],
  labels: [q.completed+' solved'],
  // make the label position inside doughnut
  
};

function StudentProfile() {
  const { openClose, unvSign } = useSelector((state) => state.counter);
  const student = {
    name: 'John Doe',
    email: 'john@gmail.com',
    phone: '1234567890',
    address: 'ABC Street, XYZ City, India',
    university: 'XYZ University',
    department: 'Computer Science',
  }

  const profle__name = student.name.split(' ');
  const profile__initial = profle__name[0].charAt(0) + profle__name[1].charAt(0);

  const detail = {
    width: 260,
    // color: '#9fa0ff',
    color: '#2a9d8f',
    percent: ((q.easyComplete)/q.easy)*100,
  }

  const detail2 = {
    width: 260,
    // color: '#ff8500',
    color: '#e9c46a',
    percent: ((q.mediumComplete)/q.medium)*100,
  }

  const detail3 = {
    width: 260,
    // color: '#6a040f',
    color: '#e76f51',
    percent: ((q.hardComplete)/q.hard)*100,
  }

  return (
    <div className='student__profile flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarStudent />
      </div>
      <div className={`student__info dashboard_1 flex items-start bg-[#fbfbfb] ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
          <div className='w-4/6 my-4 ml-6 px-0 py-0'>
            <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center bg-white w-1/2 flex-col rounded-md shadow-lg'>
                  <Doughnut 
                  data={data}
                  options={{
                    responsive: true,
                  }}
                  />
                  <p className='my-4'>
                    Total Questions: {q.total}
                  </p>
                </div>
                <div className='flex flex-col w-1/2 gap-8'>
                  <div className="total__courses bg-white py-4 rounded-md shadow-lg">
                    <div className='text-xs bg-white rounded-full w-28 h-28 mx-auto flex flex-col items-center justify-center' style={{border: "2px solid #f77f00"}}>
                      <p>Total Courses</p>
                      <p>6</p>
                    </div>
                  </div>
                  <div className='bg-white px-8 py-8 rounded-md shadow-lg'>
                    <div className='my-6'>
                      <div className='flex items-center text-xs'>
                        <p className='w-2/5'>Easy</p>
                        <p>{q.easyComplete}/{q.easy}</p>
                      </div>
                      <ProgressBar progress={detail} />
                    </div>
                    <div className='my-6'>
                      <div className='flex items-center text-xs'>
                        <p className='w-2/5'>Medium</p>
                        <p>{q.mediumComplete}/{q.medium}</p>
                      </div>
                      <ProgressBar progress={detail2} />
                    </div>
                    <div className='my-6'>
                      <div className='flex items-center text-xs'>
                        <p className='w-2/5'>Hard</p>
                        <p>{q.hardComplete}/{q.hard}</p>
                      </div>
                      <ProgressBar progress={detail3} />
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div className='w-2/6 pt-2 flex items-center bg-white mx-8 rounded-md my-4 shadow-lg flex-col min-h-[94vh]'>
            <div className='mt-8' style={{objectFit: 'cover'}}>
              <div className='profile__pic w-28 h-28 text-4xl'>{profile__initial}</div>
            </div>
            <div className='flex flex-col items-center'>
              <h4 className='text-2xl font-bold pt-3 pb-1'>{student.name}</h4>
              <h4 className='text-sm text-[#7C7D7D] pb-6' style={{letterSpacing: "1px"}}>{student.email}</h4>
              <button className='w-56 bg-[#E8DEFF] py-2 rounded-md text-[#5F6161] text-sm font-semibold' style={{letterSpacing: "1px"}}>Edit Profile</button>
            </div>
            <div className="divider bg-[#D1D2D2] my-6" style={{minWidth: "90%", minHeight: "1px", maxWidth: "90%"}}></div>
            <div className="general__information">
              <div className='flex items-center my-4'>
                <IoLocationOutline className='text-[#7C7D7D] text-xl' />
                <h4 className='text-[#7C7D7D] text-sm font-semibold pl-2'>{student.address}</h4>
              </div>
              <div className="university my-4 flex items-center pt-2">
                <FaUniversity className='text-[#7C7D7D] text-xl' />
                <h4 className='text-[#7C7D7D] text-sm font-semibold pl-2'>{student.university}</h4>
              </div>
              <div className="stream">
                <p className='pt-4 pb-2'>Stream</p>
                <h4 className='text-[#7C7D7D] text-sm font-semibold'>{student.department}</h4>
              </div>
            </div>
            {/* <div className="divider bg-[#D1D2D2] my-4" style={{minWidth: "100%", minHeight: "1px"}}></div> */}
          </div>
      </div>
    </div>
  )
}

export default StudentProfile