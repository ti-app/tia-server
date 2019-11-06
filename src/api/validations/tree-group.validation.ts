import Joi from 'joi';
import constants from '@constants';
import toArry from '@utils/to-array';

const allowedHealth = toArry(constants.treeHealth);

export default {
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
  modAction: {
    body: Joi.object({
      approve: Joi.bool().required(),
    }),
  },
};
