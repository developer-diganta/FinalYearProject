question = {
    title: String,
    question: String,
    question_id : String,
    course_id : String,
    answer_key_file: String,
    answer_key_file_name: String,  
    difficulty: String,
    category: String,
    tags: [String],
    date_created: Date,
    date_updated: Date,
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
