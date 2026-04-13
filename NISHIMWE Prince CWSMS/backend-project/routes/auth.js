const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Register new user (admin only)
router.post('/register', 
    authenticateToken,
    authorizeRole('admin'),
    [
        body('username').isLength({ min: 3 }).trim().escape(),
        body('password').isLength({ min: 6 }),
        body('email').isEmail().normalizeEmail(),
        body('fullName').notEmpty().trim(),
        body('role').isIn(['admin', 'receptionist', 'manager'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { username, password, email, fullName, role } = req.body;
        
        try {
            // Check if user exists
            const [existing] = await db.query('SELECT * FROM Users WHERE Username = ? OR Email = ?', [username, email]);
            if (existing.length > 0) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            
            // Create user
            await db.query(
                'INSERT INTO Users (Username, PasswordHash, Email, FullName, Role) VALUES (?, ?, ?, ?, ?)',
                [username, passwordHash, email, fullName, role]
            );
            
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Login
router.post('/login',
    [
        body('username').notEmpty().trim(),
        body('password').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { username, password } = req.body;
        
        try {
            // Get user from database
            const [users] = await db.query('SELECT * FROM Users WHERE Username = ?', [username]);
            
            if (users.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const user = users[0];
            
            // Check if user is active
            if (!user.IsActive) {
                return res.status(401).json({ message: 'Account is disabled. Contact administrator.' });
            }
            
            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Update last login
            await db.query('UPDATE Users SET LastLogin = NOW() WHERE UserID = ?', [user.UserID]);
            
            // Create JWT token
            const token = jwt.sign(
                { 
                    userId: user.UserID, 
                    username: user.Username, 
                    role: user.Role,
                    fullName: user.FullName
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );
            
            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.COOKIE_SECURE === 'true',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            
            res.json({
                message: 'Login successful',
                user: {
                    username: user.Username,
                    email: user.Email,
                    fullName: user.FullName,
                    role: user.Role
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax'
    });
    res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT UserID, Username, Email, FullName, Role, LastLogin FROM Users WHERE UserID = ?',
            [req.user.userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Change password
router.post('/change-password',
    authenticateToken,
    [
        body('currentPassword').notEmpty(),
        body('newPassword').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { currentPassword, newPassword } = req.body;
        
        try {
            const [users] = await db.query('SELECT PasswordHash FROM Users WHERE UserID = ?', [req.user.userId]);
            
            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            const isValid = await bcrypt.compare(currentPassword, users[0].PasswordHash);
            if (!isValid) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            
            const salt = await bcrypt.genSalt(10);
            const newPasswordHash = await bcrypt.hash(newPassword, salt);
            
            await db.query('UPDATE Users SET PasswordHash = ? WHERE UserID = ?', [newPasswordHash, req.user.userId]);
            
            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Get all users (admin only)
router.get('/users', authenticateToken, authorizeRole('admin'), async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT UserID, Username, Email, FullName, Role, IsActive, LastLogin, CreatedAt FROM Users'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user status (admin only)
router.put('/users/:id/status', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { isActive } = req.body;
    
    try {
        await db.query('UPDATE Users SET IsActive = ? WHERE UserID = ?', [isActive, req.params.id]);
        res.json({ message: 'User status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;