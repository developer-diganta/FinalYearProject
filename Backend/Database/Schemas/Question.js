question = {
    title: String,
    question: String,
    question_id : String,
    course_id : String,
    answer_key_file: String,
    answer_key_file_name: String,
    input: String,
    output: String, 
    difficulty: String,
    category: String,
    tags: [String],
    dateCreated: Date,
    dateModified: Date,
    date_published: Date,
    studentsAttempted: [{
        student_id: String,
    }],
    studentsCorrect: [{
        student_id: String,
    }],
    studentsIncorrect: [{
        student_id: String,
    }],
    studentsUnattempted: [{
        student_id: String,
    }],

}

module.exports = question;
