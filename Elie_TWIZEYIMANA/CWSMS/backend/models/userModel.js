const db = require("../config/db");

const createUser = async ({ FullName, Email, PasswordHash, Role = "staff" }) => {
  const [result] = await db.query(
    "INSERT INTO User (FullName, Email, PasswordHash, Role) VALUES (?, ?, ?, ?)",
    [FullName, Email, PasswordHash, Role]
  );
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT UserId, FullName, Email, PasswordHash, Role FROM User WHERE Email = ? LIMIT 1",
    [email]
  );
  return rows[0];
};

const getUserById = async (userId) => {
  const [rows] = await db.query(
    "SELECT UserId, FullName, Email, Role FROM User WHERE UserId = ? LIMIT 1",
    [userId]
  );
  return rows[0];
};

module.exports = { createUser, getUserByEmail, getUserById };
