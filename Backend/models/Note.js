const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
