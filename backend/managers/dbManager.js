const mysql = require('mysql2');

const ConnectDB = (config) => {
  if (!config || !config.host || !config.user || !config.database) {
    console.warn('⚠️ Warning: Database Configuration is missing or incomplete.');
    return null;
  }
    const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password || null, // Use null if password is empty
    database: config.database,
    port: config.port || 3306, // Default to 3306 if port is not provided
  });

  db.connect((err) => {
    if (err) {
      console.error('❌ Error connecting to MySQL:', err.stack);
      return null;
    }
    console.log('✅ Connected to MySQL database');
  });

  return db;
};

module.exports = { ConnectDB };