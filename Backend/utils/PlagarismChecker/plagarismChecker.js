const stringSimilarity = require('string-similarity');

class PlagiarismChecker {
  constructor(submissions, studentId) {
    this.submissions = submissions;
    this.studentId = studentId;
    this.results = [];
  }

  check() {
    for (const submission of this.submissions) {
      const scores = [];
      // console.log({ submission })
      for (const compareSubmission of this.submissions) {
        console.log(compareSubmission)
        console.log(compareSubmission.student.toString())
        // console.log({check:compareSubmission.student.toString() === this.studentId.toString()})
        if (compareSubmission.student.toString() === this.studentId.toString()) {
          continue;
        }
        const similarityScore = stringSimilarity.compareTwoStrings(submission.code, compareSubmission.code);
        // console.log({similarityScore})
        scores.push({
          studentId: compareSubmission.student.toString(),
          code: compareSubmission.code,
          similarityScore,
          isPlagiarized: similarityScore >= 0.75
        });
      }
      this.results.push({
        submissionId: submission._id.toString(),
        studentId: submission.student.toString(),
        code: submission.code,
        scores,
        isPlagiarized: scores.some(result => result.isPlagiarized)
      });
    }
    console.log({ results: this.results });
    return this.results;
  }
}

module.exports = PlagiarismChecker;