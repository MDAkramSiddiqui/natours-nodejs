const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_LIMIT });
}

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  //changing the above code so that if we are having roles as admin or normal user so that every user cannot become admin by sending the data into the request body so we are going to take only data that we need
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    success: {
      token,
      data: newUser,
      message: 'New User Created'
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) return next(new AppError('User email and password is required', 400));
  
  const user = await User.findOne({ email }).select('+password'); // because password is set to be selected as false from the database hence needed to selected specifically
  
  if(!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    success: {
      token,
      data: {},
      message: 'Logged in successfully'
    }
  });
});
