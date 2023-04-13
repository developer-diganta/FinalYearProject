const jwt = require("jsonwebtoken");
require("dotenv").config();
const author = (req, res, next) => {
    const token = req.header("x-auth-token");
    console.log({ token })
    console.log("here now")
    console.log(req.body.message)
    if (!token) {
        console.log("NO TOKEN DETECTED")
        res.status(401).json({ message: "No token detected" });
    }
    else {
        jwt.verify(token, process.env.SESSION_KEY, (error, decoded) => {
            if (error) {
                console.log("Verification Failed");
                res.status(401).json({ message: "Verification Failed" });
            }
            else {
                console.log(decoded.email)
                if (req.body.email === decoded.email) {
                    console.log("Verified")
                    next();
                }
                else {
                    console.log(req.body.email)
                    res.status(401).json({ message: "Verification Failed" });
                }
            }
        })
    }
}

module.exports = author;
