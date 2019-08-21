// ref: https://gist.github.com/joshnuss/37ebaf958fe65a18d4ff
const httpStatus = require('http-status');

// middleware for doing role-based permissions
function permit(...allowed) {
  const isAllowed = (role) => allowed.indexOf(role) > -1;

  // return a middleware
  return (request, response, next) => {
    if (request.user && isAllowed(request.user.role)) next();
    // role is allowed, so continue on the next middleware
    else {
      response
        .status(httpStatus.FORBIDDEN)
        .json({ message: 'User is forbidden to access this api.' });
    }
  };
}

module.exports = { permit };
