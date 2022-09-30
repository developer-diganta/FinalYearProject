const express = require("express");
const authorise = require("../../middlewares/authorise");
const controls = require("../../controller/control");

const router = express.Router();

// router.post('/', controls.home);
router.post('/submit', controls.submit);

router.post('/signup/teacher', controls.signupTeacher);

router.post("/admin/signin", controls.adminSignIn);
 
module.exports = router; 