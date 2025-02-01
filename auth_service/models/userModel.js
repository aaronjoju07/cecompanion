// models/userModel.js
const pool = require('../config/pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create the users table if it doesn't exist
const createUserTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        uid SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        regno VARCHAR(20) UNIQUE NOT NULL,
        college VARCHAR(100) NOT NULL,
        course VARCHAR(100) NOT NULL,
        section VARCHAR(10) NOT NULL,
        user_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email VARCHAR(100) UNIQUE NOT NULL,
        role VARCHAR(20) DEFAULT 'user'
      )
    `;
  
    try {
      await pool.query(query);
      console.log('Users table created or already exists');
    } catch (err) {
      console.error('Error creating users table:', err);
      throw err; // Rethrow the error to handle it in the calling function
    }
  };

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Create a new user
const createUser = async (user) => {
  const { name, password, regno, college, course, section, email, role } = user;
  const hashedPassword = await hashPassword(password);
  const query = `
    INSERT INTO users (name, password, regno, college, course, section, email, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [name, hashedPassword, regno, college, course, section, email, role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Find user by ID
const findUserById = async (uid) => {
  const query = 'SELECT * FROM users WHERE uid = $1';
  const result = await pool.query(query, [uid]);
  return result.rows[0];
};

// Update user
const updateUser = async (uid, user) => {
  const { name, regno, college, course, section, email, role } = user;
  const query = `
    UPDATE users
    SET name = $1, regno = $2, college = $3, course = $4, section = $5, email = $6, role = $7
    WHERE uid = $8
    RETURNING *
  `;
  const values = [name, regno, college, course, section, email, role, uid];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete user
const deleteUser = async (uid) => {
  const query = 'DELETE FROM users WHERE uid = $1 RETURNING *';
  const result = await pool.query(query, [uid]);
  return result.rows[0];
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ uid: user.uid, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = {
  createUserTable,
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  verifyPassword,
  generateToken,
};