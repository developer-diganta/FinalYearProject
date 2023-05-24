import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './Landing.css';
import LandingCard from './LandingCard'

function LandingPage() {
    const[menu, setMenu] = useState(false);

    const navigate = useNavigate();

  return (
    <div className='unique' style={{fontFamily: 'Mulish, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji'}}>
        <nav className="navbar md:py-2 navbar-expand-lg navbar-light fixed-top shadow-sm top-0" id="mainNav">
            <div className={`container px-16 flex items-center justify-between py-2 md:py-4 fixed top-0 shadow-md z-999 bg-[#FFF] md:flex-col md:px-2`} style={{zIndex: "999"}}>
                {/* <!-- <a className="navbar-brand fw-bold" href="#page-top">Slate</a> --> */}
                <div className={`md:flex justify-between md:w-full`}>
                    <img className='md:w-[80px] w-[110px]' src="./SLATE.png" alt="" />
                    <button className={`navbar-toggler hidden md:block border-[1px] border-[#aaaaaaff] px-2`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"onClick={() => {
                        setMenu(!menu)
                    }}>
                        Menu
                        <i className="bi-list"></i>
                    </button>
                </div>
                <div className={`${menu === true ? 'md:block' : 'md:hidden'} collapse navbar-collapse flex items-center gap-6 md:flex-col md:items-start md:w-full md:gap-4" id="navbarResponsive`}>
                    <ul className="navbar-nav ms-auto me-4 my-3 flex gap-8 md:gap-4 md:flex-col">
                        <li className="nav-item"><a className="me-lg-3 font-semibold text-sm" href="#home">Home</a></li>
                        <li className="nav-item"><a className="me-lg-3 font-semibold text-sm" href="#features">Feature</a></li>
                        <li className="nav-item"><a className="me-lg-3 font-semibold text-sm" href="#pricing">Pricing</a></li>
                    </ul>
                    <div onClick={() => {
                        navigate('/signupoptions')
                    }}>
                        <button className="rounded-pill btn-signup px-3 bg-[#2937f0ff] py-2 rounded-full text-sm text-white md:px-6" >
                            <span className="d-flex align-items-center">
                                <span className="small font-bold">Sign Up</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        {/* <!-- Mashead header--> */}
        <header id="home" className="masthead pt-[15vh] bg-[#f8f9fa]">
            <div className="">
                <div className="flex items-center px-16 gap-4 md:flex-col md:px-2">
                    <div className="w-7/12 md:w-10/12">
                        {/* <!-- Mashead text and app badges--> */}
                        <div className="mb-5 mb-lg-0 text-center text-lg-start px-10 md:px-1">
                            <h2 className="text-5xl text-start md:text-center" style={{fontSize: 'calc(1rem + 3.2vw)', fontFamily: '"Newsreader", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'}}>Making Programming Education Accessible to All.</h2>
                            <p className="text-start md:text-center text-lg text-[#6c757d] pt-4 text-muted mb-5">Bridging the Gap by Empowering Students, Educators, and Universities!</p>
                            <div className="flex gap-4 md:justify-center sm:flex-col">
                                <div className="me-lg-3 mb-4 mb-lg-0">
                                    <button className="rounded-full py-[8px] px-6 text-base mb-2 mb-lg-0" style={{ background: '#2937f0', color: '#FFF'}} onClick={() => {
                                    navigate('/signupoptions')
                                }}>Sign Up</button>
                                </div>
                                <div>
                                    <button className="rounded-full py-[8px] px-6 text-base mb-2 mb-lg-0" style={{ background: '#cdcbcdff'}} onClick={() => {
                                    navigate('/signupoptions')
                                }}>Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-5/12 md:w-10/12">
                        {/* <!-- Masthead device mockup feature--> */}
                        <div className="masthead-device-mockup">
                            <img src="/landingIcon_1.png" style={{ maxWidth: '100%', height: '100%', zIndex: 999 }} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
        {/* <!-- Quote/testimonial aside--> */}
        <aside className="text-center bg-gradient-primary-to-secondary py-10" style={{background: 'linear-gradient(45deg, #2937f0, #9f1ae2)'}}>
            <div className="container px-5">
                <div className="row gx-5 justify-content-center">
                    <div className=" w-9/12 mx-auto md:w-11/12">
                        <div className="h2 fs-1 text-white mb-4" style={{ fontSize: 'xx-large', letterSpacing: '1px', wordSpacing: '2px', fontWeight: 200 }}>"Technology is the best when it empowers individuals, connects communities, and enables unprecedented access to knowledge and opportunities, ultimately fostering progress, innovation, and a brighter future for all."</div>
                    </div>
                </div>
            </div>
        </aside>
        {/* <!-- App  section--> */}
        <section id="features">
            <div className="container px-5">
                <div className="flex items-start px-16 pt-28 md:flex-col md:px-8">
                    <div className="w-4/12 order-lg-0 md:hidden">
                        {/* <!-- Features section device mockup--> */}
                        <div className="features-device-mockup relative">
                            <img src="/featuresIcon.png" style={{ maxWidth: '100%', height: '100%', zIndex: "100" }} alt="" />
                            <div className="circle min-h-[250px] top-20 absolute max-w-[250px] min-w-[250px] max-h-[250px] my-2" style={{background: "linear-gradient(45deg, #2937f0, #9f1ae2)", borderRadius: "50%", zIndex: "-10"}}></div>
                        </div>
                    </div>
                    <div className="w-8/12 md:w-full order-lg-1 mb-5 mb-lg-0 px-10 lg:px-6">
                        <div className="container-fluid px-5 lg:px-0">
                            <div className="flex sm:flex-col">
                                <div className="w-1/2 sm:w-full px-10 lg:px-4">
                                    {/* <!-- Feature item--> */}
                                    <div className="text-center">
                                        <i className="bi-code-slash icon-feature text-gradient d-block mb-3"></i>
                                        <h3 className="feature__heading" style={{fontsize: 'calc(1.3rem + 0.6vw)'}}>Programming Language Variety</h3>
                                        <p className="text-[#6c757d] pt-4 mb-0">Explore 20+ programming languages for limitless coding possibilities!</p>
                                    </div>
                                </div>
                                <div className="w-1/2 sm:w-full px-10 lg:px-4">
                                    {/* <!-- Feature item--> */}
                                    <div className="text-center">
                                        <i className="bi bi-currency-dollar icon-feature text-gradient d-block mb-3"></i>
                                        <h3 className="feature__heading" style={{fontsize: 'calc(1.3rem + 0.6vw)'}}>Affordable Pricing Options</h3>
                                        <p className="text-[#6c757d] pt-4 mb-0">Affordable pricing plans make technology accessible to all!</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex pt-8 sm:flex-col">
                                <div className="w-1/2 sm:w-full px-10 lg:px-4">
                                    {/* <!-- Feature item--> */}
                                    <div className="text-center">
                                        <i className="bi bi-bookmark-check icon-feature text-gradient d-block mb-3"></i>
                                        <h3 className="feature__heading" style={{fontsize: 'calc(1.3rem + 0.6vw)'}}>Code Plagiarism Checker</h3>
                                        <p className="text-[#6c757d] pt-4 mb-0">Ensure code originality with our reliable plagiarism checker!</p>
                                    </div>
                                </div>
                                <div className="w-1/2 sm:w-full px-10 lg:px-4">
                                    {/* <!-- Feature item--> */}
                                    <div className="text-center">
                                        <i className="bi bi-people icon-feature text-gradient d-block mb-3"></i>
                                        <h3 className="feature__heading" style={{fontsize: 'calc(1.3rem + 0.6vw)'}}>Public Courses for Everyone</h3>
                                        <p className="text-[#6c757d] pt-4 mb-0">Join our inclusive public courses for valuable learning opportunities!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-4/12 md:w-full order-lg-0 hidden md:block">
                        {/* <!-- Features section device mockup--> */}
                        <div className="features-device-mockup relative md:mx-auto">
                            <img className='md:mx-auto' src="/featuresIcon.png" style={{ maxWidth: '100%', height: '100%', zIndex: "100" }} alt="" />
                            <div className="md:mx-auto centered circle min-h-[250px] top-20 absolute max-w-[250px] min-w-[250px] max-h-[250px] my-2" style={{background: "linear-gradient(45deg, #2937f0, #9f1ae2)", borderRadius: "50%", zIndex: "-10"}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- Basic features section--> */}
        <section id="pricing" className="bg-[#f8f9fa] mt-16 py-16">
            <div className="container px-16 w-10/12 mx-auto lg:w-full">
                <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mx-auto gap-10">
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card sm:max-w-[280px] mx-auto h-100 bg-white border-[1px] border-[#adb5bdff] rounded-md">
                      <div classNameName="card-body " style={{ padding: '0px', overflow: 'hidden', boxSizing: 'border-box' }}>
                        <div className='' style={{
                            background: 'linear-gradient(45deg, #2937f0, #9f1ae2)',
                            borderRadius: '100% 0% 48% 52% / 0% 0% 100% 100%',
                            paddingBottom: '28px',
                            paddingTop: '10px',
                            left: '-10px',
                            position: 'relative',
                            textAlign: 'center',
                            color: '#FFF'
                          }}
                        >
                            <p style={{ textTransform: 'uppercase' }}>Basic</p>
                            <h5 className="card-title" style={{ fontSize: '2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                                  </svg>
                                20000
                            </h5>
                        </div>
                        <p className="card-text" style={{ padding: '20px 14px' }}>Get essential features and access to our website for one year at an affordable price of ₹20000.</p>
                        <div style={{ width: '100%', margin: '0 auto', display: 'flex', padding: '10px' }}>
                            <div className="btn" style={{
                              background: 'linear-gradient(45deg, #2937f0, #9f1ae2)',
                              color: '#FFF',
                              padding: '6px 30px',
                              borderRadius: '20px',
                              textAlign: 'center'
                            }}
                            onClick={() => {
                                navigate('/university/purchase')
                            }}
                            >Buy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card sm:max-w-[280px] mx-auto h-100 bg-white border-[1px] border-[#adb5bdff] rounded-md">
                        <div classNameName="card-body" style={{ padding: '0', overflow: 'hidden' }}>
                          <div style={{
                            background: 'linear-gradient(45deg, #2937f0, #9f1ae2)',
                            borderRadius: '100% 0% 48% 52% / 0% 0% 100% 100%',
                            paddingBottom: '28px',
                            paddingTop: '10px',
                            left: '-10px',
                            position: 'relative',
                            textAlign: 'center',
                            color: '#FFF'
                          }}
                          >
                              <p style={{ textTransform: 'uppercase' }}>Standard</p>
                              <h5 className="card-title" style={{ fontSize: '2rem' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                        <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                                    </svg>


                                  36000
                              </h5>
                          </div>
                          <p className="card-text" style={{padding: '20px 14px'}}>Upgrade to the Standard Plan and enjoy an extended two-year subscription for only ₹36000.<br /></p>
                          <div style={{
                            width: '100%',
                            margin: '0 auto',
                            display: 'flex',
                            padding: '10px'
                          }}
                          >
                              <div className="btn" style={{
                                background: 'linear-gradient(45deg, #2937f0, #9f1ae2)',
                                color: '#FFF',
                                padding: '6px 30px',
                                borderRadius: '20px',
                                textAlign: 'center'
                              }}
                              onClick={() => {
                                navigate('/university/purchase')
                            }}
                              >Buy</div>
                          </div>
                        </div>
                      </div>
                  </div>
                  <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card sm:max-w-[280px] mx-auto h-100 bg-white border-[1px] border-[#adb5bdff] rounded-md">
                        <div className="card-body" style={{padding: '0px', overflow: 'hidden'}}>
                          <div style={{
                            background: 'linear-gradient(45deg, #2937f0, #9f1ae2)',
                            borderRadius: '100% 0% 48% 52% / 0% 0% 100% 100%',
                            paddingBottom: '28px',
                            paddingTop: '10px',
                            left: '-10px',
                            position: 'relative',
                            textAlign: 'center',
                            color: '#FFF',
                          }}
                          >
                              <p style={{textTransform: 'uppercase'}}>Premium</p>
                              <h5 className="card-title" style={{fontSize: '2rem'}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-rupee" viewBox="0 0 16 16">
                                        <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                                    </svg>


                                  50000
                              </h5>
                          </div>
                          <p className="card-text" style={{padding: '20px 14px'}}>Unlock the ultimate website experience for three year with our Premium Plan for just ₹50000.</p>
                          <div style={{
                            width: '100%',
                            margin: '0 auto',
                            display: 'flex',
                            padding: '10px'
                          }}
                          >
                              <div className="btn" style={{
                                background: 'linear-gradient(45deg, #2937f0, #9f1ae2)',
                                color: '#FFF',
                                padding: '6px 30px',
                                borderRadius: '20px',
                                textAlign: 'center'
                              }}
                              onClick={() => {
                                navigate('/university/purchase')
                            }}
                              >Buy</div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
              
        </section>
        {/* <!-- Call to action section--> */}
        <section className="cta">
            <div className="cta-content">
                <div className="container px-5">
                    <div>
                        <h1 className="table__heading" style={{color: '#FFF', paddingBottom: '20px'}}>Slate vs. Moodle vs. Canvas vs. Google classroom</h1>
                        <table className="table md:hidden d-none d-sm-table table-bordered shadow-2xl mx-auto w-10/12" style={{color: '#FFF'}}>
                            <thead className='t__head py-4' style={{
                              backgroundColor: '#202226 !important'
                            }}
                            >
                              <tr className='py-4 rounded-sm'>
                                <th className='py-2' scope="col">Feature</th>
                                <th className='py-2' scope="col">Slate</th>
                                <th className='py-2' scope="col">Moodle</th>
                                <th className='py-2' scope="col">Canvas</th>
                                <th className='py-2' scope="col">Google classroom</th>
                              </tr>
                            </thead>
                            <tbody className='t__body' style={{
                              backgroundColor: '#000000 !important'
                            }}
                            >
                              <tr>
                                <th scope="row">Programming Languages</th>
                                <td><i className="bi bi-check-lg yes"></i> (47 languages)</td>
                                <td><i className="bi bi-check-lg yes"></i> (via plugins)</td>
                                <td><i className="bi bi-x-lg no"></i></td>
                                <td><i className="bi bi-x-lg no"></i></td>
                              </tr>
                              <tr>
                                <th scope="row">Public Courses</th>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-x-lg no"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-x-lg no"></i></td>
                              </tr>
                              <tr>
                                <th scope="row">User Management</th>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                              </tr>
                              <tr>
                                <th scope="row">Course Creation</th>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                              </tr>
                              <tr>
                                <th scope="row">Automated Grading</th>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-check-lg yes"></i></td>
                                <td><i className="bi bi-x-lg no"></i></td>
                              </tr>
                              <tr>
                                <th scope="row">Learning Curve</th>
                                <td>Easy to Learn</td>
                                <td>Steep</td>
                                <td>Moderate</td>
                                <td>Easy to Learn</td>
                              </tr>
                            </tbody>
                          </table>
                          
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-[#f8f9fa]">
            <div className="container">
                <div id="public__course__container" className="row justify-content-center">
                    <LandingCard />
                </div>
            </div>
        </section>

        {/* <!-- App badge section--> */}
        <section className="bg-gradient-primary-to-secondary py-16" id="download" style={{background: "linear-gradient(45deg, #2937f0, #9f1ae2)"}}>
            <div className="container px-5">
                <h2 className="text-center text-white font-alt mb-4 text-4xl" style={{letterSpacing: '2px', fontFamily: '"Kanit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important'}}>Register now!</h2>
                <div className="flex justify-center items-center gap-6">
                    <div className="me-lg-3 mb-lg-0">
                        <button className="bg-[#ffd200ff] rounded-full text-[#000000] px-6 mt-4 mb-2 mb-lg-0 py-2 font-semibold text-sm" style={{
                          border: 'none'
                        }}
                        onClick={() => {
                            navigate('/signupoptions')
                        }}
                        >Sign Up</button>
                    </div>
                    <div>
                        <button className="rounded-full px-6 mt-4 mb-2 mb-lg-0 text-sm font-semibold text-[#000000] py-2" style={{
                          background: '#cdcbcdff'
                        }}
                        onClick={() => {
                            navigate('/signupoptions')
                        }}
                        >Login</button>
                    </div>                
                </div>
            </div>
        </section>
        {/* <!-- Footer--> */}
        <footer className="bg-[#202226ff] text-[#e3e2e3ff] text-center py-5">
            <div className="container px-5">
                <div className="text-white-50 small">
                    <div className="mb-2">&copy; slate@2023</div>
                </div>
            </div>
        </footer>
        {/* <!-- Bootstrap core JS--> */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
        {/* <!-- Core theme JS--> */}
        {/* <script src="js/scripts.js"></script> */}
        <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>

    </div>

  )

}

export default LandingPage

{/* public__course__container */}