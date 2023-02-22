import React from 'react';
import Header from '../AppHeader/Header';
import './ErrorPage.css';

function ErrorPage() {
  return (
    <div>
        <Header />
        <div className='my-4'>
            <h1 className='error__message' style={{fontFamily: ""}}>Sorry, this page does not exist.</h1>
            <img className='mx-auto max-w-[60vw]' style={{maxHeight: "80vh"}} src="/error_page.svg" alt="" />
        </div>
    </div>
  )
}

export default ErrorPage