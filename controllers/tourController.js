const path = require('path');
const Tour = require('./../models/tourModel');

class TourController {

  async aliasTopTours(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
  };
  
  async getAllTours(req, res) {
    try{

      // Building Query 
      // 1. Filtering Query
      const queryObj = {...req.query};
      const excludedObj = ['page', 'limit', 'sort', 'fields'];
      excludedObj.forEach(el => delete queryObj[el]);

      //2.  Advanced Filtering
      //eg: http://localhost:8000/api/v1/tours?duration[gte]=9&difficulty=medium
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      queryStr = JSON.parse(queryStr);
      console.log(queryStr);

      let query = Tour.find(queryStr);
      // const query = Tour.find();

      //3. Sort
      if(req.query.sort) {
        //sorting via multiple parameters in the orders of their appearance
        //url eg: /tours?sort=price,duration,etc 
        //query.sort('price duration etc');
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      }else {
        //default sorting by -ve createdAt parameter so that the newest appears first
        query = query.sort('-createdAt'); 
      }

      //4. Field Limiting
      if(req.query.fields) {
        //selecting specific fields from the retrieved data
        //url eg: /tours?fields=price,duration,etc 
        //query.selection('price duration etc');
        const fieldsBy = req.query.fields.split(',').join(' ');
        query = query.select(fieldsBy);
      }else {
        //removing any unnecessary fields not required by any client
        query = query.select('-__v');
      }


      //5. Pagination
      const page = Number(req.query.page) || 1; // specifies the page number if multiples pages exist
      const limit = Number(req.query.limit) || 20; // specified the limit of our results
      const skip = (page-1) * limit; // skip specifies number of results that are to be skipped to reach the speicified page 
      
      //url eg: /tours?page=3&limit=10 , page1: 1-10, page2: 11-20, page3: 21-30, skip = 20, so that we react 21-30 result
      query = query.skip(skip).limit(limit);

      if(req.query.page) {
        const numTours = await Tour.countDocuments();
        if(skip > numTours) throw new Error('This page does not exist');
      }


      //EXECUTE QUERY : FINAL RESULT
      //Very importent to resolve the promise at the end so that final result can be obtained
      const tourData = await query;

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
