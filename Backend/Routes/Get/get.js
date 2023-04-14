const express = require("express");
const authorise = require("../../middlewares/authorise");
const controls = require("../../controller/control");

const router = express.Router();

router.get('/', controls.home);
router.get('/languages', controls.languages);

// ADMIN ROUTES
router.get("/admin/universities/get", controls.adminUniversityData);

module.exports = router;
