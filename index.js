const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());

const toursData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data/data/tours-simple.json'))
);

//get request

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    success: {
      data: toursData
    }
  });
});


//post request

app.post('/api/v1/tours', (req, res) => {
  const id = toursData[toursData.length-1].id + 1;
  const tour = req.body;
  const newTour = Object.assign({ id }, tour);
  res.status(200).json({
    success: {
      data: newTour
    }
  });
});


//put request

app.put('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);
  const oldTour = toursData.find(el => el.id === id);
  
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

  const tour = req.body;
  const newTour = Object.assign({ id }, tour);

  res.status(200).json({
    success: {
      data: newTour
    }
  });
});


//patch request

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);
  const oldTour = toursData.find(el => el.id === id);
  
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
});


// delete request

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id);
  const oldTour = toursData.find(el => el.id === id);
  
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

});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});