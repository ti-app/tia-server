const { userRatingWeigh } = require('../../constants/constants.common');

const LIMIT_PLANTED = 500; // probably coming from user profile

class UserRatingService {
  async getUserRating(req, res, next) {
    try {
      let rating = 0;
      console.log('User ID', req.user.user_id);

      const numberOfPlantedTrees = 40; // fetch it from User profile/ filter tree and fetch number
      const plantingScore =
        numberOfPlantedTrees && numberOfPlantedTrees < LIMIT_PLANTED
          ? numberOfPlantedTrees / LIMIT_PLANTED
          : 1;

      console.log('plantingScore', plantingScore);
      rating = plantingScore * userRatingWeigh.treeCare;
      return rating;
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserRatingService();
