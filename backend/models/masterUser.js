const mongoose = require('mongoose');

const masterUserSchema = new mongoose.Schema({
  masterPassword: String
});

module.exports = mongoose.model('MasterUser', masterUserSchema);