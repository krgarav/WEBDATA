const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();
const createDatabaseIfNotExists = async () => {
    try {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
      });
  
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.SQL_DATABASE_NAME}`);
      console.log(`✅ Database "webdata" is ready.`);
      await connection.end();
    } catch (error) {
      console.error("❌ Error creating database:", error);
      process.exit(1); // Exit if DB creation fails
    }
  };

  module.exports = createDatabaseIfNotExists;