require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const connectDB = require("./Config/db");
const authRoutes = require("./Routes/AuthRoutes");
const incomeRoutes = require("./Routes/IncomeRoutes");
const expenseRoutes = require("./Routes/ExpenseRoutes");
const dashboardRoutes = require("./Routes/DashboardRoutes");

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*",
    methods: ["GET","POST","DELETE","PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);

//income
app.use("/api/v1/income", incomeRoutes);

//expense
 app.use("/api/v1/expense", expenseRoutes);

 //Dashboard
 app.use("/api/v1/dashboard", dashboardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});