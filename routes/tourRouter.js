const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

// Middlewares
// router.param('id', tourController.checkId);
router.route('/top-5-cheap')
  .get(
    tourController.aliasTopTours,
    tourController.getAllTours
    );

// Main Routes
router.route('/tour-stats')
  .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
	.get(tourController.getMonthlyPlan);

router.route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router.route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.checkAuthority,
    tourController.deleteTour);

module.exports = router;