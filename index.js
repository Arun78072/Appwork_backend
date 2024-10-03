const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Transaction = require("./component/model/Transaction");

const app = express();
app.use(cors());
app.use(express.json());

const dbUrl =
  "mongodb+srv://uic19mca8112:bdny4KcdUirS3xuK@cluster0.izefw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.error("DB connection error:", err));

app.post("/add_transaction", async (req, res) => {
  try {
    const { type, amount, description } = req.body;

    const allTransactions = await Transaction.find({});
    const lastTrans = allTransactions.length > 0 ? allTransactions[allTransactions.length - 1] : {};

    const newTransactionData = {
      credit: type === "Credit" ? amount : 0,
      debit: type === "Debit" ? amount : 0,
      description,
      runningBalance:
        type === "Credit"
          ? (lastTrans.runningBalance || 0) + Number(amount)
          : (lastTrans.runningBalance || 0) - Number(amount),
    };

    const newTransaction = new Transaction(newTransactionData);
    const savedTransaction = await newTransaction.save();

    res.status(201).json({
      message: "Transaction added successfully",
      data: savedTransaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).send("Failed to add transaction");
  }
});

app.get("/get_transaction", async (req, res) => {
  try {
    const allTransactions = await Transaction.find({});
    res.status(200).json(allTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Failed to fetch transactions");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
