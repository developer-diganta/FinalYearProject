require("dotenv").config();
const jwt = require("jsonwebtoken");
const token = (userName, email) => {
    console.log("QQQ",userName,email)
    return jwt.sign({ userName, email }, process.env.SESSION_KEY, { expiresIn: "1h" });
}
module.exports = token;