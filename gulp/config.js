module.exports = {
  'STATIC_HOST': process.env.STATIC_SERVER_HOST || '0.0.0.0',
  'STATIC_PORT': process.env.STATIC_SERVER_PORT || 9300,
  'APP_PORT': process.env.APP_SERVER_PORT || 9301
};
