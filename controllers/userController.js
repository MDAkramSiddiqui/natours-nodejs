const User = require('./../models/userModel');
const ApiFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const userData = await User.find();
  return res.status(200).json({
    success: {
      data: userData,
      message: 'List of all users retrieved successfully'
    }
  });
});


exports.createUser = catchAsync(async (req, res, next) => {

  return res.status(200).json({
    success: {
      data: null,
      message: 'Route Not Implemented Yet'
    }
  });
});


exports.getUser = catchAsync(async (req, res, next) => {

  return res.status(200).json({
    success: {
      data: null,
      message: 'Route Not Implemented Yet'
    }
  });
});


exports.updateUser = catchAsync(async (req, res, next) => {

  return res.status(200).json({
    success: {
      data: null,
      message: 'Route Not Implemented Yet'
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {

  return res.status(200).json({
    success: {
      data: null,
      message: 'Route Not Implemented Yet'
    }
  });
});