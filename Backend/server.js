const app = require("./index");
const PORT = require("./configs/Port");

app.listen(PORT, () => {
    console.log("Server is running on port 5000");
});