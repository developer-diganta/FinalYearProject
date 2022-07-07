const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { url } = require("./Database/Connection");
const getRoutes = require("./Routes/Get/get");
const testConnection = require("./Database/connectionTest");
const admin = require("./Database/Schemas/Admin");
const course = require("./Database/Schemas/Course");
const teacher = require("./Database/Schemas/Teacher");
const student = require("./Database/Schemas/Student");
const university = require("./Database/Schemas/University");
const question = require("./Database/Schemas/Question");
// const postRoutes = require("./Routes/Post/post");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
mongoose.connect(url, { useNewUrlParser: true });
testConnection(url);

const adminSchema = new mongoose.Schema(admin);
const courseSchema = new mongoose.Schema(course);
const teacherSchema = new mongoose.Schema(teacher);
const studentSchema = new mongoose.Schema(student);
const universitySchema = new mongoose.Schema(university);
const questionSchema = new mongoose.Schema(question);

const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Student = mongoose.model("Student", studentSchema);
const University = mongoose.model("University", universitySchema);
const Question = mongoose.model("Question", questionSchema);

app.use("/", getRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});