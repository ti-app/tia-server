/**
 * Common constants across all the environments (dev, staging, prod)
 */

const TREE_HEALTH = {
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

module.exports = {
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
    },
  },
  firebase: {
    firebaseServiceAccount: {
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCiR5HRhJzHV6sG\nQR+rlyPg882y3w4ggv/mV4SwyKhEhF7E7ePMDv6Irsw2Vt0jHzftv6nwQEu3d1xW\n38NZmazT5gkZr7D2j/izBdQlPDESc9PVfoj0u3s0YDXO9hqlrZlNYk8EgpYVLai1\neJc2ncct4lBQOT8lrdWLNUmtgOAxh8zcfMu4HhW2eMogxLRo1in4NmEk3KJsU/ms\nCGl2RC0JxMEn3gGqAHN7Z5DG5AwpfbG2ZHhqN2evd6mrX3jgkLyufYZloedgrReQ\nO1HGFse3UEA7OaKG9JkZ4dGrNpB9mYymm9vDq4U/gB0E42VUmpvogPOcAdwKzFQO\nPTKUlqInAgMBAAECggEAIJaw0NuJxHp1jO79Fi9m9CDh2R70LlFAZJiEvB+/surG\nQVPooC0OrpIzzmHJTOlTCPqpfObcjb55m7SZ/V9gFrmmcDMZHZqx/fmYrdWVoTgD\nfWdIx6TyzATaKXLAzS68j47DgYtb6mrd63uJGl27BxrguAuXA9ESBj+wSRiNbUSe\n5gU0ZdJ8VrQDPEcM1Bk1VJhcoxYGjWc7U7NZlg/qknGGyAfjWiELu4rACPTtUQ/5\n5b87vAE1+bjJdgQkY7ilJZuFdaSRHak2G2uEiYBPoMK/Lv6NA7EJfH1wbGiJMO0t\n+uPkDC+n4OPTFImhXaiD8ZsR9ivXb5+jxU+uEpgFMQKBgQDjKA63YqCPyj8pCc5j\nMknOZjiDn8eAiHw228fwvnpol4pRtANTgmql/qtVfgXD+bWQEOSe/buiVJzYRrC5\ncMQuNQMmrf9S9hYLYKLCqziYuhvph7hcYAi70hNKUUnB0vQLPmkvgn5GxW52Z6KQ\nhEr+ID53Zr5s/++wJ8c97cQcDwKBgQC24qAFw6pWB5sZ+XzcTqXZo4EAkAVTTsV7\nXqlx+s7U9BV+JaCIVzu+zzglMYv6TaxCIr6XFv7fsYPxw6bwnM8WeU81vOzjik8U\n9zauKyHaPOaIvDlwlx23AmLY7vZnlaa2mvL9e3CBefBF1iKCKLhPwqNSncKdXdwM\njL36DcbgaQKBgQDY+DwGQfhnH6Dwi+NMsI36zXyRjJ48USGELK1vcCDvoj+GBtFe\nhKVlZDk28aaEKBGaR+h3TJhaV0Nw+SR4HBPmptAZs/y6uz8XIviTxIPMrYdXqkEY\nSspMzD2MsNQohFyCGNzTemsvIgl+o0KNky8mSJoh5kthRZ0lvvj6WA8HVQKBgQCM\nxSHhbfuV3qLfOm+GcC8ut7DbSwAeYLqXPIT2y9QajIpin/nSGDtPotcXoeyZzOGz\nwmSrjbK/Yjcqh6ve9wRbyyJSPcqlVleKzsLTCzYycsAMLb2U0Wy46mhFjKIzlzhM\nxDYXMMWnk8GDL9E+GLPOCQaH2BDt6kovisHMUIBtSQKBgQCXpRRPPxzdcHhmHZo1\nvmjt5Gayjz32GyoFTUVSmdSaFgZkYNvIP/MCFiyFO/Ayw0HLv79dbU4lWRFF5JuR\nig3vIccsl1CYDxSUpb9ndjzjcW+g6tbQnF+dUsGEF+1U7Az4iZPhY79FWr/x3xK1\ndZuiW9Nr13bQwDZGCDqGJMS9FA==\n-----END PRIVATE KEY-----\n',
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: process.env.AUTH_URI,
      token_uri: process.env.TOKEN_URI,
      bucket_id: process.env.BUCKET_ID,
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
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
    addTree: 'TREE_ADDED',
    deleteTree: 'TREE_DELETED',
    waterTree: 'TREE_WATERED',
    updateTree: 'TREE_UPDATED',
    fertilizeTree: 'TREE_FERTILIZED',
    addSite: 'SITE_ADDED',
    deleteSite: 'SITE_DELETED',
    updateSite: 'SITE_UPDATED',
  },
};
