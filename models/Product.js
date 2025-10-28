const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: String,  // Use String ID to match existing IDs
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  promoted: {
    type: Boolean,
    default: false
  },
  promotionOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: false });

module.exports = mongoose.model('Product', productSchema);

