/**
 * This trick will get the intellisense to pick up
 * the dynamically defined constants.
 * We do not require any value here, just the shape of the object.
 * Do not worry about the values as they will be overridden by the
 * constant.[env].js variables
 */
const shape = {
  logs: undefined,
  corsOptions: {
    origin: undefined,
    credentials: undefined,
  },
};

/**
 * Common constants across all the environments (dev, staging, prod)
 */
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,

  database: {
    uri: process.env.DB_URI,
    database: process.env.DB_DB_NAME,
    collections: {
      user: process.env.DB_USER_COLLECTION,
    },
  },
  firebase: {
    firebaseServiceAccount: {
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY,
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    },
    databaseURL: process.env.DATABASE_URL,
  },
  dump: {
    secret: process.env.DUMP_SECRET,
  },

  ...shape,
};
