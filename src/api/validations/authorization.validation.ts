import Joi from 'joi';
import constants from '@constants';
import toArry from '@utils/to-array';

const { roles } = constants;
const validRoles = toArry(roles);

export default {
  addRole: {
    body: Joi.object({
      role: Joi.string()
        .valid(validRoles)
        .required(),
      email: Joi.string().required(),
    }),
  },
};
