module.exports = {
  apps: [
    {
      name: "TEAM-BUILDER API",
      script: "server.js",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 4,
      autorestart: true,
      watch: false,
      ignore_watch: ["logs", "node_modules"],
      watch_options: {
        followSymlinks: false
      },
      max_memory_restart: "1G",
      env_development: {
        NODE_ENV: "development",
        MONGO_INITDB_ROOT_DB: "teambuilder-dev"
      },
      env_production: {
        NODE_ENV: "production",
        MONGO_INITDB_ROOT_DB: "teambuilder-prod"
      }
    }
  ]
};
