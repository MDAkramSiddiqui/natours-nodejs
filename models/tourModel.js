const mongoose = require('mongoose');

const { Schema } = mongoose;

const TourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour name is required'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour duration is required']
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'A tour maxGroupSize is required']
  },
  difficulty: {
    type: String,
    require: [true, 'A tour difficulty is required']
  },
  ratingAverage: {
    type: Number,
    default: 4.5
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour price is required']
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    required: [true, 'A tour summary is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour imageCover is required']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
});

module.exports = mongoose.model('Tour', TourSchema);