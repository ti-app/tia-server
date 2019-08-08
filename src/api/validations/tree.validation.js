const Joi = require('joi');
const { treeHealth } = require('../constants/tree.constants');
const toArry = require('../utils/to-array');

const allowedHealth = toArry(treeHealth);

module.exports = {
  tree: {
    body: Joi.object({
      userId: Joi.string().required(),
      health: Joi.string()
        .valid(allowedHealth)
        .required(),
      photos: Joi.array().items(Joi.string()),
      location: Joi.object({
        lat: Joi.string().required(),
        lng: Joi.string().required(),
      }).required(),
      plants: Joi.number().required(),
    }),
  },
  get: {
    query: {
      lat: Joi.string().required(),
      lng: Joi.string().required(),
      radius: Joi.number().required(),
      health: Joi.string(),
    },
  },
};
