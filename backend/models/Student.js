const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: String,
    regno: String,
    marks: Number,
    address: String,
    email: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
