Teacher = {
    name : String,
    user_name : String,
    teacher_id : String,
    email : String,
    password : String,
    unv_name : String,
    phone : String,
    stream : String,
    dept : [
        {
            dept_id : String,
            dept_name : String
        }
    ],
    courses : [{
        course_id : String
    }]
}