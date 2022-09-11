const express = require("express");
const authorise = require("../../middlewares/authorise");
const controls = require("../../controller/control");

const router = express.Router();

router.get('/', controls.home);
router.get('/languages', controls.languages);
 
module.exports = router;
