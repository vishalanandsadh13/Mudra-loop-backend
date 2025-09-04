require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });
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
const parseAllowedOrigins = () => {
    const fromEnv = (process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map(v => v.trim())
        .filter(Boolean);
    const defaults = [
        process.env.CLIENT_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ].filter(Boolean);
    return Array.from(new Set([...fromEnv, ...defaults]));
};

const isOriginAllowed = (origin, allowedOrigins) => {
    for (const entry of allowedOrigins) {
        if (entry.includes("*")) {
            const pattern = "^" + entry.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$";
            if (new RegExp(pattern).test(origin)) return true;
        } else if (entry === origin) {
            return true;
        }
    }
    return false;
};

app.use(cors({ origin: (origin, callback) => {
    const allowedOrigins = parseAllowedOrigins();
    if (!origin) {
        return callback(null, true);
    }
    if (isOriginAllowed(origin, allowedOrigins)) {
        return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
},
    methods: ["GET","POST","DELETE","PUT","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
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

// Health checks
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/healthz", (req, res) => {
    res.status(200).send("ok");
});


const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {    
    console.log(`Server is running on http://${HOST}:${PORT}`);
});