const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tourData = await Tour.find(); 
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tourData
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const currentTour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  res.status(200).render('tour', {
    title: `${currentTour.name} Tour`,
    tour: currentTour
  });
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: ``,
  });
});
