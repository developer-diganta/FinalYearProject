import React, { useState } from 'react'
import LandingHeader from '../Landing/LandingHeader'
import axios from 'axios';
import { backend_url } from '../../BackendRoutes';
import { useNavigate } from 'react-router-dom';

function Purchase() {
  const[name, setName] = useState();
  const[email, setEmail] = useState(localStorage.getItem('university__email'));
  const[phone, setPhone] = useState();
  const[plan, setPlan] = useState();

  const navigate = useNavigate();

  async function getFormValue(event) {
    event.preventDefault();
    console.log(name, phone, email, plan);
    try {
      const purchaseRes = await axios.post(backend_url + '/create-checkout-session', { name, phone, email, year: plan });
      console.log(purchaseRes.url)
      window.location.href = purchaseRes.data.url
      console.log("************", purchaseRes);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="payme min-h-[104vh]">
      <LandingHeader />
      <div>
        <h1 className='text-3xl pt-4 pb-2 pl-10 md:px-6' style={{color: "#9900ff"}}>Complete Your Purchase</h1>
        <div className='flex ml-10 mt-4 w-10/12 my-4 md:mx-auto' style={{minWidth: "200px", maxHeight: "3px", minHeight: "1px", backgroundColor: "#dbd9ff"}}></div>
        
        <div className='flex items-start'>
          <div className='w-8/12 md:w-full'>
            <div className=' w-11/12 flex items-center mx-10 bg-[#efefefff] px-2 py-1 rounded-sm font-semibold'>
              <p className='flex items-center '>*</p>
              <p className='text-xs'>Please use the email associated with your university account for both signup and checkout.</p>
            </div>
            <div className='my-4 mx-10'>
              <form className='flex flex-col items-start' onSubmit={(event) => getFormValue(event)}>
                <p>Enter the details</p>
                <input className='border-[1px] my-2 border-[#adb5bdff] px-2 py-2 min-w-[300px] text-sm rounded-sm shadow-md' required type="email" placeholder='email' value={email} onChange={(ele) => setEmail(ele.target.value)} />
                <input className='border-[1px] my-2 border-[#adb5bdff] px-2 py-2 min-w-[300px] text-sm rounded-sm shadow-md' required type="text" placeholder='name' value={name} onChange={(ele) => setName(ele.target.value)} />
                <input className='border-[1px] my-2 border-[#adb5bdff] px-2 py-2 min-w-[300px] text-sm rounded-sm shadow-md' required type="text" placeholder='phone' value={phone} onChange={(ele) => setPhone(ele.target.value)} />
                <div className='min-w-[300px] text-sm rounded-sm shadow-md border-[1px] my-2 border-[#adb5bdff] p-2 gap-2'>
                  <select className='w-full' required name="university" onChange={(ele) => {
                    setPlan(ele.target.value)
                  }}>
                    <option className='text-[rgba(77, 85, 89, 0.8)]' value="default">Choose Your Plan</option>
                    <option value={1}>1 year</option>
                    <option value={2}>2 year</option>
                    <option value={3}>3 year</option>
                  </select>
                </div>
                <button type='submit' className='sign_up_btn px-4 py-2 my-4'>Purchase</button>
              </form>
            </div>
          </div>
          <div className='w-4/12 relative md:hidden'>
              <img className='unv_img left-10' src="/stripe_payment.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase