const mangoose = require("mongoose");

const expenseSchema = new mangoose.Schema(
  {
    userId: {
      type: mangoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    icon: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/2917/2917560.png",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mangoose.model("Expense", expenseSchema);
