import React, { useEffect, useState } from 'react'
import AdminHeading from './AdminHeading'
import axios from 'axios';
import { backend_url } from '../../BackendRoutes';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
function Admin() {
  const[universities, setUniversities] = useState([]);
  const token = localStorage.getItem('admin__token');
  const userName = localStorage.getItem('admin__username');
  const navigate = useNavigate();

  async function getUniversityDetail(event){
    console.log("abcd");
    try {
        const instance = axios.create({
            headers: {
                'x-auth-token': token
            }
        })
        const universityDetails = await instance.post(backend_url + '/admin/universities', {username: userName});
        console.log(universityDetails.data.universities);
        setUniversities(universityDetails.data.universities);
    } catch (error) {
        console.log(error);
        alert("Something went wrong");
        navigate('/admin/signin');
    }
  }

  async function restoreUniversity(unv__id){
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
          const universityDetails = await instance.post(backend_url + '/admin/restore/university', {universityId: unv__id, username: userName});
          console.log(universityDetails);
          getUniversityDetail();
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

  useEffect(() => {
    getUniversityDetail();
  }, [])

  return (
    <div className="admin">
        <AdminHeading />
        <div>
          <div className='w-11/12 mx-auto my-8'>
            <table className='border-[1px] border-[#dededf] my-4 rounded-lg'>
              <thead className='bg-[#f9fafb] border-b-[1px] border-b-[#dededf] rounded-lg'>
                <tr>
                  <th className='w-1/5'>Id</th>
                  <th className='w-1/5'>Name</th>
                  <th className='w-1/5'>Email</th>
                  <th className='w-1/5'>Phone</th>
                  <th className='w-1/5'>status</th>
                </tr>
              </thead>
              <tbody>
                {universities?.map((item) => (
                  <tr key={item._id}>
                    <td className='w-1/5 text-xs'>{item._id}</td>
                    <td className='w-1/5'>{item.name}</td>
                    <td className='w-1/5'>{item.email}</td>
                    <td className='w-1/5 text-center'>{item.phone}</td>
                    <td className='w-1/5 text-center'>{item.isdeleted ? <div className='bg-[#9900ffff] text-white font-semibold w-28 mx-auto py-1 rounded-sm cursor-pointer' onClick={() => restoreUniversity(item._id)}>restore</div> : 'active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default Admin