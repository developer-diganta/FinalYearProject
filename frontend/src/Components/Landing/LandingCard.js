import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backend_url } from '../../BackendRoutes';

const LandingCard = () => {
  const[course, setCourse] = useState([]);
  //   const course = {
      //     name: "A",
      //     description: "Ajhdgfsd sdjfg dsgfks sdfgw",
      //   }
      
        function getNum(){
          return Math.floor(Math.random() * 4) + 1;
        }

  async function getPublicCourse(){
    const response = await axios.post(backend_url + '/moocs/get');
    console.log(response);
    // setCourse(response.data.moocs);
    let temp = [];
    if(response.data.moocs.length > 3){
        for(let i=0; i<3; i++){
            temp.push(response.data.moocs[i]);
        }
    }
    console.log(temp);
    setCourse(temp);
  }

  useEffect(() => {
    getPublicCourse();
  }, [])

  return (
    <div className='grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 py-16 gap-4 md:px-8'>
    {
        course?.map((element, index) => (
            <div className="card__parent col-lg-4 col-md-6 mb-4 mx-auto" key={index+1}>
            <div className="card h-100 shadow-lg rounded-md w-[18rem] lg:w-[16rem] md:w-[18rem]">
                <div className="card-body" style={{ padding: "0px", overflow: "hidden" }}>
                <div className="public__course__card" key={element?._id}>
                    <div className="public__course__info pb-8">
                    <div className="public__course__title" style={{ background: "linear-gradient(45deg, #2937f0, #9f1ae2)", fontSize: "58px", height: "20vh", overflow: "hidden", fontWeight: "bolder", color: "rgba(255, 255, 255, 0.6)", padding: "0px 0px 0px 10px" }}>
                        {element?.name}
                    </div>
                    <div className="bg-[#9900ff]" style={{ backgroundColor: "#ffd200ff", paddingLeft: "10px", paddingTop: "2px", paddingBottom: "2px" }}>
                        Enroll Now
                    </div>
                    <div className="course__card__title" style={{ fontSize: "2rem", padding: "10px", overflow: "hidden", maxHeight: "calc(2em * 2)", lineHeight: "1.5em", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {element?.name}
                    </div>
                    <div className="public__course__description px-2 pb-2" style={{ overflow: "hidden", maxHeight: "calc(2em * 2)", lineHeight: "1.5em", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                        {element?.description}
                    </div>
                    <div className="star" style={{ display: "flex", marginLeft: "10px", border: "1px solid #dcdcdcff", width: "60px", alignItems: "center", justifyContent: "center" }}>
                        <i className="bi bi-star-fill" style={{ color: "#ffd200ff" }}></i>
                        <p className="text-sm" style={{ margin: "0", padding: "0px 0px 0px 4px" }}>
                        {getNum()}
                        </p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        ))
    }
    </div>
  );
};

export default LandingCard;
