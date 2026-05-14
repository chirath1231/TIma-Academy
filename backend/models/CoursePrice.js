const mongoose = require("mongoose");

const CoursePriceSchema = new mongoose.Schema({
  coursename: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("CoursePrice", CoursePriceSchema);
