import axios from 'axios';
import React, { useEffect } from 'react'
import { backend_url } from '../../BackendRoutes';
import { useNavigate } from 'react-router-dom';
import AdminHeading from './AdminHeading';

function AdminUptimeLogs() {
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

        </div>
    </div>
  )
}

export default AdminUptimeLogs