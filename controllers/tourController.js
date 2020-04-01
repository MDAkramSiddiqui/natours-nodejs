const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const toursData = await features.query;

//   // SEND RESPONSE
//   return res.status(200).json({
//     success: {  
//       result: tourData.length,
//       data: tourData
//     }
//   });
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await (await Tour.findById(req.params.id)).populate('reviews');
//   // Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   return res.status(200).json({
//     success: {
//       data: tour
//     }
//   });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   return res.status(200).json({
//     success: {
//       data: newTour
//     }
//   });
// });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!updatedTour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   return res.status(200).json({
//     success: {
//       data: updatedTour
//     }
//   });
// });

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   return res.status(204).json({
//     success: {
//       data: null,
//       message: 'Data has been deleted'
//     }
//   });
// });

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);


exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  return res.status(200).json({
    success: {
      result: stats.length,
      data: {
        stats
      },
      message: 'Aggregated Data Recieved'
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  return res.status(200).json({
    success: {
      result: plan.length,
      data: {
        plan
      },
      message: 'Aggregated Data Recieved'
    }
  });
});


exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlong, unit } = req.params;
  const [ latitude, longitude ] = latlong.split(',');

  if(!latitude || !longitude) next(new AppError('Please provide the latitude and longitude in the specified format, lat,long', 400));

  //radians unit is required as per the documentation of mongo db which distance / radius of earth
  const radius = unit === 'mi' ? distance/3963.2 : distance/6378.1;
  const tourData = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } } });
  
  res.status(200).json({
    success: {
      results: tourData.length,
      data: tourData,
      message: 'Tours within your specified radius obtained successfully.'
    }
  });
});

exports.getToursDistances = catchAsync(async (req, res, next) => {
  const { distance, latlong, unit } = req.params;
  const [ latitude, longitude ] = latlong.split(',');

  if(!latitude || !longitude) next(new AppError('Please provide the latitude and longitude in the specified format, lat,long', 400));

  const mult = unit === 'mi' ? 0.000621371 : 0.001;
  
  const tourData = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude * 1, latitude * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: mult
      }
    }, 
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);
  
  res.status(200).json({
    success: {
      results: tourData.length,
      data: tourData,
      message: 'Tours distances has been obtained successfully.'
    }
  });
});