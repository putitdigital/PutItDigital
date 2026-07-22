const db = require('../config/db');

exports.getAllclients = (callback) => {
  console.log('exports.getAllclients called');
  db.query('SELECT * FROM clients', (err, results) => {
    console.log('Query callback - err:', err, 'results:', results);
    if (err) {
      console.error('Query error:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

exports.getclientById = (id, callback) => {
  db.query('SELECT * FROM clients WHERE id = ?', [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.createclient = (data, callback) => {
  const query = 'INSERT INTO clients (name, email, phone, website, status) VALUES (?, ?, ?, ?, ?)';
  const values = [data.name, data.email || null, data.phone || null, data.website || null, data.status || 'active'];
  
  db.query(query, values, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

exports.updateclient = (id, data, callback) => {
  const query = 'UPDATE clients SET name = ?, email = ?, phone = ?, website = ?, status = ? WHERE id = ?';
  const values = [data.name, data.email, data.phone, data.website, data.status, id];
  
  db.query(query, values, (err, results) => {
    if (err) return callback(err);
    callback(null, results.affectedRows);
  });
};

exports.findByname = (name, callback) => {
  db.query('SELECT * FROM clients WHERE name = ?', [name], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.deleteclient = (id, callback) => {
  db.query('DELETE FROM clients WHERE id = ?', [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results.affectedRows);
  });
};
