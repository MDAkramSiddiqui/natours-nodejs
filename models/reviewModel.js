const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

reviewSchema.statics.calculateAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if(stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: stats[0].nRating,
      ratingQuantity: stats[0].avgRating
    });
  }else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingAverage: 4.5,
      ratingQuantity: 0
    });
  }
  
}

//next() is not available for the post option of this middleware only for pre
reviewSchema.post('save', async function() {
  //this.constructor points to the current model i.e. Review and this points to the current review
  await this.constructor.calculateAverageRatings(this.tour);
});

//findByIdAndUpdate
//findByIdAndDelete
//creating middleware for deleting and updating reviews and thus update the Tour as well
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function(next) {
  await this.r.constructor.calculateAverageRatings(this.r.tour);
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;