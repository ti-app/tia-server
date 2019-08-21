const admin = require('firebase-admin');

const constants = require('../../constants');
const toArray = require('./to-array');

admin.initializeApp({
  credential: admin.credential.cert(constants.firebase.firebaseServiceAccount),
  databaseURL: constants.firebase.databaseURL,
});

if (process.argv.length !== 4) {
  throw Error('Invalid use of promote. Usage: node promote.js <email> <role>');
}
const email = process.argv[2];
const role = process.argv[3];

const validRoles = toArray(constants.roles);

if (!(validRoles.indexOf(role) > -1)) {
  console.log('Not a valid role.');
  process.exit(1);
}

admin
  .auth()
  .getUserByEmail(email)
  .then((user) => {
    if (user.customClaims.role) {
      console.log('TCL: user.customClaims', user.customClaims);
      process.exit(0);
    }

    admin
      .auth()
      .setCustomUserClaims(user.uid, {
        role,
      })
      .then(() => {
        console.log('Role has been added');
        process.exit(0);
      });
  });
