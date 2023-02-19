student = {
    name: String,
    age: Number,
    university: String,
    password: String,
<<<<<<< HEAD
    status: String,
    registrationNumber: String,
    rollNumber: String,
    program: String,
=======
    gender: String,
>>>>>>> 6fd0be5db1b6e8511878ca7c1393dc489f7252ac
    courses: [{
        course: String,
        courseScore: Number,
        completed: Boolean,
        completed_date: Date,
        start_date: Date,
        progress: Number,
    }],

    address: {
        city: String,
        state: String,
        country: String
    },
    email: String,
<<<<<<< HEAD
    date_of_birth: Date,
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
=======
>>>>>>> 6fd0be5db1b6e8511878ca7c1393dc489f7252ac
}

module.exports = student;
