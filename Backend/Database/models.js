const mongoose = require("mongoose");
const passport = require("passport");

const passportLocalMongoose = require("passport-local-mongoose");
const admin = require("./Schemas/Admin");
const course = require("./Schemas/Course");
const teacher = require("./Schemas/Teacher");
const student = require("./Schemas/Student");
const university = require("./Schemas/University");
const question = require("./Schemas/Question");
const submission = require("./Schemas/Submission");
const uptimeLogs = require("./Schemas/UptimeLogs");
const submissionLogs = require("./Schemas/SubmissionLogs");
const schools = require("./Schemas/School");
const department = require("./Schemas/Department");
const program = require("./Schemas/Program");
const assignment = require("./Schemas/Assignment");
const moocs = require("./Schemas/Moocs");


const adminSchema = new mongoose.Schema(admin);
const courseSchema = new mongoose.Schema(course);
const teacherSchema = new mongoose.Schema(teacher);
const studentSchema = new mongoose.Schema(student);
const universitySchema = new mongoose.Schema(university);
const questionSchema = new mongoose.Schema(question);
const submissionSchema = new mongoose.Schema(submission);
const schoolsSchema = new mongoose.Schema(schools);
const departmentSchema = new mongoose.Schema(department);
const programSchema = new mongoose.Schema(program);
const assignmentSchema = new mongoose.Schema(assignment);
const moocsSchema = new mongoose.Schema(moocs);
// teacherSchema.plugin(passportLocalMongoose);


const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const University = mongoose.model("University", universitySchema);
const Question = mongoose.model("Question", questionSchema);
const Submission = mongoose.model("Submission", submissionSchema);
const UptimeLogs = mongoose.model("UptimeLogs", uptimeLogs);
const SubmissionLogs = mongoose.model("SubmissionLogs", submissionLogs);
const School = mongoose.model("School", schoolsSchema);
const Department = mongoose.model("Department", departmentSchema);
const Program = mongoose.model("Program", programSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema)
const Moocs = mongoose.model("Moocs", moocsSchema);
// passport.use(Teacher.createStrategy());
// passport.serializeUser(Teacher.serializeUser());
// passport.deserializeUser(Teacher.deserializeUser());
module.exports = {
    Admin,
    Course,
    Teacher,
    Student,
    University,
    Question,
    Submission,
    UptimeLogs,
    SubmissionLogs,
    School,
    Department,
    Program,
    Assignment,
    Moocs
};