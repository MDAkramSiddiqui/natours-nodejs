const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('./../utils/appError');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No Doc found with that ID', 404));
  }

  return res.status(204).json({
    success: {
      data: null,
      message: 'Doc has been deleted successfully.'
    }
  });
});


exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedDoc) {
    return next(new AppError('No Document found with that ID', 404));
  }

  return res.status(200).json({
    success: {
      data: updatedDoc
    }
  });
});


exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  return res.status(200).json({
    success: {
      data: doc
    }
  });
});


exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if(populateOptions) query = query.populate(populateOptions);
  const doc = await query;
  // const tour = await (await Tour.findById(req.params.id)).populate('reviews');
  // Tour.findOne({ _id: req.params.id })

  if (!doc) {
    return next(new AppError('No Document found with that ID', 404));
  }

  return res.status(200).json({
    success: {
      data: doc
    }
  });
});


exports.getAll = Model => catchAsync(async (req, res, next) => {

  //For nested reviews get route
  let filter = {};
  if(req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // SEND RESPONSE
  return res.status(200).json({
    success: {  
      result: doc.length,
      data: doc
    }
  });
});
