import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';

const Navbar = ({ onOpenMobileSidebar }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New user registered', time: '5 min ago', read: false, type: 'user' },
        { id: 2, title: 'Report generated', time: '1 hour ago', read: false, type: 'report' },
        { id: 3, title: 'System update available', time: '2 hours ago', read: true, type: 'system' },
    ]);

    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);
    const searchInputRef = useRef(null);

    // Generate breadcrumbs from current path
    const generateBreadcrumbs = useCallback(() => {
        const paths = location.pathname.split('/').filter(Boolean);
        
        // If we're on the dashboard home, return just the home breadcrumb
        if (location.pathname === '/admin-dashboard' || paths.length === 0) {
            return [{ name: 'Dashboard', path: '/admin-dashboard' }];
        }

        const breadcrumbs = [{ name: 'Dashboard', path: '/admin-dashboard' }];

        let currentPath = '';
        paths.forEach((path) => {
            currentPath += `/${path}`;
            
            // Skip if it's the same as dashboard to avoid duplicates
            if (currentPath === '/admin-dashboard') {
                return;
            }
            
            const name = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            breadcrumbs.push({ name, path: currentPath });
        });

        return breadcrumbs;
    }, [location.pathname]);

    const breadcrumbs = generateBreadcrumbs();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            // Escape to close dropdowns
            if (e.key === 'Escape') {
                setShowNotifications(false);
                setShowUserMenu(false);
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            // Implement your search logic here
        }
    }, [searchQuery]);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogout = useCallback(() => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    }, [logout]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'user':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'report':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left Section: Mobile Menu Button + Breadcrumbs */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Mobile Menu Button - Only visible on mobile - FIXED */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('🔵 Hamburger clicked');
                            onOpenMobileSidebar(e);
                        }}
                        className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        aria-label="Open sidebar menu"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 min-w-0 flex-1" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm overflow-x-auto scrollbar-none">
                            {breadcrumbs.map((crumb, index) => (
                                <li key={`${crumb.path}-${index}`} className="flex items-center space-x-2">
                                    {index > 0 && (
                                        <svg 
                                            className="w-4 h-4 text-gray-400 flex-shrink-0" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                    {index === breadcrumbs.length - 1 ? (
                                        <span className="font-semibold text-gray-900 whitespace-nowrap">
                                            {crumb.name}
                                        </span>
                                    ) : (
                                        <Link
                                            to={crumb.path}
                                            className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap hover:underline"
                                        >
                                            {crumb.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>

                {/* Right Section: Search, Notifications, User Menu */}
                <div className="flex items-center space-x-3 ml-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative hidden md:block">
                        <div className={`relative transition-all duration-300 ${
                            isSearchFocused ? 'w-80' : 'w-64'
                        }`}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder="Search... (Ctrl+K)"
                                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                                aria-label="Search"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    {/* Mobile Search Button */}
                    <button
                        onClick={() => searchInputRef.current?.focus()}
                        className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

               
                    {/* User Menu Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="User menu"
                            aria-expanded={showUserMenu}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white shadow-md">
                                {user?.name?.charAt(0).toUpperCase() || 'V'}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700">
                                {user?.name || 'Vishoo Verma'}
                            </span>
                            <svg 
                                className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* User Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'Vishoo Verma'}</p>
                                    <p className="text-xs text-gray-500 mt-1">Administrator</p>
                                </div>
                                <div className="py-1">
                                    <Link
                                        to="/admin/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </Link>
                                    <Link
                                        to="/admin/settings"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
