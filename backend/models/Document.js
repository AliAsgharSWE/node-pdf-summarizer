const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  originalFile: String,
  parsedText: String,
  summary: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);
