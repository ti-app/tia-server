module.exports = {
  corsOptions: {
    origin: (origin, callback) => {
      const whiteList = ['35.197.134.56', 'localhost'];
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
