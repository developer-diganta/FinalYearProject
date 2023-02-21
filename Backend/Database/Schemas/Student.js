student = {
    name: String,
    age: Number,
    university: String,
    password: String,
    status: String,
    registrationNumber: String,
    rollNumber: String,
    program: String,
    gender: String,
    
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
    submission:Array
}

module.exports = student;
