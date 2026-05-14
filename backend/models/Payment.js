const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  coursename: { type: String, required: true },
  order_id: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, required: true }, // Paid, Failed
  payhere_payment_id: { type: String }, // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
