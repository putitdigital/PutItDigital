const mysql = require('mysql2');

      const db = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 8889,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'test'
      });

      // Attempt to get a connection immediately to verify DB health
      db.getConnection((err, connection) => {
        if (err) {
          console.error('❌ Database Connection Failed:', err.message);
        } else {
          console.log('✅ Database Connected successfully');
          connection.release();
        }
      });

      // Add an error handler for the connection pool
      db.on('error', (err) => {
        console.error('❌ Database Pool Error:', err);
      });

      module.exports = db;

