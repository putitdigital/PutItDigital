const db = require('../config/db');
      const bcrypt = require('bcrypt');
      const jwt = require('jsonwebtoken');

      exports.getAllProducts = (callback) => {
        console.log('exports.getAllProducts called');
        db.query('SELECT * FROM products', (err, results) => {
          console.log('Query callback - err:', err, 'results:', results);
          if (err) {
            console.error('Query error:', err);
            return callback(err);
          }
          callback(null, results);
        });
      };

    exports.getProductById = (id, callback) => {
      db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
      });
    };

    exports.findByEmail = (email, callback) => {
      db.query('SELECT * FROM products WHERE email = ?', [email], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
      });
    };

    exports.createProduct = async(data, callback) => {
      const sanitized = { ...data };
      try{
        if(!sanitized.password) {
        return callback(new Error('Password is required'));
        }
        const salt = await bcrypt.genSalt();
        sanitized.password = await bcrypt.hash(sanitized.password, salt);
        if(sanitized.number !== undefined && typeof sanitized.number !== 'string') {
          sanitized.number = String(sanitized.number);
        }
        delete sanitized.id;
        db.query('INSERT INTO products SET ?', sanitized, (err, results) => {
          if (err) return callback(err);
          callback(null, results.insertId);
        });
      } catch(err) {
        return callback(err);
      }
    };

    exports.updateProduct = (id, data, callback) => {
      db.query('UPDATE products SET ? WHERE id = ?', [data, id], (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows);
      });
    };
  
    exports.deleteProduct = (id, callback) => {
      db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results.affectedRows);
      });
    };
