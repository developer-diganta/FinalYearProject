const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { url } = require("./Database/Connection");
const getRoutes = require("./Routes/Get/get");
const testConnection = require("./Database/connectionTest");
const postRoutes = require("./Routes/Post/post");
const patchRoutes = require("./Routes/Patch/patch");
const { addUptimeLog } = require("./utils/logger");
const limiter = require("./configs/rate-limit-config");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const sessionConig = require("./configs/session-config");
const authorise = require("./middlewares/authorise");

addUptimeLog("Server Status: Start/Restart and UP");

setInterval(() => {
    addUptimeLog("Server Status: UP");
}, 21600000);



app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(helmet());
// app.use(session(sessionConig));
// app.use(passport.initialize());
// app.use(passport.session());
mongoose.connect(url, { useNewUrlParser: true });
testConnection(url);

app.use(limiter(1, 1));

// console.log(getRoutes)
app.use("/", getRoutes);
app.use("/", postRoutes);
app.use("/", patchRoutes);
// app.use("/getLanguages", getLanguages);

module.exports = app;