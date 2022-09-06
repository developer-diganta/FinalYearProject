require('dotenv').config();
const session = {
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
};

module.exports = session;