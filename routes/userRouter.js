const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

//Protect all rotues with authentication below this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/update-my-password', authController.updateMyPassword);
router.patch('/update-my-account', userController.updateMyAccount);
router.delete('/delete-my-account', userController.deleteMyAccount);

//Since all these below routes are going to be done by admin therefor restricting it to admin
router.use(authController.restrictTo('admin'));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;