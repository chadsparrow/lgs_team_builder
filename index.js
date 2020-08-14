const logger = require('./server/middleware/logger');
const app = require('./server/server');
const config = require('./server/config/config');

// configures server port
const PORT = config.PORT || 3000;

// configures server to listen to configured server port above
app.listen(PORT, () =>
  logger.info(
    `Team Builder (${process.env.NODE_ENV}) now listening on port ${PORT}...`
  )
);
