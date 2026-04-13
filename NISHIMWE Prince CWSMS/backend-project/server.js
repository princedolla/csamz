const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const carRoutes = require('./routes/cars');
const packageRoutes = require('./routes/packages');
const servicePackageRoutes = require('./routes/servicePackages');
const paymentRoutes = require('./routes/payments');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/cars', authenticateToken, carRoutes);
app.use('/api/packages', authenticateToken, packageRoutes);
app.use('/api/service-packages', authenticateToken, servicePackageRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'CWSMS API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});