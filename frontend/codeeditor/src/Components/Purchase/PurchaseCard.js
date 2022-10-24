import React from 'react'

function PurchaseCard({info}) {
  return (
    <div className='purchase_card shadow-lg w-96 rounded-sm py-4 bg-white z-50 hover:scale-105 duration-100 hover:shadow-2xl cursor-pointer'>
        <h4 className='font-bold pl-4 ' style={{textTransform: "uppercase"}}>{info.title}</h4>
        <div className='flex justify-center mx-auto mt-4 w-11/12' style={{minWidth: "200px", maxHeight: "1px", minHeight: "1px", backgroundImage: 'linear-gradient(to right, #9900ff, #8c32ff, #8047ff, #7557ff, #6c63ff)'}}></div>
        <h1 className='py-4 text-sm font-semibold pl-4 ' style={{color: "light-gray"}}><span className='text-3xl font-bold' style={{color: "#000000"}}>₹{info.price}</span> for {info.time} year</h1>
        <p className='pr-14 text-sm pl-4 '>{info.descriptionHead}</p>
        {
            info.description.map((item) => (
                <div className='flex gap-2 pt-4 pl-4 '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#50D146" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    <p className='text-sm'>{item}</p>
                </div>
            ))
        }
        <div className='flex justify-center mx-auto mt-4 w-11/12' style={{minWidth: "200px", maxHeight: "1px", minHeight: "1px", backgroundColor: "#dbd9ff"}}></div>
        <div className="button w-24 flex justify-center items-center py-2 px-2 rounded-md mx-auto mt-4" style={{backgroundImage: 'linear-gradient(to right, #9900ff, #8c32ff, #8047ff, #7557ff, #6c63ff)', color: '#FFF'}}>
            Buy Now
        </div>
    </div>
  )
}

export default PurchaseCard