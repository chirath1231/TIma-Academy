const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    coursename: { type: String, required: true },
    videonumber: { type: Number, required: true },
    videolink: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
