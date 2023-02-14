student = {
    name: String,
    age: Number,
    university: String,
    password: String,
    gender: String,
    courses: [{
        course_id: String,
        course_grade: String,
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
}

module.exports = student;
