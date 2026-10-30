const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    description: { type: String },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
