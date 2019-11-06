// TODO: replace Object type with actual types of keys in the object

interface FirebaseServiceAccount {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  bucketId: string;
  authProviderX509CertUrl: string;
  clientX509CertUrl: string;
}

interface UserRoles {
  [role: string]: string;
}

export interface TreeHealth {
  HEALTHY: string;
  ADEQUATE: string;
  AVERAGE: string;
  WEAK: string;
  DEAD: string;
}

interface TreeHealthValue {
  [health: string]: number;
}

export interface TreeActivity {
  ADD_TREE: string;
  DELETE_TREE: string;
  WATER_TREE: string;
  UPDATE_TREE: string;
  FERTILIZE_TREE: string;
  ADD_SITE: string;
  DELETE_SITE: string;
  UPDATE_SITE: string;
}

interface Database {
  uri: string;
  database: string;
  collections: {
    [key: string]: string;
  };
}

export interface AppEnv {
  env?: string;
  port?: string;
  logs?: string;
  corsOptions?: object;
  database?: Database;
  firebase?: {
    firebaseServiceAccount: FirebaseServiceAccount;
    databaseURL: string;
  };
  dump?: object;
  roles?: UserRoles;
  treeHealth?: TreeHealth;
  treeHealthValue?: TreeHealthValue;
  activityType?: TreeActivity;
}
