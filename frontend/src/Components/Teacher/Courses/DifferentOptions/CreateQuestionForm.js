import React from 'react'
import { useSelector } from 'react-redux';
import SidebarTEacher from '../../Sidebar/SidebarTEacher'

function CreateQuestionForm() {
    const { openClose, unvSign } = useSelector((state) => state.counter);
    return (
        <div className='create__question__form flex md:block'>
            <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
                <SidebarTEacher />
            </div>
            <div className={`dashboard_1 bg-[#F6F6F6] px-4 ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
            </div>
        </div>
    )
}

export default CreateQuestionForm