const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,  // Use String ID to match existing IDs
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 5000
  },
  cart: [{
    productId: String,
    qty: Number
  }],
  addresses: [{
    _id: String,
    address: String
  }],
  name: {
    type: String,
    default: ""
  },
  mobile: {
    type: String,
    default: ""
  },
  orders: [{
    _id: String,
    items: [{
      productId: String,
      name: String,
      cost: Number,
      qty: Number,
      image: String
    }],
    total: Number,
    address: Object,
    date: String
  }]
}, { timestamps: false });

module.exports = mongoose.model('User', userSchema);

