const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all packages
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Package ORDER BY PackageNumber');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single package
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Package WHERE PackageNumber = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create package
router.post('/', async (req, res) => {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES (?, ?, ?)',
            [PackageName, PackageDescription, PackagePrice]
        );
        res.status(201).json({ message: 'Package created successfully', PackageNumber: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update package
router.put('/:id', async (req, res) => {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Package SET PackageName = ?, PackageDescription = ?, PackagePrice = ? WHERE PackageNumber = ?',
            [PackageName, PackageDescription, PackagePrice, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json({ message: 'Package updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete package
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Package WHERE PackageNumber = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;