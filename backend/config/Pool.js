const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql-1294dc4d-abrhamkindie805-dcff.k.aivencloud.com',
  port: 20768,
  user: 'avnadmin',
  password: 'AVNS_bkfo85lyr0rDpfPoS9U',
  database: 'defaultdb',
  ssl: {
    ca: require('fs').readFileSync('./ca.pem'), // Path to ca.pem
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;