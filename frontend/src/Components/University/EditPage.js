import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';

function EditPage() {
  return (
    <div className='university_edit_page min-h-screen flex justify-center items-center' style={{backgroundColor: "#9900ff"}}>
        <div className="form bg-white w-3/5 rounded-0 shadow-2xl p-4 md:w-10/12 md:my-8 md:px-1 md:rounded-md" style={{minHeight: "80vh"}}>
            <div className="form__header font-bold text-2xl py-2">
                <AiOutlineHome className='md:mx-auto' />
            </div>
            <div className="form__body px-2">
                <form className='' style={{color: "#828181"}} action="">
                    <div className='pb-8 px-2 sm:font-semibold' style={{border: "1px solid #828181"}}>
                        <h1 className='text-lg font-bold py-2 flex justify-center'>Address</h1>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-1">
                            <div className="form__body__input flex items-center gap-2">
                                <div className="name w-1/5 md:text-sm sm:text-xs" >Street</div>
                                <input className="divide-dotted w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="text" name="name" id="name" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="email w-1/5 md:text-sm sm:text-xs" >City</div>
                                <input className="divide-dotted  w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="email" name="email" id="email" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="password w-1/5 md:text-sm sm:text-xs" >State</div>
                                <input className="divide-dotted  w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="password" name="password" id="password" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="confirm_password w-1/4 md:text-sm sm:text-xs" >Zip Code</div>
                                <input className="divide-dotted  w-3/4" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="password" name="confirm_password" id="confirm_password" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="phone w-1/5 md:text-sm sm:text-xs" >Phone</div>
                                <input className="divide-dotted  w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="number" name="phone" id="phone" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="address w-1/5 md:text-sm sm:text-xs" >Email</div>
                                <input className="divide-dotted  w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="text" name="address" id="address" />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='pb-8 px-2 sm:font-semibold' style={{border: "1px solid #828181"}}>
                        <h1 className='text-lg font-bold py-2 flex justify-center'>Point of contact</h1>
                        <div className='grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-1'>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="name w-1/5 md:text-sm sm:text-xs" >Name</div>
                                <input className="divide-dotted w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="text" name="name" id="name" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="email w-1/5 md:text-sm sm:text-xs" >Email</div>
                                <input className="divide-dotted  w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="email" name="email" id="email" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="password w-1/5 md:text-sm sm:text-xs" >Phone</div>
                                <input className="divide-dotted  w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="password" name="password" id="password" />
                            </div>
                            <div className="form__body__input flex items-center gap-2">
                                <div className="confirm_password w-1/5 md:text-sm sm:text-xs" >Position</div>
                                <input className="divide-dotted  w-4/5" style={{outline: "none", borderBottom: "1px dashed #a8a8a8"}} type="password" name="confirm_password" id="confirm_password" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default EditPage