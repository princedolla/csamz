const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all service packages with joins
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT sp.RecordNumber, sp.ServiceDate, 
                   c.PlateNumber, c.DriverName, c.CarType,
                   p.PackageNumber, p.PackageName, p.PackagePrice
            FROM ServicePackage sp
            JOIN Car c ON sp.PlateNumber = c.PlateNumber
            JOIN Package p ON sp.PackageNumber = p.PackageNumber
            ORDER BY sp.RecordNumber DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single service package
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT sp.RecordNumber, sp.ServiceDate, 
                   c.PlateNumber, c.DriverName, c.CarType,
                   p.PackageNumber, p.PackageName, p.PackagePrice
            FROM ServicePackage sp
            JOIN Car c ON sp.PlateNumber = c.PlateNumber
            JOIN Package p ON sp.PackageNumber = p.PackageNumber
            WHERE sp.RecordNumber = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create service package
router.post('/', async (req, res) => {
    const { ServiceDate, PlateNumber, PackageNumber } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO ServicePackage (ServiceDate, PlateNumber, PackageNumber) VALUES (?, ?, ?)',
            [ServiceDate, PlateNumber, PackageNumber]
        );
        res.status(201).json({ message: 'Service record created successfully', RecordNumber: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update service package
router.put('/:id', async (req, res) => {
    const { ServiceDate, PlateNumber, PackageNumber } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE ServicePackage SET ServiceDate = ?, PlateNumber = ?, PackageNumber = ? WHERE RecordNumber = ?',
            [ServiceDate, PlateNumber, PackageNumber, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json({ message: 'Service record updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete service package
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM ServicePackage WHERE RecordNumber = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.json({ message: 'Service record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;