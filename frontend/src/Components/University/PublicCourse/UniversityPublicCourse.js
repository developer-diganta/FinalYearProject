import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Sidebaruniversity from '../Sidebaruniversity/Sidebaruniversity';
import axios from 'axios';
import { backend_url } from '../../../BackendRoutes';
import { useNavigate } from 'react-router-dom';

function UniversityPublicCourse() {
    const[courses, setCourses] = useState([]);
    const[storeAllCourses, setStoreAllCourses] = useState([]);
    const[btnActive, setBtnActive] = useState(2);

    const { openClose } = useSelector((state) => state.counter);
    const university__id = localStorage.getItem('university__id');
    const university__token = localStorage.getItem('signup__token');
    const university__email = localStorage.getItem('university__email');

    const navigate = useNavigate();

    async function acceptPublicCourses(id){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': university__token
                }
            });
            const response = await instance.post(backend_url + '/moocs/approve', {email: university__email, id: university__id, moocsId: id});
            console.log(response);
            alert(response.data.message);
            if(response.status === 200){
                navigate('/university/publiccourse');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function rejectPublicCourses(id){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': university__token
                }
            });
            const response = await instance.post(backend_url + '/moocs/reject', {email: university__email, id: university__id, moocId: id});
            console.log(response);
            alert(response.data.message);
            if(response.status === 200){
                navigate('/university/publiccourse');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getPublicAllCourses(){
        const instance = axios.create({
          headers: {
            'x-auth-token': university__token
          }
        });
    
        const response = await instance.post(backend_url + '/moocs/get', {email: university__email, id: university__id});
        console.log(response.data);
        setCourses(response.data.moocs.filter((item,index)=>{
            return item.approvalStatus === 'pending';
        }));
        console.log(response.data.moocs.filter((item,index)=>{
            return item.approvalStatus === 'pending';
        }));
        setStoreAllCourses(response.data.moocs);
      }
    
      useEffect(() => {
        getPublicAllCourses();
      }, [])
  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            <div className='flex gap-4 bg-[#f7f7f7] items-center justify-center'>
                <h1 className={`${btnActive === 1 ? 'active__btn' : ''} border-[1px] border-[#6b7780ff] bg-[#dcdcdc] px-4 cursor-pointer py-2 my-4 text-sm text-center text-[#6b7780] font-semibold uppercase tracking-wider rounded-full shadow-xl md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center`} onClick={() => navigate('/university/publiccourse')}>Active public courses</h1>
                <h1 className={`${btnActive === 2 ? 'active__btn' : ''} border-[1px] border-[#6b7780ff] bg-[#dcdcdc] px-4 cursor-pointer py-2 my-4 text-sm text-center text-[#6b7780] font-semibold uppercase tracking-wider rounded-full shadow-xl md:text-sm sm:text-xs md:w-48 md:flex md:items-center md:justify-center md:px-2`} onClick={() => navigate('/university/pendingpubliccourse')}>Pending public courses</h1>
            </div>
            <div className='px-4'>
                {
                    courses && courses.map((student, index) => {
                    return (
                        <div className='bg-[#f8f9fa] text-[#6b7780ff] border-[1px] border-[#6b7780ff] transition duration-200 ease-out my-4 flex justify-between items-center py-2 pr-4'>
                        {/* <div></div> */}
                        <div className='text-center md:text-xs sm:text-[10px] flex items-center gap-4 pl-4' style={{fontFamily: "sans-serif", letterSpacing: "1px"}}>
                            <span className="number h-6 w-6 flex justify-center items-center rounded-sm" style={{border: "1px solid #000000"}}>{index+1}</span>
                            {student.name}
                        </div>
                        <div className='w-1/4 text-center md:text-xs sm:text-[10px] text-sm' style={{fontFamily: "sans-serif", letterSpacing: "1px"}}>{student.email}</div>
                        <div className='flex gap-4'>
                            <button className='bg-[#A3C7D6] px-2 py-1 text-white rounded-sm' onClick={() => acceptPublicCourses(student._id)}>Accept</button>
                            <button className='bg-[#D3756B] px-2 py-1 text-white rounded-sm' onClick={() => rejectPublicCourses(student._id)}>Reject</button>
                        </div>
                        </div>
                    )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default UniversityPublicCourse