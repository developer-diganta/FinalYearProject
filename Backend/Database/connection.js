require("dotenv").config();

const url = "mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@cluster0.npe3b.mongodb.net/?retryWrites=true&w=majority";

module.exports = { url };