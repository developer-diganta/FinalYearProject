const jwt = require("jsonwebtoken");
require("dotenv").config();
const author = (req, res, next) => {
    const token = req.header("x-auth-token");
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1];
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
                if (req.email === decoded.email)
                    next();
                else
                    res.status(401).json({message:"Verification Failed"});
            }
        })
    }
}

module.exports = author;
