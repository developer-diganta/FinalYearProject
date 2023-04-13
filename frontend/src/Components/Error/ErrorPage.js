import React from 'react';
import Header from '../AppHeader/Header';
import './ErrorPage.css';
import LandingHeader from '../Landing/LandingHeader';

function ErrorPage() {
  return (
    <div className='min-h-[104vh]'>
        <LandingHeader />
        <div className=''>
            <h1 className='error__message' style={{fontFamily: ""}}>Sorry, this page does not exist.</h1>
            <img className='mx-auto max-w-[60vw]' style={{maxHeight: "80vh"}} src="/error_page.svg" alt="" />
        </div>
    </div>
  )
}

export default ErrorPage