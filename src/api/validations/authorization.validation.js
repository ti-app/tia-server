const Joi = require('joi');
const { roles } = require('../../constants');
const toArry = require('../utils/to-array');

const validRoles = toArry(roles);

module.exports = {
  addRole: {
    body: Joi.object({
      role: Joi.string()
        .valid(validRoles)
        .required(),
      email: Joi.string().required(),
    }),
  },
};
