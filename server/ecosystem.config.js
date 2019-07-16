module.exports = {
  apps: [
    {
      name: 'TEAM-BUILDER API',
      script: 'server.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 4,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
