teacher = {
    name : String,
    username : String,
    teacher_id : String,
    email : String,
    password : String,
    university : String,
    phone : String,
    stream: String,
    status:String,
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

module.exports = teacher;