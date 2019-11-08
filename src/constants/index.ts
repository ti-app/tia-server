import dotenv from 'dotenv-safe';

// import .env variables
dotenv.config();

import common from './constants.common';

const getEnvironmentSpecificConstants = async (env: string = 'production') => {
  switch (env) {
    case 'development': {
      return await import('./constants.dev');
    }
    case 'production': {
      return await import('./constants.prod');
    }
    default: {
      return {};
    }
  }
};

export default Object.assign({}, common, getEnvironmentSpecificConstants(process.env.NODE_ENV));
