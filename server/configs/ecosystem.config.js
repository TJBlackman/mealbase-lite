// pm2 config
// https://pm2.keymetrics.io/docs/usage/application-declaration

const path = require('path');
module.exports = {
  apps: [
    {
      name: 'Mealbase Lite',
      script: path.join(__dirname, '../dist/index.js'),
      node_args: '-r dotenv/config',
      args: 'dotenv_config_path=configs/.prod.env',
    },
  ],
};
