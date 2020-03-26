module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    failure: {
      error: err.message,
      message: 'Something wrong happened'
    }
  });
}