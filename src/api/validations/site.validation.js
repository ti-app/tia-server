const Joi = require('joi');

module.exports = {
  me: {
    query: {
      name: Joi.string().required(),
    },
  },
  site: {
    body: Joi.object({
      userId: Joi.string().required(),
      type: Joi.string().valid('Public', 'Private'),
      photos: Joi.array().items(Joi.string()),
      location: Joi.object({
        lat: Joi.string().required(),
        lng: Joi.string().required(),
      }).required(),
    }),
  },
};
