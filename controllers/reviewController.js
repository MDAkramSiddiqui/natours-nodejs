const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    success: {
      results: reviews.length,
      data: reviews,
      message: "Route not implemented Yet."
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(200).json({
    success: {
      data: newReview,
      message: "Route not implemented Yet."
    }
  });
});