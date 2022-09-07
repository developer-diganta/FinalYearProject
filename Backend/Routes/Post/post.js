const express = require("express");

const controls = require("../../controller/control");

const router = express.Router();

// router.post('/', controls.home);
router.post('/submit', controls.submit);
 
module.exports = router;