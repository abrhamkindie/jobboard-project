const { config } = require('dotenv');
config();  

const DBconfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,   
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

const LoadConfig = () => {
  return DBconfig;
};

module.exports = { LoadConfig };