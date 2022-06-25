const express = require("express");
const app = express();
const cors = require("cors");

const getRoutes = require("./Routes/Get/get");
// const postRoutes = require("./Routes/Post/post");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

app.use("/", getRoutes);


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});