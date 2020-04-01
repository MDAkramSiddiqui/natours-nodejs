const path = require('path');
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

class TourController {

  async aliasTopTours(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
  };
  
  async getAllTours(req, res) {
    try{
      
      //EXECUTE QUERY : FINAL RESULT
      const features = new ApiFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
        // we have to return this from the previous function to use this kind of chain network
      const tourData = await features.query;

      return res.status(200).json({
        success: {  
          result: tourData.length,
          data: tourData
        }
      });
    }catch(err) {
      return res.status(500).json({
        failure: {
          errors: err
        }
      });
    }
  }
  
  
  //post request
  
  async createTour(req, res) {    
    try {
      const newTour = await Tour.create(req.body);
      return res.status(200).json({
        success: {
          data: newTour
        }
      });
    }catch(err) {
      return res.status(500).json({
        failure: {
          errors: err
        }
      });
    }
  }
  
  async getTour(req, res) {
    try{
      // const tour = await Tour.findOne({ _id: req.params.id });
      const tour = await Tour.findById(req.params.id).populate('reviews');
      if(!tour) throw new AppError('No tour found for this ID', 404);
      
      return res.status(200).json({
        success: {
          data: tour
        }
      });
    }catch(err) {
      console.log(err)
      return res.status(err.statusCode || 500).json({
        failure: {
          errors: err.message,
          message: 'Some Error Happened'
        }
      });
    }
  }
  
  
  //patch request
  
  async updateTour(req, res) {
    try{
      const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      return res.status(200).json({
        success: {
          data: updatedTour
        }
      });
    }catch(err) {
      return res.status(500).json({
        failure: {
          errors: err
        }
      });
    }
  }
  
  
  // delete request
  
  async deleteTour(req, res) {
    try{
      const tour = await Tour.findByIdAndDelete(req.params.id);
      if(!tour) throw new AppError('No tour found for this ID', 404);

      return res.status(204).json({
        success: {
          data: null,
          message: 'Data has been deleted'
        }
      });
    }catch(err) {
      return res.status(err.statusCode || 500).json({
        failure: {
          errors: err.message,
          message: 'Something Wrong Happened'
        }
      });
    }  
  }

  async getTourStats(req, res) {
    try {
      const stats = await Tour.aggregate([
        {
          $match: { ratingAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            // _id: null,
            // _id: '$difficulty',
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            avgRating: { $avg: '$ratingAverage' },
            avgPrice: { $avg: '$price' },
            maxPrice: { $max: '$price' },
            minPrice: { $min: '$price' }
          }
        },
        {  
          $sort: { avgPrice: 1 }
        }
        // {
        //   //Further extending the mongo pipeline just for undetstanding that all above stages can be repeated as well
        //   $match: { _id: { $ne: 'EASY' } }
        // }
      ]);
      return res.status(200).json({
        success: {
          result: stats.length,
          data: stats,
          message: 'Aggregated Data Recieved'
        }
      });
    }catch(err) {
      return res.status(404).json({
        failure: {
          message: 'Some error Occured',
          errors: err
        }
      });
    }
  }

  async getMonthlyPlan(req, res) {
    try{
      const year = Number(req.params.year);
      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${ year }-01-01`),
              $lte: new Date(`${ year }-12-31`) 
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numTours: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields: { month: '$_id'}
        },
        {
          $project: {
            _id: 0 // 0 for disabling the projection of the variable _id, means it exists but not diplayed
          }
        },
        {
          $sort: { numTours: -1 } //-1 for descending order
        },
        {
          $limit: 6 // limit the number that are displayed 
        }
      ]);

      return res.status(200).json({
        success: {
          result: plan.length,
          data: plan,
          message: 'Aggregated Data Recieved'
        }
      });
    }catch(err) {
      return res.status(404).json({
        failure: {
          message: 'Some error Occured',
          errors: err
        }
      });
    }
  }
}

module.exports = new TourController();
