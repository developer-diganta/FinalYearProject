import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backend_url } from '../../BackendRoutes';
import { useNavigate } from 'react-router-dom';
import AdminHeading from './AdminHeading';

function AdminUptimeLogs() {

    const[uptimes, setUptimes] = useState([]);

    const token = localStorage.getItem('admin__token');
    const userName = localStorage.getItem('admin__username');
    const navigate = useNavigate();

    async function getUptimeLogs(){
        try {
            const instance = axios.create({
                headers: {
                    'x-auth-token': token
                }
            })
            const universityDetails = await instance.post(backend_url + '/admin/uptimelogs', {username: userName});
            console.log(universityDetails);
            setUptimes(universityDetails.data.uptime)
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            // navigate('/admin/signin');
        }
    }

    useEffect(() => {
        getUptimeLogs();
    }, [])

  return (
    <div>
        <AdminHeading />
        <div className='px-16 mt-8'>
        <div className='w-11/12 mx-auto my-8'>
            <table className='border-[1px] border-[#dededf] my-4 rounded-lg'>
              <thead className='bg-[#f9fafb] border-b-[1px] border-b-[#dededf] rounded-lg'>
                <tr>
                  <th className='w-1/5'>Id</th>
                  <th className='w-1/5'>Time</th>
                  <th className='w-1/5'>Uptime</th>
                  <th className='w-1/5'>Status</th>
                </tr>
              </thead>
              <tbody>
                {uptimes?.map((item) => (
                  <tr key={item._id}>
                    <td className='w-1/5 text-xs text-center'>{item.id}</td>
                    <td className='w-1/5 text-xs text-center'>{item.time}</td>
                    <td className='w-1/5 text-xs text-center'>{item.uptime}</td>
                    <td className='w-1/5 text-xs text-center'>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default AdminUptimeLogs