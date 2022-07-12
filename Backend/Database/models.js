const mongoose = require("mongoose");

const admin = require("./Schemas/Admin");
const course = require("./Schemas/Course");
const teacher = require("./Schemas/Teacher");
const student = require("./Schemas/Student");
const university = require("./Schemas/University");
const question = require("./Schemas/Question");
const submission = require("./Schemas/Submission");
const uptimeLogs = require("./Schemas/UptimeLogs");

const adminSchema = new mongoose.Schema(admin);
const courseSchema = new mongoose.Schema(course);
const teacherSchema = new mongoose.Schema(teacher);
const studentSchema = new mongoose.Schema(student);
const universitySchema = new mongoose.Schema(university);
const questionSchema = new mongoose.Schema(question);
const submissionSchema = new mongoose.Schema(submission);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const University = mongoose.model("University", universitySchema);
const Question = mongoose.model("Question", questionSchema);
const Submission = mongoose.model("Submission", submissionSchema);
const UptimeLogs = mongoose.model("UptimeLogs", uptimeLogs);

module.exports = {Admin, Course, Teacher, Student, University, Question, Submission, UptimeLogs};