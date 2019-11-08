const httpStatus = require('http-status');
const UserRatingService = require('../services/user-rating.service');

exports.getUserRating = async (req, res, next) => {
  try {
    const userRating = await UserRatingService.getUserRating(req, res, next);
    return res.status(httpStatus.OK).json({ rating: userRating });
  } catch (e) {
    next(e);
  }
};
