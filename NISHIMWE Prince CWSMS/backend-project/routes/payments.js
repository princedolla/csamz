const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all payments
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate,
                   sp.RecordNumber, sp.ServiceDate,
                   c.PlateNumber, c.DriverName,
                   pk.PackageName, pk.PackagePrice
            FROM Payment p
            JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
            JOIN Car c ON sp.PlateNumber = c.PlateNumber
            JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
            ORDER BY p.PaymentDate DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate,
                   sp.RecordNumber, sp.ServiceDate,
                   c.PlateNumber, c.DriverName,
                   pk.PackageName, pk.PackagePrice
            FROM Payment p
            JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
            JOIN Car c ON sp.PlateNumber = c.PlateNumber
            JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
            WHERE p.PaymentNumber = ?
        `, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create payment
router.post('/', async (req, res) => {
    const { AmountPaid, RecordNumber } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Payment (AmountPaid, RecordNumber) VALUES (?, ?)',
            [AmountPaid, RecordNumber]
        );
        res.status(201).json({ message: 'Payment recorded successfully', PaymentNumber: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update payment
router.put('/:id', async (req, res) => {
    const { AmountPaid, RecordNumber } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE Payment SET AmountPaid = ?, RecordNumber = ? WHERE PaymentNumber = ?',
            [AmountPaid, RecordNumber, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete payment
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Payment WHERE PaymentNumber = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment summary/report
router.get('/reports/summary', async (req, res) => {
    try {
        const [totalRevenue] = await db.query('SELECT SUM(AmountPaid) as TotalRevenue FROM Payment');
        const [dailyRevenue] = await db.query(`
            SELECT DATE(PaymentDate) as Date, SUM(AmountPaid) as DailyRevenue 
            FROM Payment 
            GROUP BY DATE(PaymentDate) 
            ORDER BY Date DESC 
            LIMIT 7
        `);
        const [packageStats] = await db.query(`
            SELECT pk.PackageName, COUNT(*) as ServiceCount, SUM(p.AmountPaid) as Revenue
            FROM Payment p
            JOIN ServicePackage sp ON p.RecordNumber = sp.RecordNumber
            JOIN Package pk ON sp.PackageNumber = pk.PackageNumber
            GROUP BY pk.PackageName
        `);
        
        res.json({
            totalRevenue: totalRevenue[0].TotalRevenue || 0,
            dailyRevenue: dailyRevenue,
            packageStats: packageStats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;