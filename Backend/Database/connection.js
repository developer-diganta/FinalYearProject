require('dotenv').config();
let url;
console.log(process.env.MONGO_TEST_PASSWORD)
if (process.env.ENVIRONMENT === "TEST") {
    url = "mongodb+srv://" + process.env.MONGO_TEST_USERNAME + ":" + process.env.MONGO_TEST_PASSWORD + "@cluster0.wyqvltm.mongodb.net/?retryWrites=true&w=majority";
}
else {
    url = "mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@cluster0.npe3b.mongodb.net/?retryWrites=true&w=majority";
}

module.exports = { url };