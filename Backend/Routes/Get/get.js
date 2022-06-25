const express = require("express");

const controls = require("../../controller/control");

const router = express.Router();

router.get('/', controls.home);
 
module.exports = router;   