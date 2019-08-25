const Joi = require('joi');
const { treeHealth } = require('../../constants');
const toArry = require('../utils/to-array');

const allowedHealth = toArry(treeHealth);

module.exports = {
  treeGroup: {
    body: Joi.object({
      health: Joi.string()
        .valid(allowedHealth)
        .required(),
      photos: Joi.array().items(Joi.string()),
      location: Joi.object({
        type: 'Point',
        coordinates: Joi.array().items(Joi.number()),
      }).required(),
      plants: Joi.number().required(),
    }),
  },
};
