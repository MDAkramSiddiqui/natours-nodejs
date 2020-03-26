const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


//Middlewares

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // Method 1
  // return res.status(404).json({
  //   failure: {
  //     message: `Requested URL: ${req.originalUrl} cannot be found on this Server`
  //   }
  // });

  // Method 2
  // const err = new Error(`Requested URL: ${req.originalUrl} cannot be found on this Server`);
  // err.statusCode = 404;

  // next(err); // whatever is passed into next() is always treated as error

  //Method 3
  next(new AppError(`Requested URL: ${req.originalUrl} cannot be found on this Server`, 404));

});

// For handling errors, 4 arguments means error handling
app.use(globalErrorHandler);

module.exports = app;