const Expense = require("../Models/Expense");
const xlsx = require("xlsx");


exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation check for missing expense
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        // Create a new expense entry
        const newExpense = new Expense({
            userId,
            category,
            amount,
            date: new Date(date), // Ensure date is a Date object
            icon
        });
        await newExpense.save();
        res.status(200).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        // Fetch all expense entries for the user
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json({ message: "Expenses fetched successfully", expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        const data = expenses.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: new Date(expense.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
        }));
        
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expenses");
        
        // Generate buffer instead of writing to file
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        // Set proper headers for Excel download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=expense_details.xlsx');
        res.setHeader('Content-Length', buffer.length);
        
        res.send(buffer);
    } catch (error) {
        console.error("Error downloading expenses as Excel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}