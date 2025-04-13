
exports.insertIntoDatabase = (table, data, res,db) => {
  db.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
    if (err) {
      console.error(`Error inserting data into ${table}:`, err);
      return res.status(500).json({ error: `Error inserting data into ${table}`, details: err.message });
    }
    res.json({ message: `${table.charAt(0).toUpperCase() + table.slice(1)} created successfully` });
  });
};
 