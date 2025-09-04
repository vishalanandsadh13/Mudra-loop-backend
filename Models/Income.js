const mangoose = require("mongoose");

const incomeSchema = new mangoose.Schema({
  userId: {
    type: mangoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},{
    timestamps: true,
});

module.exports = mangoose.model("Income", incomeSchema);