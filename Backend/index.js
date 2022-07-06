const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { url } = require("./Database/Connection");
const getRoutes = require("./Routes/Get/get");
const testConnection = require("./Database/connectionTest");
// const postRoutes = require("./Routes/Post/post");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
mongoose.connect(url, { useNewUrlParser: true });
testConnection(url);

app.use("/", getRoutes);


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});