import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';
import AdminSummary from '../components/dashboard/AdminSummary';
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const isOpeningRef = useRef(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const closeMobileSidebar = () => {
        // Don't close if we're in the process of opening
        if (isOpeningRef.current) {
            return;
        }

        setIsMobileSidebarOpen(false);
    };

    const openMobileSidebar = (e) => {
        // Prevent event bubbling
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        
        console.log('Opening mobile sidebar');
        isOpeningRef.current = true;
        setIsMobileSidebarOpen(true);
        
        // Reset the opening flag after a short delay
        setTimeout(() => {
            isOpeningRef.current = false;
        }, 300);
    };

    // Debug: Log state changes
    useEffect(() => {

    }, [isMobileSidebarOpen]);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobileSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileSidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={(e) => {
                        e.stopPropagation();
                        closeMobileSidebar();
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - Changed from aside to div */}
            <div
                className={`fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                    isMobile={isMobileSidebarOpen}
                    onClose={closeMobileSidebar}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                {/* Navbar */}
                <Navbar onOpenMobileSidebar={openMobileSidebar} />

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
