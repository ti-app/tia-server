import { AppEnv } from '../types/app-env';

const prodEnvVars: AppEnv = {
  logs: 'production',
  corsOptions: {
    origin: (origin: string, callback: (error?: Error, result?: any) => void) => {
      const whiteList = [
        'localhost',
        'tia-server.herokuapp.com',
        '34.87.125.234',
        'chrome-extension',
        'https://make-tia-moderator.web.app',
        'https://make-tia-moderator.firebaseapp.com',
      ];
      const index = whiteList.findIndex((anIP) => origin.includes(anIP));
      if (!origin || index !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`ORIGIN: '${origin}' Not allowed by CORS`));
      }
    },
    credentials: true,
  },
};
export default prodEnvVars;
