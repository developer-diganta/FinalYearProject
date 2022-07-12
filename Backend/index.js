const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { url } = require("./Database/Connection");
const getRoutes = require("./Routes/Get/get");
const testConnection = require("./Database/connectionTest");
const postRoutes = require("./Routes/Post/post");
const { addUptimeLog } = require("./utils/logger");

addUptimeLog("Server Status: Start/Restart and UP");

setInterval(() => {
    addUptimeLog("Server Status: UP");
}, 21600000);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
mongoose.connect(url, { useNewUrlParser: true });
testConnection(url);

// console.log(getRoutes)
app.use("/", getRoutes);
app.use("/", postRoutes);
// app.use("/getLanguages", getLanguages);


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});