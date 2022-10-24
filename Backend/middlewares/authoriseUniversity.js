const jwt = require("jsonwebtoken");
require("dotenv").config();
const author = (req, res, next) => {
    const token = req.header("x-auth-token");
    console.log(req.body)
    if(!token){
        console.log("NO TOKEN DETECTED")
        res.status(401).json({message:"No token detected"});
    }
    else{
        jwt.verify(token, process.env.SESSION_KEY, (error, decoded) => {
            if (error) {
                console.log("Verification Failed");
                res.status(401).json({message:"Verification Failed"});
            }
            else {
                console.log(decoded.userName,req.email)
                if (req.body.email === decoded.userName && req.body.phone === decoded.email)
                    next();
                else
                    res.status(401).json({message:"Verification Failed"});
            }
        })
    }
}

module.exports = author;