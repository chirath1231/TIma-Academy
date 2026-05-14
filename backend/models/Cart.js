const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  email: { type: String, required: true },
  coursename: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model("Cart", CartSchema);
