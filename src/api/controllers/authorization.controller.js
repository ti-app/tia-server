const httpStatus = require('http-status');
const { addUserRole } = require('../utils/firebase.utils');

exports.addRoleToUser = (req, res, next) => {
  try {
    const { email, role } = req.body;
    addUserRole(email, role).then(() => {
      return res.status(httpStatus.OK).json({ message: 'Role has been added.' });
    });
  } catch (e) {
    next(e);
  }
};
