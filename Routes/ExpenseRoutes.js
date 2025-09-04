const express = require("express");
const {addExpense, getAllExpense, deleteExpense, downloadExpenseExcel} = require("../Controllers/ExpenseController");
const {protect} = require("../Middleware/AuthMiddleware");

const router = express.Router();

// Route to add Expense
router.post("/add", protect, addExpense);
// Route to get all income
router.get("/get", protect, getAllExpense);
// Route to delete income
router.delete("/delete/:id", protect, deleteExpense);
// Route to download income as Excel
router.get("/downloadexcel", protect, downloadExpenseExcel);

module.exports = router;