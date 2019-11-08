import admin from 'firebase-admin';
import constants from '../../constants';
import toArray from './to-array';

admin.initializeApp({
  credential: admin.credential.cert(constants.firebase.firebaseServiceAccount),
  databaseURL: constants.firebase.databaseURL,
});

if (process.argv.length !== 4) {
  throw Error('Invalid use of promote. Usage: npm run promote <email> <role>');
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
    console.log('TCL: user', user);
    admin
      .auth()
      .setCustomUserClaims(user.uid, {
        role,
      })
      .then(() => {
        console.log('Role has been assigned.');
        process.exit(0);
      });
  });
