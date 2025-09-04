const express = require("express");
const {addIncome, getAllIncome, deleteIncome, downloadIncomeExcel} = require("../Controllers/IncomeController");
const {protect} = require("../Middleware/AuthMiddleware");

const router = express.Router();

// Route to add income
router.post("/add", protect, addIncome);
// Route to get all income
router.get("/get", protect, getAllIncome);
// Route to delete income
router.delete("/delete/:id", protect, deleteIncome);
// Route to download income as Excel
router.get("/downloadexcel", protect, downloadIncomeExcel);

module.exports = router;