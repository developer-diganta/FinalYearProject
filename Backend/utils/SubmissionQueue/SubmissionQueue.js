export default class SubmissionQueue {

    constructor() {
        this.queue = [];
        this.currentSize = 0;
    }

    addSubmission(submission) {
        this.queue.push(submission);
        this.currentSize++;
    }

    removeSubmission() {
        this.queue.shift();
        this.currentSize--;
    }

}