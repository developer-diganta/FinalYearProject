const express = require("express");
const authorise = require("../../middlewares/authorise");
const controls = require("../../controller/control");

const router = express.Router();

router.get('/', controls.home);
router.get('/languages', authorise, controls.languages);
router.get('/user/verified', controls.verified);
router.get('/user/verify/:id/:uniqueString', controls.userVerify);
const path = require('path');
 
module.exports = router;
