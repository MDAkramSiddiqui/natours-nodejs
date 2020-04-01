const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  review: {
    type: String,
    required: [true, 'A tour review is required']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'A tour review rating is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A review must belong to a tour.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user.']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {

  //Caution: If I use Tour or User instead of tour or user it will not populate as we are specifying the fields that we want populate
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  //Because we do not want to create a populate chain eg. getTour will populate all its related reviews which will further populate tour and user
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
}); 

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;