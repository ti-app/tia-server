export const defaultHeaders = {
  'x-id-token': 'abc',
};

// user object generate using getFirebaseUidFromToken of utils/firebase-utils.js
export const MOD_USER = {
  uid: 'jBBPAbf73AOFdvXXC4NU6BVhoOD2',
  role: 'moderator',
  iss: 'https://securetoken.google.com/ti-app-client-6e554',
  aud: 'ti-app-client-6e554',
  auth_time: 1573827971,
  user_id: 'jBBPAbf73AOFdvXXC4NU6BVhoOD2',
  sub: 'jBBPAbf73AOFdvXXC4NU6BVhoOD2',
  iat: 1573827971,
  exp: 1573831571,
  email: 'murali_prajapati555@gmail.com',
  email_verified: false,
  firebase: {
    identities: {
      email: ['murali_prajapati555@gmail.com'],
    },
    sign_in_provider: 'password',
  },
};

export const NON_MOD_USER_1 = {
  iss: 'https://securetoken.google.com/ti-app-client-6e554',
  aud: 'ti-app-client-6e554',
  auth_time: 1574077776,
  user_id: '9kvN9iH0URRe6jgDzNYwTxreHR83',
  sub: '9kvN9iH0URRe6jgDzNYwTxreHR83',
  iat: 1574077776,
  exp: 1574081376,
  email: 'nonmoderator@gmail.com',
  email_verified: false,
  firebase: {
    identities: { email: ['nonmoderator@gmail.com'] },
    sign_in_provider: 'password',
  },
  uid: '9kvN9iH0URRe6jgDzNYwTxreHR83',
};

export const NON_MOD_USER_2 = {
  iss: 'https://securetoken.google.com/ti-app-client-6e554',
  aud: 'ti-app-client-6e554',
  auth_time: 1574077831,
  user_id: 'cjhMK2nYsaeDRvyY8IZz14aCYBW2',
  sub: 'cjhMK2nYsaeDRvyY8IZz14aCYBW2',
  iat: 1574077831,
  exp: 1574081431,
  email: 'nonmoduser2@gmail.com',
  email_verified: false,
  firebase: {
    identities: { email: ['nonmoduser2@gmail.com'] },
    sign_in_provider: 'password',
  },
  uid: 'cjhMK2nYsaeDRvyY8IZz14aCYBW2',
};
