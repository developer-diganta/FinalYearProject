moocquestion = {
    title: String,
    question: String,
    mooc: String,
    solution: String,
    solutionDescription: String,
    input: String,
    output: String,
    sampleInput: String,
    sampleOutput: String,
    difficulty: String,
    category: String,
    tags: [String],
    dateCreated: Date,
    dateModified: Date,
    date_published: Date,
    studentsAttempted: Array,
    studentsCorrect: Array,
    studentsIncorrect: Array,
    studentsUnattempted: Array,
    plagarismAnalysis: Array,
    moocassignment: String,
    score: Number,
    isdeleted: Boolean,
    deletionTime: Date
}

module.exports = moocquestion;