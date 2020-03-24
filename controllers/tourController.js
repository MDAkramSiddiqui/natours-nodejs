const path = require('path');
const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apiFeatures');

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
      const tourData = await features.tourData;

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
      const tour = await Tour.findById(req.params.id);
      return res.status(200).json({
        success: {
          data: tour
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
  
  
  //patch request
  
  async updateTour(req, res) {
    try{
      const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      await Tour.findByIdAndDelete(req.params.id);
      return res.status(204).json({
        success: {
          data: null,
          message: 'Data has been deleted'
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
}

module.exports = new TourController();
