const { boolean } = require("joi");

teacher = {
    name : String,
    username : String,
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
    }],
    verified: Boolean,
}

module.exports = teacher;