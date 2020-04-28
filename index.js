const logger = require('./server/middleware/logger');
const app = require('./server/server');

// configures server port
const PORT = process.env.PORT || 5000;

// configures server to listen to configured server port above
app.listen(PORT, () =>
  logger.info(`Team Builder (${process.env.NODE_ENV}) now listening on port ${PORT}...`)
);
