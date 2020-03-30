const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const filterUpdateObject = (obj, allowedFields) => {
  let newFilteredObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newFilteredObj[el] = obj[el];
  });
  return newFilteredObj;
}

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


exports.updateMyAccount = catchAsync(async (req, res, next) => {
    // const currentUser = await User.findById(req.user.id); //req.user._id is same because mongoose create a virtual property called id that maps to the schema _id property automatically
    const ALLOWED_UPDATE_FIELDS = ['name', 'email'];
    const filteredObj = filterUpdateObject(req.body, ALLOWED_UPDATE_FIELDS);
    const updatedCurrentUser = await User.findByIdAndUpdate(req.user.id, filteredObj, { new: true, runValidators: true });
    console.log(filteredObj);
  
    return res.status(200).json({
      success: {
        data: updatedCurrentUser,
        message: 'You have successfully updated your account.'
      }
    });
});


exports.deleteMyAccount = catchAsync(async (req, res, next) => {
  
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    success: {
      data: null,
      message: 'You have successfully deleted your account.'
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