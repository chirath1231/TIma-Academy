// backend/models/Purchase.js
const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  courseName: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "LKR" },
  status: { type: String, enum: ["pending","paid","failed"], default: "pending" },
  payherePaymentId: { type: String }, // payhere payment id after success
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
