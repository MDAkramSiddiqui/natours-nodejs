// WE can also break error to have more explained error in development phase and less and only message oriented errors in production phase
/** 
 * FOR PRODUCTION
 if(err.isOperationalError) {
  //normal error handling
  // That is we want only programming errors to be want to displayed as simple message not the operational error for operational error we want to send them normal and descriptive to client as well
 }else {
    console.error(err); // So that we can still see the error in the console of our platoform where we deployed the application
    res.status(500).json({
      failure: {
        error: 'Something went wrong'
      }
    });
  }
 }
 
*/

module.exports = (err, req, res, next) => {

  if(err.name === 'JsonWebTokenError') err.statusCode = 401;
  else if(err.name === 'TokenExpiredError') err.statusCode = 401;
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    failure: {
      error: err.message,
      message: 'Something wrong happened',
      stack: err.stack
    }
  });
}