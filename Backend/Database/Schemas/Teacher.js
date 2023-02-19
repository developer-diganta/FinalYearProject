teacher = {
    name : String,
    username : String,
    teacher_id : String,
    email : String,
    password : String,
    university : String,
    phone : String,
    department: String,
    status:String,
    dept : [
        {
            dept_id : String,
            dept_name : String
        }
    ],
    courses : Array
}

module.exports = teacher;