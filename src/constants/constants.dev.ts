import { AppEnv } from '../types/app-env';

const devEnvVars: AppEnv = {
  logs: 'dev',
  corsOptions: {
    origin: (origin: string, callback: (error?: Error, result?: any) => void) => {
      // In dev, allow these IPs to access the API
      const whiteList = [
        'localhost',
        '0.0.0.0',
        '127.0.0.1',
        'chrome-extension',
        'https://make-tia-moderator.web.app',
        'https://make-tia-moderator.firebaseapp.com',
      ];
      // We are doing string matching here.
      // For advanced use-case, use regex
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
export default devEnvVars;
