const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    name: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
    strict: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      trim: true,
      default: 'pending',
      enum: ['pending', 'preparing', 'completed', 'cancelled'],
    },
    paymentStatus: {
      type: String,
      trim: true,
      default: 'pending',
      enum: ['pending', 'paid', 'failed', 'refunded'],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

orderSchema.pre('validate', function updateTotalAmount(next) {
  if ((!this.totalAmount || this.totalAmount === 0) && Array.isArray(this.items)) {
    this.totalAmount = this.items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return sum + quantity * price;
    }, 0);
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
