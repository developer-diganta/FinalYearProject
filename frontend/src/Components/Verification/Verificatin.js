import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function Verificatin() {
    // retrive the message from url
    const { message } = useParams();
    const navigate = useNavigate();
    console.log(message === ('success' | 'exists'));
    const[messageShow, setMessageShow] = React.useState(
        message === 'success' ? 'Please verify your email address. We have sent you an email with a link to verify your account. Afetr verifying, you can login to your account.' :
        (message === 'exists' ? 'This email address is already registered. Please login to your account.' : 'Something went wrong. Please try again.')
    );
    const[color1, setColor1] = React.useState(
        message === 'success' ? 'bg-lightGreen' :
        (message === 'exists' ? 'bg-lightGreen' : 'bg-lightRed')
    );
    const[color2, setColor2] = React.useState(
        message === 'success' ? 'bg-success' :
        (message === 'exists' ? 'bg-success' : 'bg-error')
    );
    // if(message === 'success'){
    //     setMessageShow('Please verify your email address. We have sent you an email with a link to verify your account. Afetr verifying your account, you can login to your account.');
    // }else if(message === 'exists'){
    //     setMessageShow('This email address is already registered. Please login to your account.');
    // }else if(message === 'error'){
    //     setMessageShow('Something went wrong. Please try again.');
    // }
  return (
    <div className={`flex justify-center flex-col items-center h-full ${color1}`} style={{height: "100vh"}}>
        <div className={`msg_box text-white p-4 rounded-2xl ${color2}`}>
            {
                message === ('success' || 'exists') ?
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </div>
                :
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
            }
        </div>
        <div className={`text_message text-lg py-4 w-3/5 text-center`}>
            {
                messageShow
            }
            <div className='flex justify-center py-2 cursor-pointer' onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
            </div>
        </div>
    </div>
  )
}

export default Verificatin