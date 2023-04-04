import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SidebarStudent from '../Student/Sidebar/SidebarStudent';
import { BsSearch } from 'react-icons/bs';
import "./PublicCourses.css";
import Fuse from 'fuse.js';

const dummy__courses = [
  {
    id: 1,
    title: 'React 101',
    description: 'Learn the basics of React and build your first app.'
  },
  {
    id: 2,
    title: 'React Native Fundamentals',
    description: 'Learn how to build mobile apps with React Native.'
  },
  {
    id: 3,
    title: 'React Advanced Topics',
    description: 'Learn advanced concepts of React such as Redux and Context API.'
  },
  {
    id: 4,
    title: 'React Testing',
    description: 'Learn how to write tests for React components using Jest and Enzyme.how to write tests for React components using Jest and Enzyme.how to write tests for React components using Jest and Enzyme.how to write tests for React components using Jest and Enzyme.how to write tests for React components using Jest and Enzyme.'
  },
  {
    id: 5,
    title: 'React Performance',
    description: 'Learn how to optimize the performance of your React apps.'
  },
  {
    id: 6,
    title: 'React Hooks',
    description: 'Learn how to use the new React Hooks feature to manage state and lifecycle methods.how to write tests for React components using Jest and Enzyme.'
  },
  {
    id: 7,
    title: 'React Server-Side Rendering',
    description: 'Learn how to render your React app on the server for improved SEO and performance.'
  }
];

const colors = ["D7E9B9", "FFFBAC", "FD8A8A", "CEEDC7", "86C8BC", "D09CFA", "ADC2A9", "060047", "E90064", "F7FD04", "FEFF86", "BEEBE9"]

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color;
  do {
    color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (colors.includes(color));
  
  colors.push(color);
  if (colors.length > 10) {
    colors.shift();
  }
  return color;
}

function PublicCourses() {
  const { openClose } = useSelector((state) => state.counter);
  const [courses, setCourses] = useState(dummy__courses);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const options = {
    keys: ['title', 'description'],
    threshold: 0.3
  }

  const fuse = new Fuse(dummy__courses, options);

  function handleSearchChange(e) {
    console.log(e.target.value);
    setQuery(e.target.value);
    setSearch(true);
    setSuggestions(fuse.search(e.target.value));
    // const suggestions = results.map((result) => result.item);
    // setSuggestions(suggestions);
  }

  return (
    <div className='individual__course flex md:block'>
      <div className={`md:w-full ${openClose ? 'w-1/5' : 'w-16'} bg-[#9900ff]`}>
          <SidebarStudent />
      </div>
      <div className={`dashboard_1 bg-white ${openClose ? 'w-4/5' : 'w-full'} md:w-full min-h-screen`} style={{float: "right"}}>
        <div className="nav__bar bg-[#f0f1f2ff] py-2 flex justify-between items-center px-4">
          <div className='public__left__nav'>All courses</div>
          <div className='public__right__nav relative'>
            <form className="abcd flex shadow-md items-center border-[1px] border-[#6b7780ff] rounded-full px-2 py-1 bg-white">
              <input
                type="text"
                value={query}
                onChange={(event) => handleSearchChange(event)}
                placeholder="Search for a course"
                className='placeholder-normal font-normal text-xs py-1 px-2 h-6'
              />
              <button type="submit" className='h-6 w-6 flex items-center justify-center'>
                <BsSearch className='text-[#6b7780ff] text-lg' />
              </button>
            </form>
            <div className={`absolute text-xs bg-[#f0f1f2ff] mt-1 shadow-md ${search === false || query === '' ? null : 'border-[1px]'} ${search ? 'border-[#6b7780ff]' : null} w-full`} style={{zIndex: "999"}}>
              <ul>
                {
                suggestions?.map((item) => (
                  <li className='py-1 hover:bg-[#f7f7f7ff] cursor-pointer px-4 py-2 text-[#6b7780ff]' style={{fontFamily: "sans-serif"}} key={item.id}>{item.item.title}</li>
                ))
                // console.log(suggestions)
                }
              </ul>
            </div>
          </div>
        </div>
        <div className='public__courses__container grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 my-4 mx-4'>
          {
            courses.map((course) => (
              <div className='public__course__card my-2 rounded-lg shadow-md' key={course.id}>
                <div className='public__course__info relative'>
                  <div className='public__course__title text-7xl font-semibold py-4 rounded-t-lg px-4 h-40' style={{backgroundColor: `${getRandomColor()}`, fontFamily: "sans-serif", color: 'rgba(255, 255, 255, 0.5)'}}>{course.title}</div>
                  <div className='bg-[#9900ff] text-white px-4 py-1 enroll__button cursor-pointer'>Enroll</div>
                  <div className='course__card__title font-bold pl-4 pt-4 pb-2'>{course.title}</div>
                  <div className='public__course__description text-sm pl-4 pb-4 pr-4 font-normal text-[#6b7780ff]'>{course.description}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default PublicCourses