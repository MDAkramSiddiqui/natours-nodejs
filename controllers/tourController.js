const path = require('path');
const fs = require('fs');

class TourController {
  constructor() {
    this.toursData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../dev-data/data/tours-simple.json'))
    );
  }

  async checkId(req, res, next, val) {
    if(Number(id) > this.toursData.length) {
      return res.json({
        failure: {
          data: null
        },
        error: 'Invalid ID'
      });
    }
    next();
  }

  async checkBody(req, res, next) {
    if(!req.body.name || !req.body.price) {
      return res.json({
        failure: {
          data: null
        },
        error: 'No name or price provided for the given tour'
      });
    }
    next();
  }
  
  async getAllTours(req, res) {
    return res.status(200).json({
      success: {
        data: 'data',
        requestTime: req.time
      }
    });
  }
  
  
  //post request
  
  async createTour(req, res) {
    // const id = this.toursData[this.toursData.length-1].id + 1;
    const id = 1;
    const tour = req.body;
    const newTour = Object.assign({ id }, tour);
    return res.status(200).json({
      success: {
        data: newTour
      }
    });
  }
  
  async getTour(req, res) {
    const id = Number(req.params.id);
    // const tour = this.toursData.find(el => el.id === id);
    const tour = true;
    if(!tour) {
      return res.status(500).json({
        failure: {
          data: []
        },
        error: [
          'Invalid tourID'
        ]
      });
    }
  
    res.status(200).json({
      success: {
        data: tour
      }
    });
  }
  
  
  //put request
  
  async updateTour(req, res) {
    const id = Number(req.params.id);
    const oldTour = this.toursData.find(el => el.id === id);
    
    if(!oldTour) {
      res.status(500).json({
        failure: {
          data: []
        },
        error: [
          'Invalid tourID'
        ]
      });
    }
  
    res.status(200).json({
      success: {
        data: 'Data has been updated'
      }
    });
  }
  
  
  // delete request
  
  async deleteTour(req, res) {
    const id = Number(req.params.id);
    const oldTour = this.toursData.find(el => el.id === id);
    
    if(!oldTour) {
      res.status(500).json({
        failure: {
          data: []
        },
        error: [
          'Invalid tourID'
        ]
      });
    }
  
    res.status(204).json({
      success: {
        data: 'Data has been deleted'
      }
    });
  
  }
}

module.exports = new TourController();
