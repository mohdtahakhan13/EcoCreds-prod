const mongoose = require('mongoose');

const SecondhandProductSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:          { type: String, required: true },
  description:   { type: String },
  image:         { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  expiryDate:    { type: Date },
  status:        { type: String, enum: ['available','sold','expired'], default: 'available' },
  buyer:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldAt:        { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('SecondhandProduct', SecondhandProductSchema);