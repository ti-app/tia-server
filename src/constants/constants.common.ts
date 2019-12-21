import { AppEnv, TreeHealth } from '../types/app-env';

/**
 * Common constants across all the environments (dev, staging, prod)
 */

const TREE_HEALTH: TreeHealth = {
  HEALTHY: 'healthy',
  ADEQUATE: 'adequate',
  AVERAGE: 'average',
  WEAK: 'weak',
  DEAD: 'almostDead',
};

const TREE_HEALTH_VALUE = {
  [TREE_HEALTH.HEALTHY]: 5,
  [TREE_HEALTH.ADEQUATE]: 4,
  [TREE_HEALTH.AVERAGE]: 3,
  [TREE_HEALTH.WEAK]: 2,
  [TREE_HEALTH.DEAD]: 1,
};

const TREE_DISTRIBUTION = {
  SINGLE: 'single',
  LINE: 'line',
  RANDOM: 'random',
};

const commonEnvVars: AppEnv = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,

  database: {
    uri: process.env.DB_URI,
    database: process.env.DB_NAME,
    collections: {
      tree: 'tree',
      site: 'site',
      treeGroup: 'tree-group',
      treeActivity: 'tree-activity',
      user: 'user',
      panic: 'panic',
    },
  },
  firebase: {
    firebaseServiceAccount: {
      type: process.env.TYPE,
      projectId: process.env.PROJECT_ID,
      privateKeyId: process.env.PRIVATE_KEY_ID,
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
      clientId: process.env.CLIENT_ID,
      authUri: process.env.AUTH_URI,
      tokenUri: process.env.TOKEN_URI,
      bucketId: process.env.BUCKET_ID,
      authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
      clientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
    },
    databaseURL: process.env.DATABASE_URL,
  },
  dump: {
    secret: process.env.DUMP_SECRET,
  },
  roles: {
    MODERATOR: 'moderator',
    USER: 'user',
  },
  treeHealth: TREE_HEALTH,
  treeHealthValue: TREE_HEALTH_VALUE,
  activityType: {
    ADD_TREE: 'TREE_ADDED',
    DELETE_TREE: 'TREE_DELETED',
    WATER_TREE: 'TREE_WATERED',
    UPDATE_TREE: 'TREE_UPDATED',
    FERTILIZE_TREE: 'TREE_FERTILIZED',
    ADD_SITE: 'SITE_ADDED',
    DELETE_SITE: 'SITE_DELETED',
    UPDATE_SITE: 'SITE_UPDATED',
  },
  treeDistribution: TREE_DISTRIBUTION,
};

export default commonEnvVars;
