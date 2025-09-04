const Income = require("../Models/Income");
const Expense = require("../Models/Expense");

const{isValidObjectId, Types} = require("mongoose");

//Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch total income and total expense for the user
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]); 

        // get income transactions int he last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) }
        }).sort({ date: -1 });  



        //get total income for last 60 days
        const IncomeLast60Days = last60DaysIncomeTransactions.reduce((sum, transaction) => {
            return sum + transaction.amount;
        }, 0);

        //get expense transactions in the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
        }).sort({ date: -1 });      
        //get total expense for last 30 days
        const ExpenseLast30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => 
            sum + transaction.amount
         , 0);      


        //fetch last 5 transactions for income and expense
        const lastTransactions = [
            ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income"
                })  
            ),
            ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense"
                })      
            )
        ].sort((a,b)=> b.date - a.date);
         // Sort by date and take the last 5 transactions

         //final response
         res.json({
            totalbalance: (totalIncome[0]?.totalIncome || 0) - (totalExpense[0]?.totalExpense || 0),
            totalIncome: totalIncome[0]?.totalIncome || 0,
            totalExpense: totalExpense[0]?.totalExpense || 0,
            last60DaysIncome: {
                transactions: last60DaysIncomeTransactions,
                total: IncomeLast60Days
            },       
            last30DaysExpense: {
                transactions: last30DaysExpenseTransactions,
                total: ExpenseLast30Days
            },
            recentTransactions: lastTransactions.slice(0, 5) // Take the last 5
        });       
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Server error" });
    }
}