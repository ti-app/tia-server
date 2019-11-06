import Joi from 'joi';
import constants from '@constants';
import toArry from '@utils/to-array';

const allowedHealth = toArry(constants.treeHealth);

export default {
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
  modAction: {
    body: Joi.object({
      delete: Joi.bool().required(),
    }),
  },
};
