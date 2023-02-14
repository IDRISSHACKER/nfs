module.exports = {
  apps : [{
    name      : "NFS",
    script    : "./dist/main.js",
    instances : "max",
    exec_mode : "cluster",
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
}
