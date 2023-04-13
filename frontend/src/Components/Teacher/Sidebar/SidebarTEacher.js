import React, { useEffect, useState } from 'react';
// Sidebar.css import
import '../../Sidebar/Sidebar.css';
//import useDispatch()
import { useDispatch, useSelector } from 'react-redux';
import { incrementAsync, setOpenClose } from '../../../Redux/Counter';
import { Link, useNavigate } from 'react-router-dom';

import { HiMenuAlt3 } from "react-icons/hi";
import { RiSettings4Line } from "react-icons/ri";

import { TfiBlackboard } from "react-icons/tfi";
import { FiUsers } from "react-icons/fi";
import { VscBook } from "react-icons/vsc";
import { BiEditAlt } from "react-icons/bi";
import { BsGraphUp } from "react-icons/bs";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

const SidebarTEacher = () => {
    const menus = [
      { name: "dashboard", link: "/teacher/dashboard", icon: MdOutlineDashboardCustomize },
      { name: "courses", link: "/teacher/courses", icon: VscBook },
      { name: "public course", link: "/teacher/publiccourse", icon: VscBook },
      { name: "edit", link: "/teacher/edit", icon: BiEditAlt, margin: true },
      { name: "Analyse", link: "/", icon: BsGraphUp },
      { name: "Setting", link: "/", icon: RiSettings4Line },
    ];
    const [open, setOpen] = useState(true);
    const[smallOpen, setSmallOpen] = useState(false);
    // const[courseOpen, setCourseOpen] = useState(false);
    const dispatch = useDispatch();
    const { openClose } = useSelector((state) => state.counter);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(openClose);
    }, [openClose]);
    return (
      <div data-testid='sidebar md:w-full'>
        <section className="flex gap-6">
          <div
            className={`bg-[#9900ff] min-h-screen text-white md:bg-[transparent] md:min-h-full ${
              open ? "w-full" : "w-16"
            } duration-500 text-gray-100 px-4 md:relative md:px-0`}
          >
            <div className="py-3 flex justify-between mn md:bg-[#9900ff] z-50 md:px-2 items-center">
              <div className='text-4xl cursor-pointer' style={{display: open ? 'block' : 'none', fontFamily: "'Philosopher', sans-serif"}} onClick={() => navigate('/')}>Slate</div>
              <div className='md:hidden'>
                <HiMenuAlt3
                  size={26}
                  className="cursor-pointer"
                  onClick={() => {
                    setOpen(!open)
                    dispatch(setOpenClose(!openClose))
                  }}
                />
              </div>
              <div className='hidden md:block'>
                <HiMenuAlt3
                  size={26}
                  className="cursor-pointer"
                  onClick={() => {
                    setSmallOpen(!smallOpen)
                  }}
                />
              </div>
            </div>
            <div className={`mt-4 flex flex-col gap-4 relative md:shadow-xl op md:absolute md:bg-[#9900ff] md:mt-0 md:w-screen z-40 md:${smallOpen ? 'block' : 'hidden'}`}>
              {menus?.map((menu, i) => (
                <Link
                  to={menu?.link}
                  key={i}
                  className={` ${
                    menu?.margin && "mt-5"
                  } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                >
                  <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                  <h2
                    style={{
                      transitionDelay: `${i + 3}00ms`,
                      textTransform: "capitalize",
                    }}
                    className={`whitespace-pre duration-500 text-lg capitalized ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  <h2
                    className={`${
                      open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit text-[#000000] capitalized`}
                  >
                    {menu?.name}
                  </h2>
                </Link>
              ))}
              <div className='ml-2 py-1 w-3/5 text-center rounded-sm text-base shadow-xl cursor-pointer' style={{letterSpacing: "1px", backgroundColor: "rgba(255, 255, 255, 0.4)"}} onClick={() => {
                localStorage.removeItem('teacher__token');
                localStorage.removeItem('teacher__id');
                localStorage.removeItem('teacher__email');
                navigate('/');
              }}>
                Log out
              </div>
            </div>
          </div>
        </section>
      </div>
    );
};

export default SidebarTEacher;