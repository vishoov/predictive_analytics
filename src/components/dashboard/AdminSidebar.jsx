import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';

const AdminSidebar = ({ isCollapsed, onToggle, isMobile = false, onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const menuItems = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            label: 'Dashboard',
            path: '/admin-dashboard',
            badge: null
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            label: 'Diagnostics',
            path: '/admin-dashboard/diagnostics',
            badge: null
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            label: 'Reviews',
            path: '/admin-dashboard/reviews',
            badge: ''
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            label: 'Reports',
            path: '/admin-dashboard/reports',
            badge: null
        },
        // {
        //     icon: (
        //         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
        //         </svg>
        //     ),
        //     label: 'Graphs',
        //     path: '/admin-dashboard/image-upload',
        //     badge: null
        // }
    ];

    const isActiveRoute = useCallback((path) => {
        if (path === '/admin-dashboard') return location.pathname === '/admin-dashboard';
        return location.pathname.startsWith(path);
    }, [location.pathname]);

    const handleLogout = useCallback(() => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    }, [logout]);

    // Close mobile sidebar when route changes
    useEffect(() => {
        if (isMobile && onClose) {
            onClose();
        }
    }, [location.pathname, isMobile, onClose]);

    // Close user menu when sidebar collapses
    useEffect(() => {
        if (isCollapsed && isUserMenuOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsUserMenuOpen(false);
        }
    }, [isCollapsed, isUserMenuOpen]);

    return (
        <aside
            className={`relative flex flex-col h-full transition-all duration-300 ease-in-out bg-gradient-to-b from-white via-gray-50 to-gray-100 border-r border-gray-200 shadow-2xl ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}
            role="complementary"
            aria-label="Admin sidebar navigation"
        >
            {/* Header */}
            <div className="relative p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between min-h-[48px]">
                    {/* Logo and Title - Show when not collapsed OR when mobile */}
                    {!isCollapsed ? (
                        <div className="flex items-center space-x-3 overflow-hidden flex-1">
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <span className="text-white font-bold text-lg relative z-10">D</span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent to-white/30"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="font-bold text-gray-900 text-base tracking-tight truncate">Urodynamics</h2>
                                <p className="text-xs text-gray-500 font-medium truncate">Admin Panel</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center w-full">
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                                <span className="text-white font-bold text-lg relative z-10">D</span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent to-white/30"></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Desktop Toggle Button - Only show on desktop when NOT collapsed */}
                    {!isMobile && !isCollapsed && (
                        <button
                            onClick={onToggle}
                            className="group p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-2"
                            aria-label="Collapse sidebar"
                            aria-expanded={!isCollapsed}
                        >
                            <svg
                                className="w-5 h-5 text-gray-600 transition-all duration-300 group-hover:text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Desktop Expand Button - Only show on desktop when collapsed */}
                    {!isMobile && isCollapsed && (
                        <button
                            onClick={onToggle}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border-2 border-gray-200 hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-200 z-10 group"
                            aria-label="Expand sidebar"
                        >
                            <svg
                                className="w-4 h-4 text-gray-600 group-hover:text-blue-600 rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Mobile Close Button - Only show on mobile */}
                    {isMobile && !isCollapsed && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                            aria-label="Close sidebar"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav 
                className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
                aria-label="Main navigation"
            >
                {menuItems.map((item, index) => {
                    const isActive = isActiveRoute(item.path);
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/40 focus:ring-blue-500'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 focus:ring-gray-300'
                            }`}
                            title={isCollapsed ? item.label : ''}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <div className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                                {item.icon}
                            </div>

                            {!isCollapsed && (
                                <div className="flex-1 flex items-center justify-between min-w-0">
                                    <span className="font-semibold text-sm truncate">{item.label}</span>
                                    {item.badge && (
                                        <span 
                                            className={`ml-auto px-2.5 py-0.5 text-xs font-bold rounded-full ${
                                                isActive 
                                                    ? 'bg-white text-blue-700' 
                                                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                                            } transition-all duration-200`}
                                            aria-label={`${item.badge} pending items`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            )}

                            {isCollapsed && item.badge && (
                                <span 
                                    className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full border-2 border-white shadow-lg"
                                    aria-label={`${item.badge} pending items`}
                                >
                                    {item.badge}
                                </span>
                            )}

                            {!isActive && (
                                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-opacity duration-300 pointer-events-none"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="relative border-t border-gray-200 p-3 bg-white/60 backdrop-blur-sm">
                {!isCollapsed ? (
                    <div className="space-y-2.5">
                        {/* User Profile Card with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200 ring-2 ring-white">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/30"></div>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user?.name || 'Admin User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">Administrator</p>
                                </div>
                                <svg 
                                    className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-all duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    <Link
                                        to="/admin/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        View Profile
                                    </Link>
                                    <Link
                                        to="/admin-dashboard/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                        Preferences
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200 group transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label="Logout from admin panel"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-semibold text-sm">Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {/* Collapsed User Avatar */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer ring-2 ring-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label={`User: ${user?.name || 'Admin User'}`}
                                title={user?.name || 'Admin User'}
                            >
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/30"></div>
                            </button>
                        </div>
                        {/* Collapsed Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            title="Logout"
                            aria-label="Logout from admin panel"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default memo(AdminSidebar);
