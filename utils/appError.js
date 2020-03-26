class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.isOpertationalError = true;

    Error.captureStackTrace(this, this.constructor); // To prevent the constructor call to be excluded from the stackTrace of the Error and thus prevent from polluting the stackTrace
  }
}

module.exports = AppError;