require("dotenv").config();
const jwt = require("jsonwebtoken");
const token = (email) => {
    console.log(email)
    return jwt.sign({ email }, process.env.SESSION_KEY, { expiresIn: "1h" });
}
module.exports = token;