module.exports = {
  webpackDdevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
