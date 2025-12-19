//Here I import mongoose to interact with mongodb
const mongoose = require('mongoose');

//Define the schema for expenses
const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

//Created database indexes for better quary 
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

// Here I add a pre-save hook for additional validation
expenseSchema.pre('save', function(next) {
  if (this.isModified('amount') && this.amount < 0) {
    throw new Error('Amount cannot be negative');
  }
  next();
});

// Here I export the Expense model so it can be used anywhere in the application
module.exports = mongoose.model('Expense', expenseSchema);