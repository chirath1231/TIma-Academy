const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   order_id: { type: String, required: true, unique: true },
//   coursename: { type: String, required: true },
//   email: { type: String, required: true },
//   amount: { type: String, required: true },
//   status: { type: String, enum: ["pending","paid","failed"], default: "pending" },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Order", OrderSchema);


const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  
  // Single course payment
  coursename: { type: String, required: false },

  // Cart payment
  items: { type: Array, required: false },

  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);


