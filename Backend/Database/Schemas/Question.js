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
    students_attempted: [{
        student_id: String,
    }],
    students_correct: [{
        student_id: String,
    }],
    students_incorrect: [{
        student_id: String,
    }],
    students_unattempted: [{
        student_id: String,
    }],

}

module.exports = question;
