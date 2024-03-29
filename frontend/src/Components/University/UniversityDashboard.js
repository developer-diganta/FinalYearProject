import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md'
import { FcBusinessman, FcConferenceCall, FcFinePrint } from 'react-icons/fc';
import UniversityCard from '../Cards/UniversityCard';
import { universitySignup } from '../../Redux/Counter';
import Sidebaruniversity from './Sidebaruniversity/Sidebaruniversity';
import axios from 'axios';
import { backend_url } from '../../BackendRoutes';

function UniversityDashboard() {
    const[courses, setCourses] = useState(0);
    const[students, setStudents] = useState(0);
    const[teachers, setTeachers] = useState(0);
    const[university, setUniversity] = useState('');
    const[contract, setContract] = useState();

    const { openClose, unvSign } = useSelector((state) => state.counter);
    const unv__id = localStorage.getItem('university__id');
    const token = localStorage.getItem('signup_token');
    const email = localStorage.getItem('university__email');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function getUniversityDetail(){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': token
                }
            })
            const universityDetails = await instance.post(backend_url + '/university/details', {universityId: unv__id, email: email});
            console.log(universityDetails);
            const today = new Date();
            if(universityDetails.data.universityDetails.contract.contract_status !== "succeeded"){
              navigate('/university/purchase');
            }
            if(universityDetails.data.universityDetails.isdeleted === true){
                alert("Account has been deleted. To restore it back, contact admin");
                localStorage.removeItem('signup_token');
                localStorage.removeItem('university__id');
                localStorage.removeItem('university__email');
                navigate('/');
            }
            let programArray = [];
            universityDetails.data.universityDetails.schools.map((item) => item.departments.map((item) => item.programs.map((item) => item.courses.map((item) => programArray.push(item)))));
            console.log(programArray);
            setCourses(programArray.length);
            setUniversity(universityDetails.data.universityDetails);
            setContract(universityDetails.data.universityDetails.contract);
            if(universityDetails.status === 500){
                alert("Something went wrong");
                navigate('/university/signup');
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            navigate('/university/signup');
        }
    }

    async function getAllAcceptedTeachers(){
        try {
          const instance = axios.create({
            headers: {
              'x-auth-token': token,
            },
          });
          const accepted__teachers = await instance.post(backend_url + '/university/teacher', {universityId: unv__id, email: email});
          console.log("acceptedTeachers", accepted__teachers);
          const temp = (accepted__teachers.data.filter((item,index)=>{
            return item.status === "active"
          }));
          console.log(temp);
          setTeachers(temp.length);
        } catch (error) {
          console.log(error);
          alert(error.response.data.message);
          navigate('/university/login');
        }
    }

    async function getAllStudents(){
        try {
          const instance = axios.create({
            headers: {
              'x-auth-token': token
            }
          });
    
          console.log("jgfwjegfkw", backend_url);
          const res = await instance.post(backend_url + '/university/student', {universityId: unv__id, email: email});
          console.log(res);
          const temp = res.data.filter((item,index)=>{
              return item.status === 'active';
          });
          console.log(temp.length);
          setStudents(temp.length);
        } catch (error) {
          console.log(error);
          alert("Something went wrong");
          if(error.response.status === 401){
            navigate('/university/login');
          }
        }
      }

    function formatDate(dateString){
      const date = new Date(dateString);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const parts = formattedDate.split(' ');
      console.log(parts)
      const result = `${parts[1].slice(0, -1)} ${parts[0]}, ${parts[2]}`;
      return result;
    }

    const handleClick = (event, url) => {
      event.preventDefault();
      window.open(url, "_blank");
    };

    function getDay(dt){
      const specifiedDate = new Date(dt);
      const currentDate = new Date();
      const difference = specifiedDate.getTime() - currentDate.getTime();
      const differenceInDays = Math.floor(difference / 86400000);
      return differenceInDays;
    }

    useEffect(() => {
        getUniversityDetail();
        getAllAcceptedTeachers();
        getAllStudents();
    }, [])

  return (
    <div className='flex md:block'>
        <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
            <Sidebaruniversity />
        </div>
        <div className={`pt-4 pl-6 bg-[#f8f9fa] ${openClose ? 'w-4/5' : 'w-full'} pr-6 md:w-full min-h-[104vh]`} style={{float: "right"}}>
            <div className='text-2xl border-b-2 border-b-[#9900ff] w-full flex justify-between sm:flex-col sm:items-center sm:gap-4'>
                <h1 className='text-3xl' style={{letterSpacing: "1px"}}>{university ? university.name : ''} DASHBOARD</h1>
                <h1 className='text-lg'>🖐 Hello <span className='text-[#9900ff] font-semibold'>@Admin</span></h1>
            </div>
            <div className='flex justify-center text-xl py-4'>
                <p className='bg-[#9900ff] px-20 py-2 text-white font-semibold sm:text-base sm:px-8 sm:w-full text-center' style={{textShadow: "2px 2px 2px rgba(0, 0, 0, 0.4"}}>id: {unv__id}</p>
            </div>
            <div className="validity bg-white p-2 my-2 shadow-md text-semibold text-lg flex justify-between items-center rounded-md">
                <p>Expire in {
                  getDay(contract?.contract_end_date)
                } days</p>
                <MdKeyboardArrowRight />
            </div>
            <div className='grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-8 pt-4'>
                <UniversityCard cardName={'Teachers'} total={teachers} icon={<FcBusinessman className='text-4xl' />} />
                <UniversityCard cardName={'Course'} total={courses} icon={<FcFinePrint className='text-4xl' />} />
                <UniversityCard cardName={'Students'} total={students} icon={<FcConferenceCall className='text-4xl' />} />
            </div>
            <div className='flex my-6 gap-6 md:flex-col'>
                <div className='bg-white rounded-md shadow-md md:mx-auto w-7/12 mx-left md:w-full'>
                    <h2 className='text-center bg-[#9900ff] rounded-t-md py-2 text-white'  style={{textShadow: "2px 2px 2px rgba(0, 0, 0, 0.4"}}>Contract details</h2>
                    <div className='px-4 py-2'>
                        <div className="contract xs:text-sm pb-4 text-[#6b7780ff] font-semibold text-sm">
                            <div className='flex items-center gap-2 py-2'>
                              <p>Contract start: </p>
                              <p>{formatDate(contract?.contract_start_date)}</p>
                            </div>
                            <div className='flex items-center gap-2 py-2'>
                              <p>Contract end: </p>
                              <p>{formatDate(contract?.contract_end_date)}</p>
                            </div>
                            <div className='py-2'>
                              <p>Contract type: {contract?.contract_type}</p>
                            </div>
                            <div className='py-2'>
                              <p>Contract id: {contract?.contract_id}</p>
                            </div>
                            <div className='my-2 bg-[#dcdcdcff] w-28 flex items-center justify-center py-1 rounded-sm'>
                              <a href="" onClick={(event) => handleClick(event, contract?.contract_receipt)}>Get receipt</a>                            
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='bg-white w-5/12 md:mx-auto md:w-10/12 shadow-md' style={{minHeight: "400px"}}></div> */}
            </div>
        </div>
    </div>
  )
}

export default UniversityDashboard