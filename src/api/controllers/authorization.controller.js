const httpStatus = require('http-status');
const { addUserRole, getUsersWithRole, removeUserRole } = require('../utils/firebase.utils');

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

exports.getModUsers = (req, res, next) => {
  try {
    getUsersWithRole().then((users) => {
      return res.status(httpStatus.OK).json({ users });
    });
  } catch (e) {
    next(e);
  }
};

exports.removeRole = (req, res, next) => {
  try {
    const { email } = req.body;
    removeUserRole(email).then(() => {
      return res.status(httpStatus.OK).json({ message: 'Role has been removed.' });
    });
  } catch (e) {
    next(e);
  }
};
