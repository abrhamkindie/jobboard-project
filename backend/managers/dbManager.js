// const mysql = require('mysql2');

// const ConnectDB = (config) => {
//   if (!config || !config.host || !config.user || !config.database) {
//     console.warn('⚠️ Warning: Database Configuration is missing or incomplete.');
//     return null;
//   }
//     const db = mysql.createConnection({
//     host: config.host,
//     user: config.user,
//     password: config.password || null,  
//     database: config.database,
//     port: config.port || 3306,  
//   });

//   db.connect((err) => {
//     if (err) {
//       console.error('❌ Error connecting to MySQL:', err.stack);
//       return null;
//     }
//     console.log('✅ Connected to MySQL database');
//   });

//   return db;
// };

// module.exports = { ConnectDB };






const mysql = require('mysql2');
const fs = require('fs');

function ConnectDB(config) {
  const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port || 3306,


    ssl: {
      ca: fs.readFileSync('./ca.pem')
    }



  });

  connection.connect((err) => {
    if (err) {
      console.error('MySQL connection failed:', err);
      return null;
    }
    console.log('Connected to MySQL');
  });

  return connection;
}

module.exports = { ConnectDB };