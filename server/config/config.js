module.exports = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TTL: '15m',
  ACCESS_TOKEN_TTL_NUMBER: 1000 * 60 * 15,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TTL: '24h',
  REFRESH_TOKEN_TTL_NUMBER: 1000 * 60 * 60 * 24,
  PORT: 5000,
};