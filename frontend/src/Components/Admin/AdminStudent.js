import React, { useState } from 'react'
import AdminHeading from './AdminHeading'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../BackendRoutes';

function AdminStudent() {
  const[universityId, setUniversityId] = useState();
  const[student, setStudent] = useState();
  const[universities, setUniversities] = useState([]);

  const token = localStorage.getItem('admin__token');
  const userName = localStorage.getItem('admin__username');
  const navigate = useNavigate();

  async function getUniversityDetail(event){
    event.preventDefault();
    try {
        const instance = axios.create({
            headers: {
                'x-auth-token': token
            }
        })
        const universityDetails = await instance.post(backend_url + '/admin/university', {universityId: universityId, username: userName});
        console.log(universityDetails);
        setUniversities(universityDetails.data.students);
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
        navigate('/admin/signin');
    }
  }

  async function restoreStudent(student__id){
    const result = window.confirm("Do you want to continue?");
      if (result) {
        // user clicked the "Continue" button
        // do something here
        console.log("continue");
        try {
          const instance = axios.create({
              headers: {
                  'x-auth-token': token
              }
          })
          const universityDetails = await instance.post(backend_url + '/admin/restore/student', {studentId: student__id, username: userName});
          console.log(universityDetails);
          alert("Account restored");
          rest();
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            navigate('/admin/signin');
        }
      } else {
        // user clicked the "Cancel" button
        // do something else here
        console.log("Cancel");
      }
  }

  async function rest(){
    try {
      const instance = axios.create({
          headers: {
              'x-auth-token': token
          }
      })
      const universityDetails = await instance.post(backend_url + '/admin/university', {universityId: universityId, username: userName});
      console.log(universityDetails);
      setUniversities(universityDetails.data.teachers);
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
        navigate('/admin/signin');
    }
  }

  return (
    <div>
        <AdminHeading />
        <div className='px-16 mt-8'> 
            <h1 className='uppercase text-3xl text-start pb-6' style={{fontWeight: "bolder"}}>Students</h1>
            <p className='font-semibold' style={{letterSpacing: "1px"}}>Search students detail by university</p>
            <form className='text-center my-8' action="" onSubmit={getUniversityDetail}>
                <input className='border-[1px] border-[#efefef] px-4 text-sm py-2 min-w-[40vw] rounded-sm' type="text" placeholder='Enter university Id' onChange={(ev) => setUniversityId(ev.target.value)} />
                <button className='bg-[#dcdcdcff] py-2 mx-2 px-2 text-sm roundded-sm'>Search</button>
            </form>
            <div className={`w-full mx-auto my-8 ${universities.length === 0 ? 'hidden' : 'block'}`}>
            <table className='border-[1px] border-[#dededf] my-4 rounded-lg mx-auto'>
              <thead className='bg-[#f9fafb] border-b-[1px] border-b-[#dededf]'>
                <tr>
                  <th className='w-1/3'>Id</th>
                  <th className='w-1/3'>Name</th>
                  <th className='w-1/3'>status</th>
                </tr>
              </thead>
              <tbody>
                {universities?.map((item) => (
                  <tr key={item._id}>
                    <td className='w-1/3 text-xs'>{item._id}</td>
                    <td className='w-1/3'>{item.name}</td>
                    <td className='w-1/3 text-center'>{item.isdeleted ? <div className='bg-[#9900ffff] text-white font-semibold w-28 mx-auto py-1 rounded-sm' onClick={() => restoreStudent(item._id)}>restore</div> : 'active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        </div>
    </div>
  )
}

export default AdminStudent