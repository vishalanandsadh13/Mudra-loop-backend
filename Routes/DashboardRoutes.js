const express = require("express");
const { getDashboardData } = require("../Controllers/DashboardController");
const { protect } = require("../Middleware/AuthMiddleware");

const router = express.Router();

router.get("/", protect, getDashboardData);

module.exports = router;