const mongoose = require('mongoose');

const ingredientRequestSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  flavor: {
    type: String,
    required: true
  },
  ingredient: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  },
  processedDate: {
    type: Date
  },
  processedBy: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IngredientRequest', ingredientRequestSchema);