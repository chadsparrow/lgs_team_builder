const app = require('./app');
const config = require('config');
const winston = require('winston');

// configures server port
const APP_PORT = config.get('app.port') || 5001;
// configures server to listen to configured server port above
app.listen(APP_PORT, () => winston.info(`Team Builder now listening on port ${APP_PORT}...`));
