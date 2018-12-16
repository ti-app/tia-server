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
    // you can write validations for body and param as well
    // body: {
    //     name: Joi.string().required(),
    // },
    // param: {
    //     name: Joi.string().required(),
    // },
  },
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
};
