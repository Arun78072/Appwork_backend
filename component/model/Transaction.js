const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  credit: {
    type: Number,
  },
  debit: {
    type: Number,
  },
  runningBalance: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
