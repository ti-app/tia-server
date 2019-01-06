const Joi = require('joi');
const { treeHealth } = require('../../constants');
const toArry = require('../utils/to-array');

const allowedHealth = toArry(treeHealth);

module.exports = {
  // POST /v1/user/greet-me?name=<some_name>
  me: {
    query: {
      name: Joi.string().required(),
    },
  },
  treeGroup: {
    body: Joi.object({
      health: Joi.string()
        .valid(allowedHealth)
        .required(),
      photos: Joi.array().items(Joi.string()),
      location: Joi.object({
        type: 'Point',
        coordinates: Joi.array().items(Joi.number()),
        // lat: Joi.string().required(),
        // lng: Joi.string().required(),
      }).required(),
      plants: Joi.number().required(),
    }),
  },
};
