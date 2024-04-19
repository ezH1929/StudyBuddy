const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
  // Add other fields as necessary
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
