const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
  {
    website: String,
    username: String,
    password: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Password', passwordSchema);
