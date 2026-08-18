const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);