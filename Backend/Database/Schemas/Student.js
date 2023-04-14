student = {
    name: String,
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
    moocs: [{
        mooc: String,
        moocScore: Number,
        completed: Boolean,
        completed_date: Date,
        start_date: Date,
        progress: Number,
    }],
    email: String,
    submissions: Array,
    isdeleted: Boolean,
    deletionTime: Date
}

module.exports = student;
