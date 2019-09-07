module.exports = {
  logs: 'production',
  corsOptions: {
    origin: (origin, callback) => {
      const whiteList = [
        'localhost',
        'tia-server.herokuapp.com',
        '35.197.134.56',
        'chrome-extension',
        'https://make-tia-moderator.web.app/',
        'https://make-tia-moderator.firebaseapp.com/',
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
