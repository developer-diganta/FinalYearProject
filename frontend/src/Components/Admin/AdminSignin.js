import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../BackendRoutes';

function AdminSignin() {
    const[username, setUserName] = useState();
    const[password, setPassword] = useState();
    const[showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function getFormValue(event){
        event.preventDefault();
        console.log(username, password);
        try {
            const admin__login = await axios.post(backend_url + '/admin/signin', {username, password});
            console.log("************************************", admin__login);
            localStorage.setItem('admin__token', admin__login.data.token);
            if(admin__login.data.token){
              navigate('/admin');
            }
        } catch (error) {
            console.log(error);
        }
      }

  return (
    <div className='flex justify-center items-center h-[100vh]'>
        <div>
            <div>
                <h1 className='uppercase font-bold text-4xl text-center pb-6'>Admin Signin</h1>
            </div>
            <form className='' onSubmit={(event) => getFormValue(event)}>
                <div className='py-4'>
                    <label className='my-4 ' style={{letterSpacing: "1px"}} htmlFor="userName">Username</label>
                    <input className='border-[1px] ml-4 rounded-full py-1 px-4 w-64' type="text" name='userName' onChange={(ele) => setUserName(ele.target.value)} />
                </div>
                <div className='py-4 flex my-4 pl-1'>
                    <label className='' style={{letterSpacing: "1px"}} htmlFor="password">Password </label>
                    <div className='border-[1px] w-64 py-1 ml-4 rounded-full px-4 flex items-center'>
                        <input className='w-48' type={`${showPassword ? 'text' : 'password'}`} name='password' onChange={(ele) => setPassword(ele.target.value)} />
                        <div onClick={() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />
                            }
                        </div>
                    </div>
                </div>
                <div className='mx-auto w-full flex justify-center'>
                    <button className='bg-[#6525f0ff] px-4 py-2 shadow-md text-white rounded-sm font-semibold text-sm' type='submit'>sign in</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AdminSignin