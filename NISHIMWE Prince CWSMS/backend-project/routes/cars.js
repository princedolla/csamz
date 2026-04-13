const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all cars
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Car ORDER BY PlateNumber');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single car
router.get('/:plateNumber', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Car WHERE PlateNumber = ?', [req.params.plateNumber]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create car
router.post('/', async (req, res) => {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?, ?, ?, ?, ?)',
            [PlateNumber, CarType, CarSize, DriverName, PhoneNumber]
        );
        res.status(201).json({ message: 'Car created successfully', PlateNumber });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update car
router.put('/:plateNumber', async (req, res) => {
    const { CarType, CarSize, DriverName, PhoneNumber } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Car SET CarType = ?, CarSize = ?, DriverName = ?, PhoneNumber = ? WHERE PlateNumber = ?',
            [CarType, CarSize, DriverName, PhoneNumber, req.params.plateNumber]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ message: 'Car updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete car
router.delete('/:plateNumber', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Car WHERE PlateNumber = ?', [req.params.plateNumber]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;