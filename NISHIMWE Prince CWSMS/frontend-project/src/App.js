import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import CarManagement from './components/CarManagement';
import PackageManagement from './components/PackageManagement';
import ServicePackageManagement from './components/ServicePackageManagement';
import PaymentManagement from './components/PaymentManagement';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import { Toaster } from 'react-hot-toast';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const storedUser = localStorage.getItem('user');
        const authFlag = localStorage.getItem('isAuthenticated');
        
        if (storedUser && authFlag === 'true') {
            try {
                // Verify token with backend
                const response = await axios.get('/auth/me', {
                    withCredentials: true
                });
                
                if (response.data) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                    console.log('User authenticated:', response.data);
                } else {
                    // Invalid session
                    localStorage.removeItem('user');
                    localStorage.removeItem('isAuthenticated');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
                setIsAuthenticated(false);
                setUser(null);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    };

    const handleLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-4xl mb-4">🚗</div>
                    <div className="text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Toaster position="top-right" />
                {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={
                            !isAuthenticated ? 
                            <Login onLogin={handleLogin} /> : 
                            <Navigate to="/cars" />
                        } />
                        <Route path="/" element={
                            <Navigate to={isAuthenticated ? "/cars" : "/login"} />
                        } />
                        <Route path="/cars" element={
                            isAuthenticated ? <CarManagement /> : <Navigate to="/login" />
                        } />
                        <Route path="/packages" element={
                            isAuthenticated ? <PackageManagement /> : <Navigate to="/login" />
                        } />
                        <Route path="/service-packages" element={
                            isAuthenticated ? <ServicePackageManagement /> : <Navigate to="/login" />
                        } />
                        <Route path="/payments" element={
                            isAuthenticated ? <PaymentManagement /> : <Navigate to="/login" />
                        } />
                        <Route path="/reports" element={
                            isAuthenticated && (user?.role === 'admin' || user?.role === 'manager') ? 
                            <Reports /> : <Navigate to="/login" />
                        } />
                        <Route path="/users" element={
                            isAuthenticated && user?.role === 'admin' ? 
                            <UserManagement user={user} /> : <Navigate to="/login" />
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;