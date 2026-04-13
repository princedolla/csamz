const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
    let connection;
    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'CWSMS'
        });
        
        // Create Users table if not exists
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Users (
                UserID INT PRIMARY KEY AUTO_INCREMENT,
                Username VARCHAR(50) UNIQUE NOT NULL,
                PasswordHash VARCHAR(255) NOT NULL,
                Email VARCHAR(100) UNIQUE NOT NULL,
                FullName VARCHAR(100) NOT NULL,
                Role ENUM('admin', 'receptionist', 'manager') DEFAULT 'receptionist',
                IsActive BOOLEAN DEFAULT TRUE,
                LastLogin DATETIME,
                CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Hash password for Admin@123
        const password = 'Admin@123';
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Insert admin user
        await connection.execute(
            `INSERT INTO Users (Username, PasswordHash, Email, FullName, Role, IsActive) 
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             PasswordHash = VALUES(PasswordHash),
             FullName = VALUES(FullName)`,
            ['admin', passwordHash, 'admin@smartpark.rw', 'System Administrator', 'admin', true]
        );
        
        // Insert receptionist user
        const receptionistPassword = await bcrypt.hash('Reception123', 10);
        await connection.execute(
            `INSERT INTO Users (Username, PasswordHash, Email, FullName, Role, IsActive) 
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             PasswordHash = VALUES(PasswordHash),
             FullName = VALUES(FullName)`,
            ['reception1', receptionistPassword, 'reception@smartpark.rw', 'Jean Paul', 'receptionist', true]
        );
        
        console.log('✅ Test users created successfully!');
        console.log('Admin credentials:');
        console.log('  Username: admin');
        console.log('  Password: Admin@123');
        console.log('\nReceptionist credentials:');
        console.log('  Username: reception1');
        console.log('  Password: Reception123');
        
    } catch (error) {
        console.error('Error creating test users:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createTestUser();