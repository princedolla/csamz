import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = ({ user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);
    
    const menuItems = [
        { path: '/cars', label: 'Car', icon: '🚗', roles: ['admin', 'manager', 'receptionist'] },
        { path: '/packages', label: 'Package', icon: '📦', roles: ['admin', 'manager', 'receptionist'] },
        { path: '/service-packages', label: 'ServicePackage', icon: '🔧', roles: ['admin', 'manager', 'receptionist'] },
        { path: '/payments', label: 'Payment', icon: '💰', roles: ['admin', 'manager', 'receptionist'] },
        { path: '/reports', label: 'Reports', icon: '📊', roles: ['admin', 'manager'] },
        { path: '/users', label: 'Users', icon: '👥', roles: ['admin'] },
    ];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => location.pathname === path;
    
    const filteredMenuItems = menuItems.filter(item => 
        item.roles.includes(user?.role || 'receptionist')
    );

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true
            });
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            toast.success('Logged out successfully');
            onLogout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Still logout locally even if server request fails
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            onLogout();
            navigate('/login');
            toast.success('Logged out');
        }
    };

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'admin': return 'bg-red-500';
            case 'manager': return 'bg-yellow-500';
            default: return 'bg-green-500';
        }
    };

    return (
        <nav className="bg-blue-700 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link to="/cars" className="flex items-center space-x-2 py-3 hover:opacity-90">
                        <span className="text-2xl">🚗💧</span>
                        <span className="font-bold text-xl">SmartPark CWSMS</span>
                    </Link>
                    
                    <div className="flex space-x-1">
                        {filteredMenuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-3 rounded-lg transition-colors ${
                                    isActive(item.path)
                                        ? 'bg-blue-800 text-white'
                                        : 'hover:bg-blue-600'
                                }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                        
                        {/* User Menu */}
                        <div className="relative ml-4" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <span className="text-xl">👤</span>
                                <span>{user?.fullName || user?.username}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user?.role)}`}>
                                    {user?.role}
                                </span>
                            </button>
                            
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50">
                                    <div className="p-4 border-b">
                                        <p className="text-gray-800 font-semibold">{user?.fullName}</p>
                                        <p className="text-gray-600 text-sm">{user?.username}</p>
                                        <p className="text-gray-600 text-sm">{user?.email}</p>
                                        <p className="text-gray-500 text-xs mt-2">Role: {user?.role}</p>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;