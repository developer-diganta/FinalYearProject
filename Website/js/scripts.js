/*!
* Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    const backend_url = 'http://localhost:5000';
    const requestData = {
        email: "student__email",
        id: "student__id"
    };
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(requestData)
    };

    let public__courses = [];

    const container = document.getElementById("public__course__container");
    
    fetch(backend_url + '/moocs/get', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        public__courses = data.moocs;
        console.log(public__courses);
        let length = (public__courses.length >= 3) ? 3 : public__courses.length;
        for(let i=0; i<length; i++){
            const course = {
                description: public__courses[i].description,
                name: public__courses[i].name,
                star: 4
            };
            console.log(course);

            const cardParent = document.createElement("div");
            cardParent.classList.add("card__parent", "col-lg-4", "col-md-6", "mb-4");

            const courseCard = document.createElement("div");
            courseCard.classList.add("card", "h-100", "shadow");
            courseCard.style.width = "18rem";
            courseCard.style.margin = "0 auto";
            // courseCard.style.boxShadow = ""

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "card-test");
            cardBody.style.padding = "0px";
            cardBody.style.overflow = "hidden";

            const publicCourseCard = document.createElement("div");
            publicCourseCard.classList.add("public__course__card");
            publicCourseCard.key = course._id;

            const publicCourseInfo = document.createElement("div");
            publicCourseInfo.classList.add("public__course__info");

            const publicCourseTitle = document.createElement("div");
            publicCourseTitle.classList.add("public__course__title");
            publicCourseTitle.textContent = course.name;
            publicCourseTitle.style.background = "linear-gradient(45deg, #2937f0, #9f1ae2)";
            publicCourseTitle.style.fontSize = "48px";
            publicCourseTitle.style.height = "20vh";
            publicCourseTitle.style.overflow = "hidden";
            publicCourseTitle.style.fontWeight = "bolder";
            publicCourseTitle.style.color = "rgba(255, 255, 255, 0.6)";
            publicCourseTitle.style.padding = "0px 0px 0px 10px";

            const enrollNow = document.createElement("div");
            enrollNow.classList.add("bg-[#9900ff]");
            enrollNow.textContent = "Enroll Now";
            enrollNow.style.backgroundColor = "#ffd200ff";
            enrollNow.style.paddingLeft = "10px";
            enrollNow.style.paddingTop = "2px";
            enrollNow.style.paddingBottom = "2px";

            const courseCardTitle = document.createElement("div");
            courseCardTitle.classList.add("course__card__title");
            courseCardTitle.textContent = course.name;
            courseCardTitle.style.fontSize = "2rem";
            courseCardTitle.style.padding = "10px";
            courseCardTitle.style.overflow = "hidden";
            courseCardTitle.style.maxHeight = "calc(2em * 2)";
            courseCardTitle.style.lineHeight = "1.5em";
            courseCardTitle.style.textOverflow = "ellipsis";
            courseCardTitle.style.whiteSpace = "nowrap";

            const courseDescription = document.createElement("div");
            courseDescription.classList.add("public__course__description");
            courseDescription.textContent = course.description;
            courseDescription.style.overflow = "hidden";
            courseDescription.style.maxHeight = "calc(2em * 2)";
            courseDescription.style.lineHeight = "1.5em";
            courseDescription.style.textOverflow = "ellipsis";
            courseDescription.style.whiteSpace = "nowrap";
            courseDescription.style.paddingLeft = "10px";

            const star = document.createElement("div");
            star.classList.add("star");
            star.style.display = "flex";
            star.style.marginLeft = "10px";
            star.style.border = "1px solid #dcdcdcff";
            star.style.width = "60px";
            star.style.display = "flex";
            star.style.alignItems = "center";
            star.style.justifyContent = "center";

            const starFill = document.createElement("i");
            starFill.classList.add("bi", "bi-star-fill");
            starFill.style.color = "#ffd200ff";

            const rating = document.createElement("p");
            rating.classList.add("text-sm");
            rating.textContent = course.star;
            rating.style.margin = "0";
            rating.style.padding = "0px 0px 0px 4px"

            star.appendChild(starFill);
            star.appendChild(rating);

            const pl4 = document.createElement("div");
            pl4.classList.add("pl-4", "mb-4", "mt-2");

            pl4.appendChild(star);

            publicCourseInfo.appendChild(publicCourseTitle);
            publicCourseInfo.appendChild(enrollNow);
            publicCourseInfo.appendChild(courseCardTitle);
            publicCourseInfo.appendChild(courseDescription);
            publicCourseInfo.appendChild(pl4);

            publicCourseCard.appendChild(publicCourseInfo);

            cardBody.appendChild(publicCourseCard);

            courseCard.appendChild(cardBody);

            cardParent.appendChild(courseCard);

            container.appendChild(cardParent);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

});

