student = {
    name: String,
    age: Number,
    university: String,
    password: String,
    status: String,
    courses: [{
        course_id: String,
        course_name: String,
        course_grade: Number,
        completed: Boolean,
        completed_date: Date,
        start_date: Date,
        progress: Number,
    }],
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    phone: String,
    email: String,
    date_of_birth: Date,
    stream: String,
    admission_date: Date,
    graduation_date: Date,
    graduation_status: String,
    graduation_status_date: Date,
    progress:{
        progress_id: String,
        progress_name: String,
        progress_grade: Number,
        completed: Boolean,
        completed_date: Date,
        start_date: Date,
    },
    submissions:Array
}

module.exports = student;