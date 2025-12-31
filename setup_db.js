const db = require('./db');
const bcrypt = require('bcryptjs');

const setupDatabase = async () => {
    try {
        // Create Users Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Users Table Created or Exists");

        // Create Projects Table
        await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        challenge TEXT,
        solution TEXT,
        results TEXT[], -- Array of strings
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✅ Projects Table Created or Exists");

        // Check if Admin exists
        const checkAdmin = await db.query("SELECT * FROM users WHERE email = 'admin@nrt.com'");

        if (checkAdmin.rows.length === 0) {
            // Create Default Admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await db.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
      `, ['Super Admin', 'admin@nrt.com', hashedPassword, 'superadmin']);

            console.log("✅ Default Admin Created: admin@nrt.com / admin123");
        } else {
            console.log("ℹ️ Admin already exists");
        }

    } catch (err) {
        console.error("❌ Database Setup Failed:", err);
    } finally {
        process.exit();
    }
};

setupDatabase();
