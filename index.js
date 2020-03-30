const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mognoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');


const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this user, kindly try again after 1 hour!!!'
});

//Global Middlewares

//Set security HTTP headers
//This function call will return a function that will be used as we do not place function call inside middleware, we provide function inside middleware
app.use(helmet()); 

//Development logging 
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Express rate limiting for api route
app.use('/api', limiter);

// Body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization from NoSQL query injection
/**
 * eg. Here the qeury will always be true and thus by guessing random password we can log in without even knowing email
{
	"email": {"$gt": ""},
	"password": "randomString"
}
*/
app.use(mognoSanitize());

//Data sanitization from XSS
app.use(xss());

//Preventing parameter pollution 
app.use(hpp({
  whitelist: ['duration', 'ratingAverage', 'ratingQuantity', 'maxGroupSize', 'difficulty', 'price']
}));

//Serving Static files
app.use(express.static(path.join(__dirname, 'public')));

//Testing purposes
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